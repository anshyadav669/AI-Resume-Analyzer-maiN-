import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.api.endpoints.health import health_check
from app.api.endpoints.analyzer import optimize_bullet_endpoint, analyze_resume_endpoint
from app.schemas.resume import OptimizeBulletRequest


def test_health():
    res = health_check()
    assert res["status"] == "healthy"
    print("Health test passed:", res)


def test_optimize_bullet():
    req = OptimizeBulletRequest(bullet="Maintained cloud databases and fixed critical bugs.")
    res = optimize_bullet_endpoint(req)
    assert res.optimized != ""
    assert res.critique != ""
    print("Optimize bullet test passed:", res.optimized)


def test_analyze():
    jd = "We need a Senior Full-Stack Engineer with Python, React, AWS, Docker and PostgreSQL."
    resume_text = (
        "Alex Chen\n"
        "alex.chen@example.com | 415-555-0199\n"
        "Summary: Senior Software Engineer with 6 years experience in Python, React, AWS, PostgreSQL, Docker.\n"
        "Experience: Architected REST APIs in Python FastAPI and deployed microservices on AWS ECS reducing latency by 40%."
    )
    res = analyze_resume_endpoint(
        resume_file=None,
        resume_text=resume_text,
        job_description=jd,
        target_role="Senior Full-Stack Engineer",
        custom_gemini_key=None
    )
    assert res.scores.overall_score > 0
    assert len(res.skills_analysis) > 0
    print(f"Analyze test passed! Overall score: {res.scores.overall_score}%")


if __name__ == "__main__":
    test_health()
    test_optimize_bullet()
    test_analyze()
    print("ALL DIRECT TESTS COMPLETED SUCCESSFULLY!")
