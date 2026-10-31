import confetti from 'canvas-confetti';

export const getScoreColor = (score) => {
  if (score >= 80) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      ring: 'ring-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-400',
      stroke: '#10b981',
    };
  }
  if (score >= 65) {
    return {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      ring: 'ring-indigo-500/20',
      gradient: 'from-indigo-500 to-cyan-400',
      stroke: '#6366f1',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      ring: 'ring-amber-500/20',
      gradient: 'from-amber-500 to-orange-400',
      stroke: '#f59e0b',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    ring: 'ring-rose-500/20',
    gradient: 'from-rose-500 to-red-400',
    stroke: '#f43f5e',
  };
};

export const getScoreBadge = (score) => {
  if (score >= 85) return 'Top Tier (ATS Passed)';
  if (score >= 70) return 'Competitive Match';
  if (score >= 50) return 'Average Match';
  return 'Requires Significant Work';
};

export const triggerConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#10b981', '#38bdf8', '#f59e0b'],
  });
};

export const SAMPLE_JOBS = [
  {
    id: 'fullstack',
    title: 'Senior Full-Stack Engineer',
    company: 'Nexus Cloud Technologies',
    text: `Role: Senior Full-Stack Engineer (Python / React / Cloud)
Location: Remote / San Francisco, CA

About the Role:
We are seeking a Senior Full-Stack Engineer to lead the design, development, and scaling of our enterprise data platform. You will build high-performance microservices, create intuitive user interfaces, and optimize cloud infrastructure serving millions of daily requests.

Key Responsibilities:
- Design, build, and maintain robust RESTful APIs using Python (FastAPI/Django) and Node.js.
- Architect dynamic, responsive, and accessible frontend interfaces using React, TypeScript, and modern styling libraries (Tailwind CSS).
- Implement efficient database schemas and queries using PostgreSQL and manage distributed caching with Redis.
- Orchestrate cloud-native microservices using Docker, Kubernetes, and AWS (ECS, Lambda, S3, CloudFront).
- Drive test automation (unit, integration, end-to-end) and maintain robust CI/CD pipelines via GitHub Actions.
- Mentor junior engineers and conduct code reviews.

Qualifications:
- 5+ years of production experience in full-stack software development.
- Strong proficiency in Python and modern TypeScript/React.
- Relational databases (PostgreSQL) and in-memory caches (Redis).
- Containerization (Docker, Kubernetes) and AWS cloud services.
- BS/MS in Computer Science or equivalent practical experience.`,
  },
  {
    id: 'aiml',
    title: 'AI / Machine Learning Engineer',
    company: 'Cognitive AI Labs',
    text: `Role: AI / Machine Learning Engineer (LLMs & RAG)
Location: San Francisco, CA (Hybrid)

Key Responsibilities:
- Build, evaluate, and deploy production Generative AI applications, agentic workflows, and RAG pipelines.
- Integrate foundation models (Gemini API, OpenAI) with vector databases (Pinecone, ChromaDB, pgvector).
- Optimize model latency, prompt engineering architectures, and fine-tuning datasets using Python and PyTorch.
- Collaborate with backend engineers to deploy scalable inference endpoints using FastAPI and Docker.
- Implement automated evaluation benchmarks and guardrails for hallucination detection.

Requirements:
- 3+ years experience building AI/ML applications in Python.
- Proven experience with LLM orchestration (LangChain, LlamaIndex), RAG, and prompt engineering.
- Deep familiarity with PyTorch, Pandas, NumPy, Hugging Face, and Vector DBs.
- Strong software engineering habits (git, CI/CD, Docker, API design).`,
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Infrastructure Engineer',
    company: 'ScaleOps Networks',
    text: `Role: Senior DevOps / Platform Engineer
Location: Remote (US)

Key Responsibilities:
- Architect and maintain enterprise AWS cloud infrastructure using Terraform (Infrastructure-as-Code).
- Deploy and manage high-availability Kubernetes clusters (EKS) across multi-region environments.
- Build reliable CI/CD delivery pipelines using GitHub Actions, ArgoCD, and Helm.
- Implement comprehensive monitoring, alerting, and distributed tracing with Prometheus, Grafana, and Datadog.
- Drive security compliance, zero-trust network policies, and automated vulnerability scanning.

Requirements:
- 4+ years dedicated DevOps, SRE, or Cloud Engineering experience.
- Deep expertise in AWS, Docker, Kubernetes, and Terraform.
- Scripting mastery in Python, Bash, or Go.
- Experience with zero-downtime deployment strategies.`,
  },
];

export const SAMPLE_RESUME_TEXT = `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (415) 555-0199 | linkedin.com/in/alexchen-dev | github.com/alexchen-cloud

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6+ years of experience designing and scaling distributed web applications and cloud microservices. Proven expertise in Python, React, TypeScript, PostgreSQL, and AWS. Track record of reducing latency by 40% and increasing platform reliability for high-traffic SaaS systems.

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, Go, SQL, HTML5/CSS3
Frameworks: FastAPI, React, Node.js, Next.js, Express, Tailwind CSS
Databases & Caching: PostgreSQL, Redis, MongoDB, Elasticsearch
Cloud & DevOps: AWS (ECS, Lambda, S3), Docker, Kubernetes, CI/CD (GitHub Actions), Terraform

PROFESSIONAL EXPERIENCE
Senior Full-Stack Engineer | Nexus Cloud Systems (2022 - Present)
- Architected and deployed microservices backend using FastAPI and PostgreSQL, supporting 500,000+ monthly active users with 99.99% uptime.
- Engineered dynamic analytics dashboard in React and Tailwind CSS, reducing client render times by 35% across 20+ enterprise clients.
- Implemented distributed Redis caching layer, dropping database query load by 48% during peak transaction periods.
- Mentored 4 junior engineers on code quality, testing best practices, and automated CI/CD pipeline deployments.

Software Engineer | Horizon Tech Labs (2019 - 2022)
- Developed RESTful APIs in Python and Node.js for automated customer billing and invoice processing.
- Migrated legacy monolithic services to containerized Docker environments running on AWS ECS.
- Built end-to-end automated test suites with PyTest and Jest, elevating code coverage from 62% to 89%.
- Collaborated with product and design teams in an agile 2-week sprint cycle to deliver 15+ major features.

EDUCATION & CERTIFICATIONS
Bachelor of Science in Computer Science | University of California, Berkeley (2015 - 2019)
AWS Certified Solutions Architect – Associate (2023)`;
