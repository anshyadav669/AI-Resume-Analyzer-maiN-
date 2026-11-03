import confetti from 'canvas-confetti';

export const getScoreColor = (score) => {
  if (score >= 80) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      ring: 'ring-emerald-200',
      gradient: 'from-emerald-500 to-teal-500',
      stroke: '#059669',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  }
  if (score >= 65) {
    return {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      ring: 'ring-blue-200',
      gradient: 'from-blue-600 to-indigo-600',
      stroke: '#2563eb',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-600',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      ring: 'ring-amber-200',
      gradient: 'from-amber-500 to-orange-500',
      stroke: '#d97706',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    };
  }
  return {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-200',
    gradient: 'from-rose-500 to-red-500',
    stroke: '#e11d48',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  };
};

export const getScoreBadge = (score) => {
  if (score >= 85) return 'Exceptional - Top 5% ATS Tier';
  if (score >= 70) return 'Strong Match - Interview Ready';
  if (score >= 50) return 'Average Match - Actionable Gaps';
  return 'Requires Work - Critical Gaps';
};

export const triggerConfetti = () => {
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#059669', '#0284c7', '#d97706'],
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
- 3+ years experience building machine learning or LLM applications in Python.
- Proven experience with FastAPI, PyTorch, LangChain or LlamaIndex.
- Strong background in vector embeddings, semantic search, and retrieval-augmented generation.
- Experience with Docker, cloud infrastructure (AWS/GCP), and CI/CD pipelines.
- Degree in Computer Science, Data Science, or related STEM field.`,
  },
  {
    id: 'frontend',
    title: 'Senior Frontend Engineer',
    company: 'Elevate Digital Labs',
    text: `Role: Senior Frontend Engineer (React / TypeScript / Next.js)
Location: Remote

Key Responsibilities:
- Architect high-performance, accessible web applications using React, Next.js, and TypeScript.
- Build clean, reusable component systems with Tailwind CSS and modern design systems.
- Optimize client-side rendering, core web vitals, and bundle size for maximum page speed.
- Collaborate with product designers in Figma to transform high-fidelity mocks into responsive interfaces.
- Write unit, integration, and E2E tests using Jest, React Testing Library, and Playwright.

Requirements:
- 4+ years of professional frontend engineering experience.
- Deep expertise in React, TypeScript, JavaScript (ES6+), and modern CSS (Tailwind CSS).
- Experience with Next.js App Router, server-side rendering (SSR), and state management.
- Strong knowledge of web accessibility (WCAG), responsive design, and cross-browser testing.
- Bachelor's degree in Computer Science, Web Development, or equivalent practical experience.`,
  },
];

export const SAMPLE_RESUME_TEXT = `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (415) 555-0199 | linkedin.com/in/alexchen-dev | github.com/alexchen-cloud

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6+ years of experience designing and scaling distributed web applications and cloud microservices. Proven expertise in Python, React, TypeScript, PostgreSQL, and AWS. Track record of reducing latency by 40% and increasing platform reliability for high-traffic SaaS systems.

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, Go, SQL, HTML5/CSS3
Frameworks & Libraries: FastAPI, React, Node.js, Next.js, Express, Tailwind CSS
Databases & Caching: PostgreSQL, Redis, MongoDB, Elasticsearch
Cloud & DevOps: AWS (ECS, Lambda, S3), Docker, Kubernetes, CI/CD (GitHub Actions), Terraform

PROFESSIONAL EXPERIENCE
Senior Full-Stack Engineer | Nexus Cloud Systems (2022 - Present)
- Architected and deployed microservices backend using FastAPI and PostgreSQL, supporting 500,000+ monthly active users with 99.9% uptime.
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
AWS Certified Solutions Architect – Associate (2023)
`;
