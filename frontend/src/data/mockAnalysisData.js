export const DEFAULT_MOCK_ANALYSIS = {
  candidate_name: "Alex Chen",
  target_role_detected: "Senior Full-Stack Engineer (Python / React / Cloud)",
  scores: {
    overall_score: 84,
    keyword_match_score: 86,
    experience_impact_score: 88,
    formatting_readability_score: 91,
    education_cert_score: 82,
  },
  skills_analysis: [
    {
      category: "Languages & Frameworks",
      matched: ["Python", "React", "TypeScript", "FastAPI", "Node.js", "Next.js", "SQL", "Tailwind CSS"],
      missing: ["GraphQL", "Golang"],
    },
    {
      category: "Cloud & Infrastructure",
      matched: ["AWS (ECS, S3)", "Docker", "Kubernetes", "CI/CD"],
      missing: ["Terraform", "AWS Lambda"],
    },
    {
      category: "Databases & Caching",
      matched: ["PostgreSQL", "Redis"],
      missing: ["Elasticsearch", "Snowflake"],
    },
    {
      category: "DevOps & Engineering Practices",
      matched: ["GitHub Actions", "Microservices", "RESTful APIs", "Unit Testing", "PyTest"],
      missing: ["Datadog", "Prometheus"],
    },
    {
      category: "Soft Skills & Leadership",
      matched: ["Mentorship", "Agile / Scrum", "Code Review", "Cross-Functional Collaboration"],
      missing: ["Stakeholder Management"],
    },
  ],
  missing_critical_skills: ["GraphQL", "Terraform", "Datadog", "AWS Lambda"],
  missing_bonus_skills: ["Snowflake", "Elasticsearch", "Golang"],
  strengths: [
    "High density of quantifiable business achievements (e.g., 40% latency reduction, 500k+ MAU scale, 99.99% uptime).",
    "Strong technical core in Python (FastAPI) and modern React/TypeScript web applications.",
    "Clean, ATS-optimized layout with 100% parseable contact details and standard section headers.",
    "B.S. in Computer Science combined with an active AWS Solutions Architect Associate credential.",
  ],
  weaknesses: [
    "Job description mandates GraphQL API experience, which is completely absent from the resume text.",
    "Infrastructure as Code (Terraform) is required for platform deployments but not substantiated in work history.",
    "Several junior-level bullet points from earlier employment lack metrics and focus on passive routine tasks.",
  ],
  bullet_improvements: [
    {
      original: "Responsible for developing backend APIs and managing server deployment.",
      improved: "Architected 12+ RESTful microservices in FastAPI/PostgreSQL, reducing API response latency by 42% and sustaining 99.99% uptime across 500k+ monthly active users.",
      critique: "Replaced weak passive phrasing ('Responsible for') with a commanding action verb ('Architected') and anchored the result to latency reduction, uptime SLA, and scale.",
    },
    {
      original: "Worked on frontend user interfaces and fixed bugs reported by QA.",
      improved: "Spearheaded modular design system in React 18 & TypeScript, cutting feature delivery cycles by 3 weeks and slashing production UI defects by 38%.",
      critique: "Highlights engineering velocity and code quality improvements with clear percentage metrics instead of vague bug-fixing duties.",
    },
    {
      original: "Set up Redis caching to make the database run faster.",
      improved: "Engineered distributed Redis caching architecture, offloading 48% of high-concurrency database queries during peak transaction spikes.",
      critique: "Specifies exact technical design pattern and proves measurable reduction in database resource utilization.",
    },
  ],
  sections_review: [
    {
      section_name: "Professional Summary",
      status: "OPTIMAL",
      observations: [
        "Concise 3-line summary immediately highlights years of experience, core tech stack, and primary business value.",
      ],
      recommendations: [
        "Include target keywords 'Distributed Microservices' and 'Cloud Architecture' in sentence 1.",
      ],
    },
    {
      section_name: "Work Experience",
      status: "OPTIMAL",
      observations: [
        "Strong bullet structure with action verbs and metrics across Nexus Cloud Systems and Horizon Tech.",
      ],
      recommendations: [
        "Add 1 bullet highlighting collaborative code review throughput or CI/CD cycle velocity.",
      ],
    },
    {
      section_name: "Technical Skills Matrix",
      status: "NEEDS_IMPROVEMENT",
      observations: [
        "Skills are cleanly grouped, but missing 2 primary keywords emphasized in the target job description.",
      ],
      recommendations: [
        "Incorporate GraphQL into Frameworks and Terraform into Cloud/DevOps categories.",
      ],
    },
    {
      section_name: "Education & Credentials",
      status: "OPTIMAL",
      observations: [
        "Accredited CS degree and relevant AWS certification prominently placed at the bottom.",
      ],
      recommendations: [
        "Include certificate validation ID or active expiration year for instant verification.",
      ],
    },
  ],
  recruiter_verdict: "Alex Chen is an exceptional candidate (84% ATS compatibility rating) for the Senior Full-Stack Engineer role. The resume demonstrates deep hands-on expertise in scaling cloud architectures, high code quality ownership, and undeniable metric impact. Incorporating missing requirements around GraphQL and Terraform will comfortably propel this candidate into the top 5% interview pool.",
  action_items_priority: [
    "Integrate 'GraphQL' and 'Terraform' into your Skills matrix and work experience bullet points.",
    "Elevate earlier experience bullets by replacing passive duty descriptions with the Google XYZ formula.",
    "Explicitly mention your AWS ECS and Docker container orchestration workflows in your primary job headline.",
    "Verify clickable LinkedIn and GitHub portfolio anchors are active in the document header.",
  ],
  metadata: {
    page_count: 1,
    word_count: 271,
    reading_time_seconds: 81,
    has_contact_info: true,
    is_ats_parsable: true,
    file_name: "Alex_Chen_Senior_FullStack_Resume.pdf",
  },
};

export const generateMockAnalysis = (candidateName = "Candidate", role = "Software Engineer", fileName = "resume.pdf") => {
  return {
    ...DEFAULT_MOCK_ANALYSIS,
    candidate_name: candidateName || "Alex Chen",
    target_role_detected: role || "Senior Software Engineer",
    metadata: {
      ...DEFAULT_MOCK_ANALYSIS.metadata,
      file_name: fileName || "resume.pdf",
    },
  };
};
