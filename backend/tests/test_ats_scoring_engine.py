import os
import pytest
from app.services.ats_scorer import ATSScoringEngine
from app.schemas.resume import ResumeMetadata, ContactInfo
from app.api.endpoints.analyzer import score_resume_endpoint

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAMPLE_PDF_PATH = os.path.join(BASE_DIR, "sample_data", "sample_software_engineer.pdf")
SAMPLE_JD_PATH = os.path.join(BASE_DIR, "sample_data", "sample_job_description.txt")


def test_mathematical_weights_and_bounds():
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd = f.read()
    
    with open(SAMPLE_PDF_PATH, "rb") as f:
        from app.services.pdf_service import PDFService
        from fastapi import UploadFile
        with PDFService.save_upload_to_temp_file(UploadFile(filename="resume.pdf", file=f)) as (path, size):
            ext = PDFService.extract_text_from_temp_file(path, "resume.pdf", size)
            resume_text = ext.cleaned_text

    result = ATSScoringEngine.evaluate(
        resume_text=resume_text,
        job_description=jd
    )

    cats = result.categories
    assert "technical_skills" in cats
    assert "relevant_experience" in cats
    assert "keyword_coverage" in cats
    assert "education_compatibility" in cats
    assert "structure_and_readability" in cats

    # Check category weights (40% / 25% / 15% / 10% / 10%)
    assert cats["technical_skills"].weight_pct == 40
    assert cats["relevant_experience"].weight_pct == 25
    assert cats["keyword_coverage"].weight_pct == 15
    assert cats["education_compatibility"].weight_pct == 10
    assert cats["structure_and_readability"].weight_pct == 10

    # Check bounds (0 to 100)
    for cat_name, cat in cats.items():
        assert 0.0 <= cat.score <= 100.0, f"Score for {cat_name} ({cat.score}) out of bounds!"
        assert cat.explanation != ""
        expected_contrib = round(cat.score * (cat.weight_pct / 100.0), 2)
        assert abs(cat.weighted_contribution - expected_contrib) <= 0.05

    # Check mathematical composite calculation
    expected_overall = round(
        (cats["technical_skills"].score * 0.40) +
        (cats["relevant_experience"].score * 0.25) +
        (cats["keyword_coverage"].score * 0.15) +
        (cats["education_compatibility"].score * 0.10) +
        (cats["structure_and_readability"].score * 0.10),
        1
    )
    assert abs(result.overall_score - expected_overall) <= 0.1, (
        f"Overall score {result.overall_score} does not match mathematical expectation {expected_overall}"
    )


def test_synonym_matching():
    # JD uses abbreviations & aliases
    jd = "Requirements: We require expert knowledge in Postgres, K8s, and React.js. Preferred: Golang and TS."
    
    # Resume uses canonical and alternative names
    resume = (
        "Alex Chen\n"
        "alex@example.com | 555-0199 | San Francisco, CA\n"
        "Professional Experience:\n"
        "- Engineered distributed database clusters using PostgreSQL and Redis.\n"
        "- Orchestrated microservices with Kubernetes across production environments.\n"
        "- Built interactive web applications in React and TypeScript.\n"
        "Technical Skills:\n"
        "Go, Docker, Python\n"
        "Education:\n"
        "BS in Computer Science"
    )

    result = ATSScoringEngine.evaluate(resume_text=resume, job_description=jd)

    matched_names = [m.skill.lower() for m in result.matched_skills]
    # Check that Postgres matched PostgreSQL
    assert any("postgres" in s for s in matched_names)
    # Check that K8s matched Kubernetes
    assert any("kubernetes" in s for s in matched_names)
    # Check that React.js matched React
    assert any("react" in s for s in matched_names)


