import os
import pytest
from app.api.endpoints.health import health_check
from app.api.endpoints.analyzer import (
    optimize_bullet_endpoint,
    analyze_resume_endpoint,
    score_resume_endpoint,
    extract_pdf_endpoint,
)
from app.schemas.resume import OptimizeBulletRequest
from fastapi import UploadFile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAMPLE_PDF_PATH = os.path.join(BASE_DIR, "sample_data", "sample_software_engineer.pdf")
SAMPLE_JD_PATH = os.path.join(BASE_DIR, "sample_data", "sample_job_description.txt")


def test_health_check_direct():
    res = health_check()
    assert res["status"] == "healthy"
    assert "service" in res


def test_extract_pdf_direct():
    assert os.path.exists(SAMPLE_PDF_PATH)
    with open(SAMPLE_PDF_PATH, "rb") as f:
        upload = UploadFile(filename="sample_software_engineer.pdf", file=f)
        res = extract_pdf_endpoint(file=upload)
        assert res.filename == "sample_software_engineer.pdf"
        assert res.page_count == 1
        assert res.word_count > 100
        assert res.contact_info.email == "alex.chen@example.com"


def test_score_endpoint_direct():
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd_text = f.read()

    with open(SAMPLE_PDF_PATH, "rb") as f:
        upload = UploadFile(filename="sample_software_engineer.pdf", file=f)
        res = score_resume_endpoint(
            resume_file=upload,
            resume_text=None,
            job_description=jd_text
        )
        assert 0 <= res.overall_score <= 100
        assert len(res.categories) == 5
        assert "technical_skills" in res.categories


def test_analyze_resume_endpoint_direct():
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd_text = f.read()

    with open(SAMPLE_PDF_PATH, "rb") as f:
        upload = UploadFile(filename="sample_software_engineer.pdf", file=f)
        res = analyze_resume_endpoint(
            resume_file=upload,
            resume_text=None,
            job_description=jd_text,
            target_role="Senior Full-Stack Engineer",
            custom_gemini_key=None
        )
        assert res.scores.overall_score > 0
        assert len(res.skills_analysis) > 0
        assert len(res.bullet_improvements) > 0
        assert res.recruiter_verdict != ""


def test_optimize_bullet_direct():
    req = OptimizeBulletRequest(
        bullet="Worked on backend API and made it faster.",
        job_context="FastAPI, PostgreSQL, Redis caching",
        target_role="Backend Engineer"
    )
    res = optimize_bullet_endpoint(payload=req)
    assert res.optimized != ""
    assert res.critique != ""
    assert len(res.optimized) > len(res.original)
