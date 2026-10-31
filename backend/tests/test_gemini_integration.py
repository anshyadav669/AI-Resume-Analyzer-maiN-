import os
import io
import pytest
from fastapi import UploadFile

from app.services.gemini_service import GeminiService
from app.api.endpoints.analyzer import analyze_resume_endpoint

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAMPLE_PDF_PATH = os.path.join(BASE_DIR, "sample_data", "sample_software_engineer.pdf")
SAMPLE_JD_PATH = os.path.join(BASE_DIR, "sample_data", "sample_job_description.txt")


def test_gemini_analysis_schema_and_demonstrated_vs_mentioned():
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd_text = f.read()

    with open(SAMPLE_PDF_PATH, "rb") as f:
        from app.services.pdf_service import PDFService
        with PDFService.save_upload_to_temp_file(UploadFile(filename="resume.pdf", file=f)) as (path, size):
            ext = PDFService.extract_text_from_temp_file(path, "resume.pdf", size)
            resume_text = ext.cleaned_text

    svc = GeminiService()
    result = svc.analyze_resume(
        resume_text=resume_text,
        job_description=jd_text,
        target_role="Senior Full-Stack Engineer"
    )

    # 1. Verify candidate skills and demonstration level
    assert len(result.candidate_skills) > 0, "Candidate skills list is empty"
    levels = {s.demonstration_level for s in result.candidate_skills}
    assert "DEMONSTRATED" in levels or "MENTIONED" in levels
    for skill in result.candidate_skills:
        assert skill.demonstration_level in ["DEMONSTRATED", "MENTIONED"]
        assert skill.name != ""

    # 2. Verify required technical skills from JD
    assert len(result.required_technical_skills) > 0
    for req in result.required_technical_skills:
        assert req.importance in ["MANDATORY", "PREFERRED"]

    # 3. Verify matching & missing skills
    assert len(result.matching_skills) > 0
    assert len(result.missing_skills) > 0
    # GraphQL is in JD but NOT in sample resume -> must be in missing_skills
    assert any("graphql" in s.lower() for s in result.missing_skills), "GraphQL should be flagged as missing"

    # 4. Verify relevant experience and projects
    assert len(result.relevant_experience) > 0
    for exp in result.relevant_experience:
        assert exp.title_or_role != ""
        assert exp.relevance_summary != ""
        assert 0 <= exp.relevance_score <= 100

    # 5. Verify education compatibility
    assert result.education_compatibility is not None
    assert isinstance(result.education_compatibility.is_compatible, bool)
    assert result.education_compatibility.degree_found is not None
    assert result.education_compatibility.analysis != ""

    # 6. Verify strengths and weaknesses
    assert len(result.strengths) >= 2
    assert len(result.weaknesses) >= 2

    # 7. Verify specific improvement suggestions
    assert len(result.improvement_suggestions) >= 2

    # 8. Verify ATS keywords analysis
    assert len(result.ats_keywords.critical_keywords) > 0
    assert len(result.ats_keywords.keywords_present) > 0
    assert len(result.ats_keywords.keywords_missing) > 0

    # 9. Verify Google XYZ bullet point improvements
    assert len(result.bullet_improvements) >= 1
    for rewrite in result.bullet_improvements:
        assert rewrite.original != ""
        assert rewrite.improved != ""
        assert rewrite.critique != ""


def test_sanitize_json_output_markdown_fences():
    fenced = "```json\n{\n  \"status\": \"ok\"\n}\n```"
    sanitized = GeminiService._sanitize_json_output(fenced)
    assert sanitized == '{\n  \"status\": \"ok\"\n}'


def test_analyze_resume_endpoint_with_uploaded_pdf():
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd_text = f.read()

    with open(SAMPLE_PDF_PATH, "rb") as f:
        pdf_bytes = f.read()

    upload = UploadFile(
        filename="sample_software_engineer.pdf",
        file=io.BytesIO(pdf_bytes)
    )

    result = analyze_resume_endpoint(
        resume_file=upload,
        resume_text=None,
        job_description=jd_text,
        target_role="Senior Full-Stack Engineer"
    )

    assert result.candidate_name == "ALEX CHEN" or result.candidate_name == "Alex Chen"
    assert result.scores.overall_score >= 50
    assert len(result.candidate_skills) > 0
    assert len(result.matching_skills) > 0
    assert len(result.missing_skills) > 0
    assert result.education_compatibility.is_compatible is True
    print(f"\nEndpoint test verified: Overall Score: {result.scores.overall_score}%")
    print(f"Candidate: {result.candidate_name} | Role: {result.target_role_detected}")