def test_demonstrated_vs_mentioned_credit():
    jd = "Must have Python and Docker. Preferred: Rust and Snowflake."
    
    resume = (
        "Jane Doe | jane@example.com | 555-1234\n"
        "Work Experience:\n"
        "- Architected high-performance backend pipelines in Python, increasing throughput by 40%.\n"
        "Technical Skills:\n"
        "Docker, HTML, CSS\n"
        "Education:\n"
        "Bachelor of Science in Computer Science"
    )

    result = ATSScoringEngine.evaluate(resume_text=resume, job_description=jd)

    # Python demonstrated in experience -> 1.0 credit
    python_match = next((s for s in result.matched_skills if "python" in s.skill.lower()), None)
    assert python_match is not None
    assert python_match.score_credit == 1.0
    assert "DEMONSTRATED" in python_match.match_type

    # Docker only listed in skill bank -> 0.50 credit
    docker_match = next((s for s in result.partially_matched_skills if "docker" in s.skill.lower()), None)
    assert docker_match is not None
    assert docker_match.score_credit == 0.50
    assert docker_match.match_type == "SKILL_BANK_MENTIONED"

    # Snowflake absent -> missing
    snowflake_missing = next((s for s in result.missing_skills if "snowflake" in s.skill.lower()), None)
    assert snowflake_missing is not None
    assert snowflake_missing.score_credit == 0.0


def test_academic_and_personal_projects_credit():
    """Verifies that skills demonstrated in academic and personal projects receive appropriate credit (0.95)."""
    jd = "Must have experience with FastAPI, Redis, and React."
    
    resume = (
        "Taylor Swift\n"
        "taylor@example.com | 555-8888 | Seattle, WA\n"
        "Work Experience:\n"
        "- Built frontend web interfaces using React.\n"
        "Academic & Personal Projects:\n"
        "- Architected high-throughput microservice backend in Python FastAPI with Redis caching, serving 10,000 requests/sec.\n"
        "Education:\n"
        "B.S. in Computer Science"
    )

    result = ATSScoringEngine.evaluate(resume_text=resume, job_description=jd)
    
    # FastAPI demonstrated in Projects -> PROJECT_DEMONSTRATED (0.95 credit)
    fastapi_match = next((s for s in result.matched_skills if "fastapi" in s.skill.lower()), None)
    assert fastapi_match is not None
    assert fastapi_match.score_credit == 0.95
    assert fastapi_match.match_type == "PROJECT_DEMONSTRATED"

    # Redis demonstrated in Projects -> 0.95 credit
    redis_match = next((s for s in result.matched_skills if "redis" in s.skill.lower()), None)
    assert redis_match is not None
    assert redis_match.score_credit == 0.95


def test_alternative_or_qualification_groups():
    """Verifies that 'React, Next.js, or Vue.js' does not penalize a candidate who knows React for lacking Vue."""
    jd = (
        "Requirements:\n"
        "- Hands-on experience with modern frontend frameworks (React, Next.js, or Vue.js).\n"
        "- Strong proficiency in Python (FastAPI/Django).\n"
        "- Database experience with PostgreSQL or MySQL."
    )
    
    # Candidate only has React, Python FastAPI, and PostgreSQL (no Vue, no Next.js, no Django, no MySQL)
    resume = (
        "Chris Evans\n"
        "chris@example.com | 555-4321 | Boston, MA\n"
        "Professional Experience:\n"
        "- Built single page applications using React and Tailwind CSS.\n"
        "- Engineered RESTful API microservices in Python and FastAPI with PostgreSQL database storage.\n"
        "Education:\n"
        "B.S. in Software Engineering"
    )

    result = ATSScoringEngine.evaluate(resume_text=resume, job_description=jd)
    
    # Frontend requirement satisfied by React
    matched_skills_str = " ".join(s.skill.lower() for s in result.matched_skills)
    assert "react" in matched_skills_str
    
    # Python framework satisfied by FastAPI
    assert "fastapi" in matched_skills_str
    
    # Missing list should NOT include Vue, Next.js, Django, or MySQL
    missing_skills_str = " ".join(s.skill.lower() for s in result.missing_skills)
    assert "vue" not in missing_skills_str
    assert "django" not in missing_skills_str
    
    # Technical skills score should be high (>= 90%) since all core requirements are satisfied
    assert result.categories["technical_skills"].score >= 90.0


