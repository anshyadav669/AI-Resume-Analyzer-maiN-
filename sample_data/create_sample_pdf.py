"""
Generates a realistic sample PDF resume for testing using PyMuPDF.
"""
import os
import fitz

def generate_sample_resume(output_path: str):
    doc = fitz.open()
    page = doc.new_page(width=612, height=792)  # Standard Letter size

    # Content
    header_title = "ALEX CHEN"
    contact_line = "San Francisco, CA | alex.chen@example.com | (415) 555-0199 | linkedin.com/in/alexchen-dev | github.com/alexchen-cloud"
    
    summary_header = "PROFESSIONAL SUMMARY"
    summary_text = (
        "Senior Full-Stack Engineer with 6+ years of experience designing and scaling distributed web applications "
        "and cloud microservices. Proven expertise in Python, React, TypeScript, PostgreSQL, and AWS. "
        "Track record of reducing latency by 40% and increasing platform reliability for high-traffic SaaS systems."
    )

    skills_header = "TECHNICAL SKILLS"
    skills_text = (
        "Languages: Python, JavaScript, TypeScript, Go, SQL, HTML5/CSS3\n"
        "Frameworks: FastAPI, React, Node.js, Next.js, Express, Tailwind CSS\n"
        "Databases & Caching: PostgreSQL, Redis, MongoDB, Elasticsearch\n"
        "Cloud & DevOps: AWS (ECS, Lambda, S3), Docker, Kubernetes, CI/CD (GitHub Actions), Terraform"
    )

    exp_header = "PROFESSIONAL EXPERIENCE"
    
    exp1_title = "Senior Full-Stack Engineer | Nexus Cloud Systems (2022 - Present)"
    exp1_bullets = (
        "- Architected and deployed microservices backend using FastAPI and PostgreSQL, supporting 500,000+ monthly active users with 99.99% uptime.\n"
        "- Engineered dynamic analytics dashboard in React and Tailwind CSS, reducing client render times by 35% across 20+ enterprise clients.\n"
        "- Implemented distributed Redis caching layer, dropping database query load by 48% during peak transaction periods.\n"
        "- Mentored 4 junior engineers on code quality, testing best practices, and automated CI/CD pipeline deployments."
    )

    exp2_title = "Software Engineer | Horizon Tech Labs (2019 - 2022)"
    exp2_bullets = (
        "- Developed RESTful APIs in Python and Node.js for automated customer billing and invoice processing.\n"
        "- Migrated legacy monolithic services to containerized Docker environments running on AWS ECS.\n"
        "- Built end-to-end automated test suites with PyTest and Jest, elevating code coverage from 62% to 89%.\n"
        "- Collaborated with product and design teams in an agile 2-week sprint cycle to deliver 15+ major features."
    )

    edu_header = "EDUCATION & CERTIFICATIONS"
    edu_text = (
        "Bachelor of Science in Computer Science | University of California, Berkeley (2015 - 2019)\n"
        "AWS Certified Solutions Architect – Associate (2023)"
    )

    # Drawing text onto the page
    y = 50
    # Header
    page.insert_text(fitz.Point(50, y), header_title, fontsize=20, fontname="helv", color=(0.1, 0.2, 0.4))
    y += 20
    page.insert_text(fitz.Point(50, y), contact_line, fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))
    y += 25

    sections = [
        (summary_header, summary_text),
        (skills_header, skills_text),
        (exp_header, f"{exp1_title}\n{exp1_bullets}\n{exp2_title}\n{exp2_bullets}"),
        (edu_header, edu_text)
    ]

    for title, content in sections:
        # Section header
        page.insert_text(fitz.Point(50, y), title, fontsize=12, fontname="helv", color=(0.15, 0.25, 0.45))
        y += 5
        # Line divider
        page.draw_line(fitz.Point(50, y), fitz.Point(562, y), color=(0.7, 0.7, 0.7), width=1)
        y += 15

        # Content blocks
        lines = content.split("\n")
        for line in lines:
            is_bold = ("Senior" in line and "Nexus" in line) or ("Software Engineer" in line and "Horizon" in line)
            font = "helv" if not is_bold else "helv"
            size = 9.5 if not is_bold else 10
            color = (0.2, 0.2, 0.2) if not is_bold else (0.1, 0.1, 0.1)
            
            # Wrap long summary lines
            if len(line) > 95 and not line.startswith("-"):
                words = line.split(" ")
                chunk = ""
                for w in words:
                    if len(chunk) + len(w) + 1 > 95:
                        page.insert_text(fitz.Point(50, y), chunk, fontsize=size, fontname=font, color=color)
                        y += 14
                        chunk = w
                    else:
                        chunk = f"{chunk} {w}".strip()
                if chunk:
                    page.insert_text(fitz.Point(50, y), chunk, fontsize=size, fontname=font, color=color)
                    y += 14
            else:
                page.insert_text(fitz.Point(50, y), line, fontsize=size, fontname=font, color=color)
                y += 14
        y += 10

    doc.save(output_path)
    doc.close()
    print(f"Sample resume created successfully at {output_path}")

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    target = os.path.join(out_dir, "sample_software_engineer.pdf")
    generate_sample_resume(target)
