import logging
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from app.services.pdf_service import PDFService
from app.services.gemini_service import GeminiService
from app.services.ats_scorer import ATSScoringEngine
from app.schemas.scoring import ATSScoringResult
from app.schemas.resume import (
    ResumeAnalysisResponse,
    ResumeMetadata,
    ScoreBreakdown,
    ExtractPdfResponse,
    OptimizeBulletRequest,
    OptimizeBulletResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Resume Analyzer & AI Engine"])


@router.post("/score", response_model=ATSScoringResult, tags=["Dedicated ATS Scoring Engine"])
def score_resume_endpoint(
    resume_file: Optional[UploadFile] = File(None, description="PDF Resume file"),
    resume_text: Optional[str] = Form(None, description="Raw text of resume"),
    job_description: str = Form(..., description="Target Job Description text"),
):
    """
    Dedicated mathematical ATS Scoring Engine.
    Evaluates:
    - Technical skills: 40%
    - Relevant projects & experience: 25%
    - Keyword coverage: 15%
    - Education compatibility: 10%
    - Resume structure & readability: 10%
    
    Identifies matched, partially matched (synonyms/mentioned), and missing skills.
    Calculates weighted composite score mathematically without external AI dependencies.
    """
    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description must be at least 20 characters long."
        )

    extracted_text = ""
    contact_info = None
    metadata = None

    if resume_file:
        filename = resume_file.filename or "resume.pdf"
        with PDFService.save_upload_to_temp_file(resume_file) as (temp_path, file_size):
            extraction = PDFService.extract_text_from_temp_file(temp_path, filename, file_size)
            extracted_text = extraction.cleaned_text
            contact_info = extraction.contact_info
            metadata = ResumeMetadata(
                page_count=extraction.page_count,
                word_count=extraction.word_count,
                reading_time_seconds=max(15, int((extraction.word_count / 200) * 60)),
                has_contact_info=bool(contact_info.email or contact_info.phone),
                is_ats_parsable=extraction.word_count >= 100,
                file_name=filename
            )
    elif resume_text and len(resume_text.strip()) >= 50:
        extracted_text = resume_text.strip()
        contact_info = PDFService._extract_contact_info(extracted_text, [])
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either a PDF resume file or paste at least 50 characters of resume text."
        )

    result = ATSScoringEngine.evaluate(
        resume_text=extracted_text,
        job_description=job_description,
        metadata=metadata,
        contact_info=contact_info
    )
    return result


@router.post("/extract-pdf", response_model=ExtractPdfResponse, tags=["PDF Extraction"])
def extract_pdf_endpoint(
    file: UploadFile = File(..., description="PDF Resume to extract")
):
    filename = file.filename or "resume.pdf"
    with PDFService.save_upload_to_temp_file(file) as (temp_path, file_size):
        extraction = PDFService.extract_text_from_temp_file(temp_path, filename, file_size)

    preview = extraction.cleaned_text[:400] + "..." if len(extraction.cleaned_text) > 400 else extraction.cleaned_text

    return ExtractPdfResponse(
        filename=filename,
        page_count=extraction.page_count,
        word_count=extraction.word_count,
        text_preview=preview,
        full_text=extraction.cleaned_text,
        contact_info=extraction.contact_info,
    )


@router.post("/analyze", response_model=ResumeAnalysisResponse, tags=["Resume Analyzer"])
def analyze_resume_endpoint(
    resume_file: Optional[UploadFile] = File(None, description="PDF Resume file"),
    resume_text: Optional[str] = Form(None, description="Raw text of resume (if not uploading file)"),
    job_description: str = Form(..., description="Target Job Description text"),
    target_role: Optional[str] = Form(None, description="Optional target title or role"),
    custom_gemini_key: Optional[str] = Form(None, description="Optional per-request Gemini API key"),
):
    """
    Full ATS semantic and mathematical audit combining PyMuPDF, Gemini API,
    and the standalone mathematical ATS Scoring Engine.
    """
    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description must be at least 20 characters long to perform meaningful matching."
        )

    extracted_text = ""
    contact_info = None
    metadata = None

    if resume_file:
        filename = resume_file.filename or "resume.pdf"
        with PDFService.save_upload_to_temp_file(resume_file) as (temp_path, file_size):
            extraction = PDFService.extract_text_from_temp_file(temp_path, filename, file_size)
            extracted_text = extraction.cleaned_text
            contact_info = extraction.contact_info
            metadata = ResumeMetadata(
                page_count=extraction.page_count,
                word_count=extraction.word_count,
                reading_time_seconds=max(15, int((extraction.word_count / 200) * 60)),
                has_contact_info=bool(contact_info.email or contact_info.phone),
                is_ats_parsable=extraction.word_count >= 100,
                file_name=filename
            )
    elif resume_text and len(resume_text.strip()) >= 50:
        extracted_text = resume_text.strip()
        contact_info = PDFService._extract_contact_info(extracted_text, [])
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either a valid PDF resume file or paste resume text (at least 50 chars)."
        )

    clean_key = custom_gemini_key if isinstance(custom_gemini_key, str) and len(custom_gemini_key.strip()) > 10 else None
    clean_role = target_role if isinstance(target_role, str) else None

    # 1. Run Dedicated Mathematical Scoring Engine
    scoring_eval = ATSScoringEngine.evaluate(
        resume_text=extracted_text,
        job_description=job_description,
        metadata=metadata,
        contact_info=contact_info
    )

    # 2. Run Gemini Semantic AI Analysis
    gemini_svc = GeminiService(api_key=clean_key)
    analysis_result = gemini_svc.analyze_resume(
        resume_text=extracted_text,
        job_description=job_description,
        target_role=clean_role
    )

    # 3. Synchronize mathematical scores with 40/25/15/10/10 weights
    analysis_result.scores = ScoreBreakdown(
        overall_score=int(round(scoring_eval.overall_score)),
        keyword_match_score=int(round(scoring_eval.categories["technical_skills"].score)),
        experience_impact_score=int(round(scoring_eval.categories["relevant_experience"].score)),
        education_cert_score=int(round(scoring_eval.categories["education_compatibility"].score)),
        formatting_readability_score=int(round(scoring_eval.categories["structure_and_readability"].score))
    )
    analysis_result.detailed_scoring = scoring_eval.model_dump()
    if metadata:
        analysis_result.metadata = metadata

    if contact_info and not analysis_result.candidate_name and contact_info.name:
        analysis_result.candidate_name = contact_info.name

    return analysis_result


@router.post("/optimize-bullet", response_model=OptimizeBulletResponse, tags=["Bullet Point Optimizer"])
def optimize_bullet_endpoint(
    payload: OptimizeBulletRequest
):
    if not payload.bullet or len(payload.bullet.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bullet point must be at least 10 characters long to rewrite."
        )

    gemini_svc = GeminiService()
    result = gemini_svc.optimize_bullet(
        bullet=payload.bullet,
        job_context=payload.job_context or "",
        target_role=payload.target_role or ""
    )
    return result