def test_concise_one_page_resume_not_penalized():
    """Verifies that a clean, concise 1-page resume (e.g. 250 words) receives full 30/30 density points."""
    resume = (
        "Devin Lee\n"
        "devin@example.com | (555) 333-2222 | San Jose, CA | linkedin.com/in/devin-lee | github.com/devinlee\n"
        "Professional Summary:\n"
        "Results-driven Software Engineer with 3 years of experience architecting and developing distributed web applications.\n"
        "Proven expertise in Python, React, TypeScript, Docker, SQL, and AWS. Strong track record of improving latency by 35%.\n"
        "Technical Skills:\n"
        "Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3\n"
        "Frameworks: React, FastAPI, Node.js, Express, Tailwind CSS\n"
        "Databases: PostgreSQL, Redis, MongoDB\n"
        "Cloud & DevOps: Docker, AWS (EC2, S3), Git, CI/CD, Linux\n"
        "Work Experience:\n"
        "Software Engineer | CloudScale Inc (2021 - Present)\n"
        "- Developed backend microservices in Python with PostgreSQL handling 20,000 daily active users with 99.9% uptime.\n"
        "- Built interactive dashboard in React and TypeScript reducing client render times by 35% across enterprise accounts.\n"
        "- Automated deployment pipelines using Docker on AWS EC2 instances, reducing release cycles from 2 weeks to 2 days.\n"
        "- Mentored junior engineers on code reviews, automated unit testing, and Agile sprint planning methodologies.\n"
        "Education:\n"
        "Bachelor of Science in Computer Science | San Jose State University (2017 - 2021)"
    )
    jd = "Software Engineer with Python, React, Docker, and AWS."

    result = ATSScoringEngine.evaluate(resume_text=resume, job_description=jd)
    struct_detail = result.categories["structure_and_readability"]
    assert struct_detail.metrics["density_score"] == 30.0
    assert struct_detail.score >= 95.0


def test_unqualified_resume_receives_low_score():
    """Ensures that the engine does NOT artificially inflate scores for mismatched resumes."""
    mismatched_resume = (
        "Pat Baker\n"
        "pat@example.com | 555-0000 | Denver, CO\n"
        "Summary:\n"
        "Chef and Restaurant Manager with 10 years experience in fine dining and inventory management.\n"
        "Experience:\n"
        "Head Chef | Bistro Parisien (2015 - 2024)\n"
        "- Managed kitchen operations, culinary staff, and seasonal menus.\n"
        "Education:\n"
        "Culinary Arts Diploma | Institute of Culinary Education"
    )
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd = f.read()

    result = ATSScoringEngine.evaluate(resume_text=mismatched_resume, job_description=jd)
    assert result.overall_score < 40.0
    assert result.rating_label == "Low Match (Significant Gaps Detected)"
    assert len(result.matched_skills) == 0


def test_related_technology_partial_credit():
    # JD requires GCP, candidate has AWS
    jd = "Must have extensive experience with GCP and Google Cloud infrastructure."
    resume = (
        "DevOps Engineer | devops@example.com | 555-9876\n"
        "Professional Experience:\n"
        "- Managed cloud infrastructure and deployments across AWS and Docker.\n"
        "Education:\n"
        "B.S. in Computer Science"
    )

    result = ATSScoringEngine.evaluate(resume_text=resume, job_description=jd)
    # Candidate should get related technology credit for AWS
    gcp_match = next((s for s in result.partially_matched_skills if "gcp" in s.skill.lower()), None)
    assert gcp_match is not None
    assert gcp_match.match_type == "RELATED_TECHNOLOGY"
    assert gcp_match.score_credit >= 0.40


def test_score_endpoint():
    with open(SAMPLE_JD_PATH, "r", encoding="utf-8") as f:
        jd = f.read()
    
    with open(SAMPLE_PDF_PATH, "rb") as f:
        from fastapi import UploadFile
        import io
        upload = UploadFile(filename="alex_chen.pdf", file=io.BytesIO(f.read()))

    res = score_resume_endpoint(
        resume_file=upload,
        resume_text=None,
        job_description=jd
    )

    assert 0.0 <= res.overall_score <= 100.0
    assert res.rating_label != ""
    assert len(res.categories) == 5
    assert len(res.matched_skills) > 0
    assert len(res.missing_skills) > 0
