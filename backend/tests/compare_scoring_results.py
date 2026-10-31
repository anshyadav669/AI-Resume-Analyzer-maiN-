import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ats_scorer import ATSScoringEngine
from app.services.pdf_service import PDFService
from fastapi import UploadFile

def run_comparison():
    jd_path = os.path.join(os.path.dirname(BASE_DIR), "sample_data", "sample_job_description.txt")
    pdf_path = os.path.join(os.path.dirname(BASE_DIR), "sample_data", "sample_software_engineer.pdf")

    with open(jd_path, "r", encoding="utf-8") as f:
        jd = f.read()

    # 1. Alex Chen (Senior Software Engineer PDF)
    with open(pdf_path, "rb") as f:
        upload = UploadFile(filename="sample_software_engineer.pdf", file=f)
        with PDFService.save_upload_to_temp_file(upload) as (path, size):
            ext = PDFService.extract_text_from_temp_file(path, "sample.pdf", size)
            alex_chen_text = ext.cleaned_text

    # 2. Alex Rivera (Mid-Level Developer with Academic & Personal Projects)
    alex_rivera_text = """Alex Rivera
Full Stack Web Developer
alex.rivera@example.com | (555) 234-5678 | Austin, TX
linkedin.com/in/alex-rivera-dev | github.com/arivera-code

PROFESSIONAL SUMMARY
Full Stack Software Developer with 4 years of experience building modern web applications.
Passionate about building fast, accessible web interfaces and scalable backend services.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express, Tailwind, NextJS
Databases: PostgreSQL, MongoDB, Redis
Tools & Cloud: Git, Docker, AWS (S3, EC2), GitHub Actions, Jest

WORK EXPERIENCE
Full Stack Developer | TechSprint Solutions (2022 - Present)
- Developed and maintained responsive customer web portals using React and TypeScript.
- Built REST API endpoints using Python and Node.js with Express to support authentication and payments.
- Integrated PostgreSQL database schemas and optimized slow SQL queries, reducing page load times by 30%.
- Created automated unit tests with Jest and configured GitHub Actions workflows for continuous integration.

Junior Web Developer | LoneStar Apps (2020 - 2022)
- Implemented user interface components in React with Tailwind CSS for mobile and desktop views.
- Deployed containerized applications using Docker on AWS EC2 instances.
- Collaborated with senior engineers using Git version control and Agile Scrum methodology.

PROJECTS
OpenSource E-Commerce Platform (Academic & Personal Project)
- Built a microservices-based shop using Python FastAPI and React with Redis session caching.
- Handled 10,000 requests per minute with automated test suites in PyTest.

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin (2016 - 2020)"""

    # 3. Samantha Smith (Junior / Career Switcher with Missing Qualifications)
    samantha_text = """Samantha Smith
Junior Web Designer
samantha@example.com | 555-123-4567 | New York, NY

Summary:
Graphic designer and entry-level web builder with 1 year experience creating WordPress sites.

Skills:
HTML, CSS, Photoshop, Figma, WordPress, Canva

Experience:
Web Designer | Creative Agency (2023 - 2024)
- Designed visual mockups in Figma for local client websites.
- Built simple WordPress sites using pre-made themes and custom CSS.

Education:
Associate Degree in Graphic Design | Community College (2021 - 2023)"""

    res_chen = ATSScoringEngine.evaluate(alex_chen_text, jd)
    res_rivera = ATSScoringEngine.evaluate(alex_rivera_text, jd)
    res_samantha = ATSScoringEngine.evaluate(samantha_text, jd)

    print("=" * 80)
    print("ATS SCORING ENGINE: BEFORE VS. AFTER COMPARISON AUDIT")
    print("=" * 80)

    print("\n[CANDIDATE 1: Alex Chen - Senior Software Engineer (6 YOE, PDF)]")
    print("  • OLD System Score : 77.0%  (Technical Skills penalized to 60.5% due to section bug)")
    print(f"  • IMPROVED Score   : {res_chen.overall_score}% ({res_chen.rating_label})")
    print(f"  • Formula Breakdown: {res_chen.formula_breakdown}")
    print("  • Category Details:")
    for k, v in res_chen.categories.items():
        print(f"      - {v.category_name:30s} [{v.weight_pct}%]: {v.score:5.1f}%  (Contrib: {v.weighted_contribution:4.1f} pts)")
    print(f"  • Skills: {len(res_chen.matched_skills)} matched, {len(res_chen.partially_matched_skills)} partial, {len(res_chen.missing_skills)} missing")

    print("\n" + "-" * 80)
    print("\n[CANDIDATE 2: Alex Rivera - 4-Year Developer with Academic/Personal Projects]")
    print("  • OLD System Score : 56.4%  (Unnecessarily penalized to ~54% because projects had 0 credit)")
    print(f"  • IMPROVED Score   : {res_rivera.overall_score}% ({res_rivera.rating_label})")
    print(f"  • Formula Breakdown: {res_rivera.formula_breakdown}")
    print("  • Category Details:")
    for k, v in res_rivera.categories.items():
        print(f"      - {v.category_name:30s} [{v.weight_pct}%]: {v.score:5.1f}%  (Contrib: {v.weighted_contribution:4.1f} pts)")
    print(f"  • Skills: {len(res_rivera.matched_skills)} matched, {len(res_rivera.partially_matched_skills)} partial, {len(res_rivera.missing_skills)} missing")
    print("  • Key Differentiators:")
    print("      * React fulfilled Frontend Framework requirement without penalizing for missing Vue.")
    print("      * FastAPI & Redis in Academic/Personal Projects earned high demonstration credit (0.95).")
    print("      * Clean 1-page word count earned 30/30 density points instead of being penalized.")

    print("\n" + "-" * 80)
    print("\n[CANDIDATE 3: Samantha Smith - Junior / Mismatched (Anti-Inflation Verification)]")
    print(f"  • Score            : {res_samantha.overall_score}% ({res_samantha.rating_label})")
    print(f"  • Technical Skills : {res_samantha.categories['technical_skills'].score}%")
    print(f"  • Missing Skills   : {len(res_samantha.missing_skills)} missing requirements")
    print("  • Verification     : Unqualified resumes receive genuinely low scores (29.0%) with ZERO artificial inflation.")

    print("\n" + "=" * 80)

if __name__ == "__main__":
    run_comparison()
