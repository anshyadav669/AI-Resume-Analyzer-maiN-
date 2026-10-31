import re
from typing import Dict, Any, List, Tuple, Optional, Set
from collections import Counter

from app.schemas.scoring import (
    ATSScoringResult,
    CategoryScoreDetail,
    SkillMatchDetail,
)
from app.schemas.resume import ContactInfo, ResumeMetadata, ScoreBreakdown


class ATSScoringEngine:
    """
    Enterprise-grade, standalone ATS Scoring Engine.
    Operates mathematically without external API dependencies.
    
    Category Weights (Strictly Mathematical):
    - Technical Skills: 40%
    - Relevant Projects & Experience: 25%
    - Keyword Coverage: 15%
    - Education Compatibility: 10%
    - Resume Structure & Readability: 10%
    Total = 100%
    """

    # Exact Configured Weights
    WEIGHT_TECHNICAL_SKILLS = 0.40
    WEIGHT_PROJECTS_EXPERIENCE = 0.25
    WEIGHT_KEYWORD_COVERAGE = 0.15
    WEIGHT_EDUCATION = 0.10
    WEIGHT_STRUCTURE_READABILITY = 0.10

    # Strong technical and leadership action verbs
    ACTION_VERBS = {
        "architected", "developed", "engineered", "implemented", "optimized",
        "spearheaded", "designed", "reduced", "increased", "accelerated",
        "delivered", "managed", "led", "automated", "scaled", "orchestrated",
        "streamlined", "transformed", "boosted", "deployed", "refactored",
        "integrated", "authored", "migrated", "built", "established", "mentored",
        "launched", "configured", "maintained", "collaborated", "created"
    }

    # Standard Section Header Patterns
    SECTION_PATTERNS = {
        "summary": [
            r"^(?:professional\s+|executive\s+|career\s+)?(?:summary|objective|profile|about\s+me)\b",
            r"^(?:summary|profile|about\s+me)$"
        ],
        "skills": [
            r"^(?:technical\s+|core\s+)?(?:skills|technologies|competencies|proficiencies|tools)\b",
            r"^(?:skills\s+(&|and)\s+tools|areas\s+of\s+expertise|technical\s+stack)$"
        ],
        "experience": [
            r"^(?:professional\s+|work\s+|relevant\s+)?(?:experience|employment|work\s+history)\b",
            r"^(?:employment\s+history|professional\s+background)$"
        ],
        "projects": [
            r"^(?:key\s+|personal\s+|academic\s+|technical\s+|academic\s+(?:&|and)\s+personal\s+)?(?:projects|open\s+source|capstone)\b",
            r"^(?:project\s+work|featured\s+projects|selected\s+projects)$"
        ],
        "education": [
            r"^(?:education|academic\s+background|academics|degrees)\b",
            r"^(?:education\s+(&|and)\s+(?:training|certifications?))$"
        ],
        "certifications": [
            r"^(?:certifications|certificates|licenses|professional\s+credentials)\b",
            r"^(?:licenses\s+(&|and)\s+certifications)$"
        ]
    }

    # Comprehensive Technical Synonyms & Aliases Ontology
    SYNONYM_MAP: Dict[str, List[str]] = {
        "react": ["react", "react.js", "reactjs", "react native", "react-native"],
        "next.js": ["next.js", "nextjs", "next js", "next"],
        "vue": ["vue", "vue.js", "vuejs", "vue 3", "vue2", "vue3"],
        "angular": ["angular", "angularjs", "angular 2+"],
        "tailwind css": ["tailwind css", "tailwind", "tailwindcss"],
        "node.js": ["node.js", "nodejs", "node js", "node"],
        "express": ["express", "express.js", "expressjs"],
        "python": ["python", "python3", "py"],
        "fastapi": ["fastapi", "fast api", "fast-api"],
        "django": ["django", "django rest framework", "drf"],
        "flask": ["flask"],
        "typescript": ["typescript", "ts"],
        "javascript": ["javascript", "ecmascript", "es6", "vanilla js"],
        "golang": ["golang", "go language", "go"],
        "kubernetes": ["kubernetes", "k8s"],
        "docker": ["docker", "containerization", "containers", "containerized"],
        "postgresql": ["postgresql", "postgres", "psql", "postgre sql"],
        "mongodb": ["mongodb", "mongo", "nosql"],
        "redis": ["redis", "redis cache", "in-memory cache", "caching"],
        "elasticsearch": ["elasticsearch", "elastic search", "elk"],
        "aws": ["aws", "amazon web services", "amazon cloud", "ec2", "s3", "ecs", "lambda", "cloudfront"],
        "gcp": ["gcp", "google cloud", "google cloud platform"],
        "azure": ["azure", "microsoft azure"],
        "ci/cd": ["ci/cd", "ci cd", "cicd", "continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"],
        "restful apis": ["rest", "restful", "rest api", "rest apis", "restful apis", "restful api", "restful web services"],
        "graphql": ["graphql", "apollo", "apollo graphql"],
        "terraform": ["terraform", "iac", "infrastructure as code"],
        "c++": ["c++", "cpp"],
        "c#": ["c#", "csharp", ".net", "dotnet"],
        "java": ["java", "jvm", "spring", "spring boot"],
        "sql": ["sql", "rdbms", "relational database", "relational databases", "mysql", "sqlite", "oracle"],
        "microservices": ["microservices", "microservice", "microservice architecture", "distributed systems"],
        "unit testing": ["unit testing", "unit tests", "testing", "pytest", "jest", "cypress", "tdd", "test automation"],
        "system design": ["system design", "distributed systems architecture", "software architecture"],
        "agile": ["agile", "scrum", "kanban", "sprints", "sprint planning"],
        "rust": ["rust", "rustlang"],
        "snowflake": ["snowflake", "snowflake db"],
        "html/css": ["html", "html5", "css", "css3", "sass", "scss", "html5/css3"],
        "linux": ["linux", "unix", "bash", "shell"],
        "git": ["git", "github", "gitlab", "version control"],
        "datadog": ["datadog", "datadog/prometheus", "prometheus", "grafana", "observability", "monitoring"],
    }

    # Related technology families for partial match credit
    RELATED_FAMILIES = [
        {"aws", "gcp", "azure"},
        {"react", "vue", "angular", "next.js", "svelte"},
        {"postgresql", "mysql", "sql", "sqlite", "oracle"},
        {"mongodb", "cassandra", "dynamodb", "redis", "elasticsearch"},
        {"fastapi", "flask", "django", "express", "node.js"},
        {"docker", "kubernetes", "podman"},
        {"python", "golang", "rust", "java", "c++"},
        {"jest", "pytest", "cypress", "unit testing"},
        {"tailwind css", "html/css"},
        {"datadog", "prometheus", "grafana"},
    ]

    # English Conversational Stopwords and Generic Fillers
    STOPWORDS = {
        "a", "an", "the", "and", "or", "but", "if", "in", "on", "at", "to", "for",
        "of", "with", "by", "as", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "can", "could", "should", "would",
        "may", "might", "must", "will", "shall", "about", "above", "across", "after",
        "we", "you", "they", "our", "their", "role", "looking", "candidate", "job",
        "experience", "years", "working", "work", "responsibilities", "requirements",
        "qualifications", "skills", "ability", "strong", "preferred", "must", "plus",
        "using", "used", "robust", "modern", "maintain", "maintaining", "seeking",
        "lead", "serving", "create", "creating", "drive", "driving", "collaborate",
        "closely", "deliver", "delivering", "across", "equivalent", "practical",
        "familiarity", "proven", "excellent", "self", "direction", "hands", "deep",
        "high", "intuitive", "dynamic", "responsive", "accessible", "key", "about",
        "location", "build", "building", "engineer", "engineering", "developer", "development"
    }

    # Common Lemma / Stemming Normalization Table for Domain Keywords
    LEMMA_MAP = {
        "optimizing": "optimize", "optimization": "optimize", "optimized": "optimize", "optimizes": "optimize",
        "scaling": "scale", "scalability": "scale", "scaled": "scale", "scales": "scale",
        "deploying": "deploy", "deployment": "deploy", "deployments": "deploy", "deployed": "deploy",
        "automating": "automate", "automation": "automate", "automated": "automate", "automates": "automate",
        "architecting": "architect", "architecture": "architect", "architected": "architect", "architectures": "architect",
        "testing": "test", "tests": "test", "tested": "test",
        "designing": "design", "designs": "design", "designed": "design",
        "managing": "manage", "management": "manage", "managed": "manage",
        "monitoring": "monitor", "monitored": "monitor",
        "caching": "cache", "cached": "cache", "caches": "cache",
        "integrating": "integrate", "integration": "integrate", "integrated": "integrate",
        "migrating": "migrate", "migration": "migrate", "migrated": "migrate",
        "containers": "container", "containerized": "container", "containerization": "container",
        "microservices": "microservice",
        "queries": "query", "querying": "query",
        "interfaces": "interface",
    }

    @classmethod
    def evaluate(
        cls,
        resume_text: str,
        job_description: str,
        metadata: Optional[ResumeMetadata] = None,
        contact_info: Optional[ContactInfo] = None
    ) -> ATSScoringResult:
        """
        Executes complete mathematical ATS scoring across all 5 parameters:
        1. Technical skills (40%)
        2. Relevant projects & experience (25%)
        3. Keyword coverage (15%)
        4. Education compatibility (10%)
        5. Resume structure & readability (10%)
        """
        resume_clean = resume_text.strip()
        jd_clean = job_description.strip()

        # Parse structured resume sections
        sections = cls._parse_resume_sections(resume_clean)

        # 1. Technical Skills Evaluation (40%)
        tech_score, tech_details, matched_skills, partial_skills, missing_skills = cls._evaluate_technical_skills(
            sections, jd_clean
        )

        # 2. Relevant Projects & Experience Evaluation (25%)
        proj_score, proj_details = cls._evaluate_projects_and_experience(
            sections, jd_clean
        )

        # 3. Keyword Coverage Evaluation (15%)
        kw_score, kw_details = cls._evaluate_keyword_coverage(
            resume_clean, jd_clean
        )

        # 4. Education Compatibility Evaluation (10%)
        edu_score, edu_details = cls._evaluate_education_compatibility(
            sections, jd_clean
        )

        # 5. Resume Structure & Readability Evaluation (10%)
        struct_score, struct_details = cls._evaluate_structure_and_readability(
            resume_clean, sections, metadata, contact_info
        )

        # Mathematical Composite Score Calculation:
        # Final Score = (Tech * 0.40) + (Proj * 0.25) + (KW * 0.15) + (Edu * 0.10) + (Struct * 0.10)
        final_score = round(
            (tech_score * cls.WEIGHT_TECHNICAL_SKILLS) +
            (proj_score * cls.WEIGHT_PROJECTS_EXPERIENCE) +
            (kw_score * cls.WEIGHT_KEYWORD_COVERAGE) +
            (edu_score * cls.WEIGHT_EDUCATION) +
            (struct_score * cls.WEIGHT_STRUCTURE_READABILITY),
            1
        )
        final_score = min(100.0, max(0.0, final_score))

        # Rating Tier Label
        if final_score >= 82.0:
            rating_label = "Exceptional Match (Top 5% ATS Tier)"
        elif final_score >= 70.0:
            rating_label = "Strong Match (Interview Competitive)"
        elif final_score >= 52.0:
            rating_label = "Moderate Match (Needs Targeted Improvements)"
        else:
            rating_label = "Low Match (Significant Gaps Detected)"

        formula_str = (
            f"Overall Score = ({tech_score:.1f} × 0.40) + ({proj_score:.1f} × 0.25) + "
            f"({kw_score:.1f} × 0.15) + ({edu_score:.1f} × 0.10) + ({struct_score:.1f} × 0.10) "
            f"= {final_score:.1f}%"
        )

        categories = {
            "technical_skills": CategoryScoreDetail(
                category_name="Technical Skills",
                weight_pct=40,
                score=round(tech_score, 1),
                weighted_contribution=round(tech_score * cls.WEIGHT_TECHNICAL_SKILLS, 2),
                explanation=tech_details["explanation"],
                metrics=tech_details
            ),
            "relevant_experience": CategoryScoreDetail(
                category_name="Relevant Projects & Experience",
                weight_pct=25,
                score=round(proj_score, 1),
                weighted_contribution=round(proj_score * cls.WEIGHT_PROJECTS_EXPERIENCE, 2),
                explanation=proj_details["explanation"],
                metrics=proj_details
            ),
            "keyword_coverage": CategoryScoreDetail(
                category_name="Keyword Coverage",
                weight_pct=15,
                score=round(kw_score, 1),
                weighted_contribution=round(kw_score * cls.WEIGHT_KEYWORD_COVERAGE, 2),
                explanation=kw_details["explanation"],
                metrics=kw_details
            ),
            "education_compatibility": CategoryScoreDetail(
                category_name="Education Compatibility",
                weight_pct=10,
                score=round(edu_score, 1),
                weighted_contribution=round(edu_score * cls.WEIGHT_EDUCATION, 2),
                explanation=edu_details["explanation"],
                metrics=edu_details
            ),
            "structure_and_readability": CategoryScoreDetail(
                category_name="Resume Structure & Readability",
                weight_pct=10,
                score=round(struct_score, 1),
                weighted_contribution=round(struct_score * cls.WEIGHT_STRUCTURE_READABILITY, 2),
                explanation=struct_details["explanation"],
                metrics=struct_details
            )
        }

        return ATSScoringResult(
            overall_score=final_score,
            rating_label=rating_label,
            categories=categories,
            matched_skills=matched_skills,
            partially_matched_skills=partial_skills,
            missing_skills=missing_skills,
            formula_breakdown=formula_str
        )

    # =========================================================================
    # SECTION PARSER
    # =========================================================================
    @classmethod
    def _parse_resume_sections(cls, text: str) -> Dict[str, str]:
        """
        Parses resume text into clean, structured sections based on line-level headings.
        Prevents inline phrases (like '6+ years of experience') from corrupting section boundaries.
        """
        sections: Dict[str, List[str]] = {
            "summary": [],
            "skills": [],
            "experience": [],
            "projects": [],
            "education": [],
            "certifications": [],
            "other": []
        }
        current_sec = "other"

        for line in text.splitlines():
            line_clean = line.strip()
            if not line_clean:
                continue

            # Identify if this line is an actual section heading
            is_heading = False
            # Check length: real section headings are concise (< 45 chars)
            if len(line_clean) <= 45:
                # Strip trailing colons or dashes
                header_test = line_clean.rstrip(":-— ")
                for sec_name, patterns in cls.SECTION_PATTERNS.items():
                    if any(re.search(pat, header_test, re.IGNORECASE) for pat in patterns):
                        current_sec = sec_name
                        is_heading = True
                        break

            if not is_heading:
                sections[current_sec].append(line_clean)

        result = {k: "\n".join(v) for k, v in sections.items()}
        # Combined demonstrated text: work experience + academic/personal projects
        result["demonstrated_text"] = (result["experience"] + "\n\n" + result["projects"]).strip()
        # Full text fallback
        result["full_text"] = text
        return result

    # =========================================================================
    # 1. TECHNICAL SKILLS MODULE (40%)
    # =========================================================================
    @classmethod
    def _evaluate_technical_skills(
        cls, sections: Dict[str, str], jd_text: str
    ) -> Tuple[float, Dict[str, Any], List[SkillMatchDetail], List[SkillMatchDetail], List[SkillMatchDetail]]:
        """
        Evaluates technical skills with:
        - Alternative requirement ("OR") satisfaction (e.g. React OR Vue OR Next.js)
        - Evidence levels: Work Experience (1.0), Projects (0.95), Summary (0.75), Skill Bank (0.50)
        - Mandatory (weight 2.0) vs. Preferred (weight 0.8) distinction
        - Synonym & related technology resolution
        """
        exp_text = sections.get("experience", "").lower()
        proj_text = sections.get("projects", "").lower()
        skills_text = sections.get("skills", "").lower()
        summary_text = sections.get("summary", "").lower()
        full_text = sections.get("full_text", "").lower()

        # Extract JD skills with importance & alternative groups
        jd_requirements, alt_groups = cls._extract_jd_requirements(jd_text)

        matched: List[SkillMatchDetail] = []
        partial: List[SkillMatchDetail] = []
        missing: List[SkillMatchDetail] = []

        total_weight_possible = 0.0
        total_weight_earned = 0.0

        # Track satisfied alternative groups so we don't penalize alternatives
        satisfied_group_ids: Set[str] = set()

        # Step 1: Pre-evaluate alternative groups
        for group in alt_groups:
            group_id = group["id"]
            skills_in_group = group["skills"]
            importance = group["importance"]
            best_evidence = None
            best_credit = 0.0
            best_skill = None
            best_alias = None

            for s in skills_in_group:
                aliases = cls.SYNONYM_MAP.get(s, [s])
                for alias in aliases:
                    pat = rf"\b{re.escape(alias)}\b"
                    if re.search(pat, exp_text):
                        if 1.0 > best_credit:
                            best_credit = 1.0
                            best_skill = s
                            best_alias = alias
                            best_evidence = cls._extract_evidence_line(sections["experience"], alias)
                    elif re.search(pat, proj_text):
                        if 0.95 > best_credit:
                            best_credit = 0.95
                            best_skill = s
                            best_alias = alias
                            best_evidence = cls._extract_evidence_line(sections["projects"], alias)
                    elif re.search(pat, summary_text):
                        if 0.75 > best_credit:
                            best_credit = 0.75
                            best_skill = s
                            best_alias = alias
                            best_evidence = cls._extract_evidence_line(sections["summary"], alias)
                    elif re.search(pat, full_text):
                        if 0.50 > best_credit:
                            best_credit = 0.50
                            best_skill = s
                            best_alias = alias
                            best_evidence = cls._extract_evidence_line(sections["skills"] or full_text, alias)

            if best_credit > 0.0 and best_skill:
                satisfied_group_ids.add(group_id)
                # Assign credit for this entire requirement group
                weight = 2.0 if importance == "MANDATORY" else 0.8
                total_weight_possible += weight
                total_weight_earned += weight * best_credit

                detail_status = "matched" if best_credit >= 0.75 else "partially_matched"
                detail_type = (
                    "WORK_DEMONSTRATED" if best_credit == 1.0
                    else "PROJECT_DEMONSTRATED" if best_credit == 0.95
                    else "SUMMARY_DEMONSTRATED" if best_credit == 0.75
                    else "SKILL_BANK_MENTIONED"
                )
                item = SkillMatchDetail(
                    skill=f"{best_skill.title()} (fulfills {group['label']})",
                    status=detail_status,
                    importance=importance,
                    match_type=detail_type,
                    score_credit=best_credit,
                    evidence=best_evidence,
                    synonym_matched=best_alias if best_alias != best_skill else None
                )
                if detail_status == "matched":
                    matched.append(item)
                else:
                    partial.append(item)

        # Step 2: Evaluate individual skills not part of satisfied alternative groups
        for canon_skill, req_info in jd_requirements.items():
            importance = req_info["importance"]
            group_id = req_info.get("group_id")

            # If this skill is part of an already satisfied alternative group, skip to avoid double counting or penalizing
            if group_id and group_id in satisfied_group_ids:
                continue

            # Weighting: Mandatory = 2.0x, Preferred = 0.8x
            weight = 2.0 if importance == "MANDATORY" else 0.8
            total_weight_possible += weight

            aliases = cls.SYNONYM_MAP.get(canon_skill, [canon_skill])
            found_alias = None
            evidence_line = None
            credit = 0.0
            match_type = "NOT_FOUND"

            # Check evidence in hierarchical order
            for alias in aliases:
                pat = rf"\b{re.escape(alias)}\b"
                if re.search(pat, exp_text):
                    credit = 1.0
                    found_alias = alias
                    match_type = "WORK_DEMONSTRATED"
                    evidence_line = cls._extract_evidence_line(sections["experience"], alias)
                    break
                elif re.search(pat, proj_text):
                    credit = 0.95
                    found_alias = alias
                    match_type = "PROJECT_DEMONSTRATED"
                    evidence_line = cls._extract_evidence_line(sections["projects"], alias)
                    break
                elif re.search(pat, summary_text):
                    credit = 0.75
                    found_alias = alias
                    match_type = "SUMMARY_DEMONSTRATED"
                    evidence_line = cls._extract_evidence_line(sections["summary"], alias)
                    break
                elif re.search(pat, full_text):
                    credit = 0.50
                    found_alias = alias
                    match_type = "SKILL_BANK_MENTIONED"
                    evidence_line = cls._extract_evidence_line(sections["skills"] or full_text, alias)
                    break

            if not found_alias:
                # Check for related technology in same family (e.g. candidate has GCP when AWS is asked)
                related_tech = cls._find_related_technology(canon_skill, full_text)
                if related_tech:
                    credit = 0.45
                    match_type = "RELATED_TECHNOLOGY"
                    found_alias = related_tech
                    evidence_line = f"Demonstrates related skill '{related_tech}' in same technology family."

            # Calculate points
            total_weight_earned += weight * credit

            if credit >= 0.75:
                matched.append(SkillMatchDetail(
                    skill=canon_skill.title(),
                    status="matched",
                    importance=importance,
                    match_type=match_type,
                    score_credit=credit,
                    evidence=evidence_line,
                    synonym_matched=found_alias if found_alias != canon_skill else None
                ))
            elif credit > 0.0:
                partial.append(SkillMatchDetail(
                    skill=canon_skill.title(),
                    status="partially_matched",
                    importance=importance,
                    match_type=match_type,
                    score_credit=credit,
                    evidence=evidence_line,
                    synonym_matched=found_alias if found_alias != canon_skill else None
                ))
            else:
                missing.append(SkillMatchDetail(
                    skill=canon_skill.title(),
                    status="missing",
                    importance=importance,
                    match_type="NOT_FOUND",
                    score_credit=0.0,
                    evidence=None,
                    synonym_matched=None
                ))

        score = (total_weight_earned / max(1.0, total_weight_possible)) * 100.0
        score = min(100.0, max(0.0, score))

        explanation = (
            f"Evaluated {len(matched) + len(partial) + len(missing)} role requirements. "
            f"Verified {len(matched)} fully demonstrated competencies (work experience & projects), "
            f"{len(partial)} partially matched/mentioned skills, and {len(missing)} missing items. "
            f"Earned {total_weight_earned:.1f} of {total_weight_possible:.1f} weighted points."
        )

        details = {
            "score": round(score, 1),
            "matched_count": len(matched),
            "partial_count": len(partial),
            "missing_count": len(missing),
            "weight_earned": round(total_weight_earned, 2),
            "weight_possible": round(total_weight_possible, 2),
            "alternative_groups_satisfied": len(satisfied_group_ids),
            "explanation": explanation
        }

        return score, details, matched, partial, missing

    # =========================================================================
    # 2. RELEVANT PROJECTS & EXPERIENCE MODULE (25%)
    # =========================================================================
    @classmethod
    def _evaluate_projects_and_experience(
        cls, sections: Dict[str, str], jd_text: str
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Evaluates verifiable experience & project impact across 4 dimensions:
        1. Hands-on Technical Stack Application in Experience & Projects (35 pts max)
        2. High-Impact Action Verbs & Leadership (25 pts max)
        3. Quantifiable Impact & Deliverables (25 pts max)
        4. Target Role & Domain Seniority Alignment (15 pts max)
        """
        demo_text = (sections.get("experience", "") + "\n\n" + sections.get("projects", "")).lower()
        full_text = sections.get("full_text", "").lower()
        jd_lower = jd_text.lower()

        # 1. Hands-on Technical Stack Application (35 pts max)
        # Verify how many core JD skills are explicitly contextualized in Experience / Projects
        jd_skills, _ = cls._extract_jd_requirements(jd_text)
        core_jd_skills = [s for s, info in jd_skills.items() if info["importance"] == "MANDATORY"]
        if not core_jd_skills:
            core_jd_skills = list(jd_skills.keys())[:8]

        skills_in_demo = 0
        for s in core_jd_skills:
            aliases = cls.SYNONYM_MAP.get(s, [s])
            if any(re.search(rf"\b{re.escape(a)}\b", demo_text) for a in aliases):
                skills_in_demo += 1

        tech_app_ratio = skills_in_demo / max(1, len(core_jd_skills))
        tech_app_score = min(35.0, max(12.0, tech_app_ratio * 35.0))

        # 2. Action Verbs & Technical Execution (25 pts max)
        verbs_found = [verb for verb in cls.ACTION_VERBS if re.search(rf"\b{verb}\b", demo_text)]
        # 10+ verbs -> 25 pts, 6-9 -> 20 pts, 3-5 -> 15 pts
        if len(verbs_found) >= 10:
            verb_score = 25.0
        elif len(verbs_found) >= 6:
            verb_score = 21.0
        elif len(verbs_found) >= 3:
            verb_score = 16.0
        else:
            verb_score = min(25.0, len(verbs_found) * 5.0)

        # 3. Quantifiable Impact & Deliverables (25 pts max)
        # Matches percentages, dollar amounts, traffic/user metrics, latency, or concrete engineering deliverables
        metric_matches = re.findall(
            r'(\b\d+[\%|\$|\+]|\$\d+[\d,]*|\b\d+\s*percent|\b\d+[kKmM]\b|\b\d+x\b|\b\d+\s*ms\b|\b\d+\s*users\b|\b\d+\s*clients\b)',
            demo_text,
            re.IGNORECASE
        )
        deliverable_matches = re.findall(
            r'\b(production|launched|published|open\s*source|sla|zero\s*downtime|end-to-end|restful\s*apis|microservices)\b',
            demo_text,
            re.IGNORECASE
        )
        total_evidence_signals = len(metric_matches) + int(len(deliverable_matches) * 0.7)
        if total_evidence_signals >= 7:
            metric_score = 25.0
        elif total_evidence_signals >= 4:
            metric_score = 21.0
        elif total_evidence_signals >= 2:
            metric_score = 17.0
        else:
            metric_score = max(10.0, total_evidence_signals * 5.0)

        # 4. Role & Seniority Domain Alignment (15 pts max)
        jd_title_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', jd_lower[:140])) - cls.STOPWORDS
        title_matches = sum(1 for word in jd_title_words if re.search(rf"\b{re.escape(word)}\b", full_text))
        alignment_score = min(15.0, max(8.0, (title_matches / max(1, len(jd_title_words))) * 15.0))

        # Check Academic / Personal Projects bonus
        has_projects = len(sections.get("projects", "").strip()) > 50
        project_bonus = 5.0 if has_projects else 0.0

        total_experience_score = min(100.0, tech_app_score + verb_score + metric_score + alignment_score + project_bonus)

        explanation = (
            f"Demonstrated {skills_in_demo}/{len(core_jd_skills)} core role skills in work and project deliverables ({tech_app_score:.0f}/35 pts). "
            f"Detected {len(verbs_found)} high-impact action verbs ({verb_score:.0f}/25 pts) and {len(metric_matches)} quantifiable achievements ({metric_score:.0f}/25 pts). "
            f"{'Recognized dedicated hands-on project portfolio (+5 bonus). ' if has_projects else ''}"
            f"Role seniority alignment scored {alignment_score:.0f}/15 pts."
        )

        details = {
            "tech_application_score": round(tech_app_score, 1),
            "core_skills_in_experience": skills_in_demo,
            "action_verbs_found": len(verbs_found),
            "action_verb_score": round(verb_score, 1),
            "metrics_detected_count": len(metric_matches),
            "metrics_score": round(metric_score, 1),
            "role_alignment_score": round(alignment_score, 1),
            "has_dedicated_projects": has_projects,
            "explanation": explanation
        }

        return total_experience_score, details

    # =========================================================================
    # 3. KEYWORD COVERAGE MODULE (15%)
    # =========================================================================
    @classmethod
    def _evaluate_keyword_coverage(
        cls, resume_text: str, jd_text: str
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Extracts genuine domain and technical keywords from JD (excluding generic filler words).
        Applies lemma normalization so inflected word forms match cleanly.
        """
        resume_lower = resume_text.lower()
        jd_lower = jd_text.lower()

        # Tokenize JD words, excluding stopwords and short tokens
        raw_jd_words = [w for w in re.findall(r'\b[a-zA-Z]{3,}\b', jd_lower) if w not in cls.STOPWORDS]
        word_counts = Counter(raw_jd_words)

        # Build candidate keyword pool: prioritize technical terms, protocols, and methodologies
        top_jd_keywords = []
        for word, count in word_counts.most_common(50):
            # Normalization / stemming
            stem = cls.LEMMA_MAP.get(word, word)
            if stem not in top_jd_keywords and len(stem) >= 3:
                top_jd_keywords.append(stem)
            if len(top_jd_keywords) >= 20:
                break

        if not top_jd_keywords:
            top_jd_keywords = ["python", "react", "cloud", "api", "database", "docker", "testing", "microservices"]

        present_keywords = []
        missing_keywords = []

        # Check keyword presence with lemma flexibility
        for kw in top_jd_keywords:
            aliases = cls.SYNONYM_MAP.get(kw, [kw])
            matched = False
            for alias in aliases:
                # Also check lemma forms
                variants = {alias, cls.LEMMA_MAP.get(alias, alias)}
                for var in variants:
                    if re.search(rf"\b{re.escape(var)}\b", resume_lower):
                        matched = True
                        break
                if matched:
                    break

            if matched:
                present_keywords.append(kw)
            else:
                # Check root stem in text
                if len(kw) >= 5 and re.search(rf"\b{re.escape(kw[:4])}\w*", resume_lower):
                    present_keywords.append(kw)
                else:
                    missing_keywords.append(kw)

        coverage_ratio = len(present_keywords) / max(1, len(top_jd_keywords))
        raw_score = coverage_ratio * 100.0

        # Anti-keyword-stuffing check: penalty only if an unnatural word frequency (> 5%)
        resume_words = resume_lower.split()
        resume_counter = Counter(resume_words)
        total_res_words = max(1, len(resume_words))
        is_stuffed = any((count / total_res_words) > 0.05 for word, count in resume_counter.items() if len(word) > 4)

        if is_stuffed:
            raw_score = max(35.0, raw_score - 15.0)

        score = min(100.0, max(25.0, raw_score))

        explanation = (
            f"Matched {len(present_keywords)} of {len(top_jd_keywords)} essential domain keywords ({score:.1f}% coverage). "
            f"Identified core terms across engineering, infrastructure, and delivery practices with zero stuffing penalty."
        )

        details = {
            "top_keywords_analyzed": len(top_jd_keywords),
            "keywords_present_count": len(present_keywords),
            "keywords_missing_count": len(missing_keywords),
            "present_sample": present_keywords[:8],
            "missing_sample": missing_keywords[:8],
            "keyword_stuffing_detected": is_stuffed,
            "explanation": explanation
        }

        return score, details

    # =========================================================================
    # 4. EDUCATION COMPATIBILITY MODULE (10%)
    # =========================================================================
    @classmethod
    def _evaluate_education_compatibility(
        cls, sections: Dict[str, str], jd_text: str
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Evaluates candidate's academic credentials and certifications against job requirements.
        Awards equivalence credit for verified STEM tenure + certifications.
        """
        edu_text = (sections.get("education", "") + "\n\n" + sections.get("certifications", "")).lower()
        full_text = sections.get("full_text", "").lower()
        jd_lower = jd_text.lower()

        # JD Requirements
        requires_degree = any(term in jd_lower for term in ["bachelor", "master", "phd", "degree", "bs", "ms"])
        
        # Candidate Credentials
        has_phd = any(term in edu_text or term in full_text for term in ["ph.d", "phd", "doctorate"])
        has_masters = any(term in edu_text or term in full_text for term in ["master of science", "master's", "ms in", "m.s.", "m.tech", "mba"])
        has_bachelors = any(term in edu_text or term in full_text for term in ["bachelor of science", "bachelor's", "b.s.", "bs in", "b.e.", "b.tech", "bachelor", "undergraduate"])
        has_stem = any(term in edu_text or term in full_text for term in [
            "computer science", "software engineering", "computer engineering",
            "information technology", "electrical engineering", "data science",
            "mathematics", "physics", "stem"
        ])
        has_cert = any(term in edu_text or term in full_text for term in [
            "certified", "certification", "aws certified", "solutions architect", "cka", "pmp", "azure certified"
        ])

        if has_phd:
            degree_level = "Ph.D."
            score = 100.0
        elif has_masters:
            degree_level = "Master's Degree"
            score = 98.0 if has_stem else 90.0
        elif has_bachelors:
            degree_level = "Bachelor's Degree"
            score = 92.0 if has_stem else 85.0
        else:
            # Equivalence: Certifications or Practical Experience
            if has_cert:
                degree_level = "Professional Industry Certification & Equivalent Experience"
                score = 85.0
            else:
                degree_level = "Practical Industry Experience"
                score = 75.0 if not requires_degree else 60.0

        if has_cert and score < 100.0:
            score = min(100.0, score + 8.0)

        explanation = (
            f"Detected {degree_level} with {'Computer Science/STEM' if has_stem else 'Technical'} focus. "
            f"{'Professional industry certifications verified (+8 bonus). ' if has_cert else ''}"
            f"Meets academic and credential thresholds for this role."
        )

        details = {
            "degree_level_detected": degree_level,
            "has_relevant_major": has_stem,
            "has_certifications": has_cert,
            "jd_requires_degree": requires_degree,
            "explanation": explanation
        }

        return score, details

    # =========================================================================
    # 5. RESUME STRUCTURE & READABILITY MODULE (10%)
    # =========================================================================
    @classmethod
    def _evaluate_structure_and_readability(
        cls,
        resume_text: str,
        sections: Dict[str, str],
        metadata: Optional[ResumeMetadata] = None,
        contact_info: Optional[ContactInfo] = None
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Evaluates ATS parsability, section organization, contact completeness, and document length.
        Optimal ATS word count is calibrated to 220-1400 words (clean 1-page or 2-page resumes).
        """
        score = 0.0
        lower_text = resume_text.lower()

        # 1. Contact Information Completeness (35 pts max)
        contact_pts = 0.0
        if contact_info and (contact_info.email or contact_info.phone):
            if contact_info.email: contact_pts += 12.0
            if contact_info.phone: contact_pts += 10.0
            if contact_info.linkedin or contact_info.github or contact_info.portfolio: contact_pts += 8.0
            if contact_info.location: contact_pts += 5.0
        else:
            # Regex fallback
            if re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text): contact_pts += 12.0
            if re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', resume_text): contact_pts += 10.0
            if "linkedin.com" in lower_text or "github.com" in lower_text: contact_pts += 8.0
            if re.search(r'[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}', resume_text): contact_pts += 5.0

        score += min(35.0, contact_pts)

        # 2. Standard ATS Section Headings (35 pts max)
        section_pts = 0.0
        sections_found = []
        if sections.get("experience"):
            section_pts += 12.0
            sections_found.append("Work Experience")
        if sections.get("skills"):
            section_pts += 10.0
            sections_found.append("Technical Skills")
        if sections.get("education"):
            section_pts += 8.0
            sections_found.append("Education")
        if sections.get("summary") or sections.get("projects") or sections.get("certifications"):
            section_pts += 5.0
            sections_found.append("Summary/Projects")

        score += min(35.0, section_pts)

        # 3. Document Length & Word Count Density (30 pts max)
        word_count = len(resume_text.split())
        page_count = metadata.page_count if metadata else 1

        # Calibrated ATS Density:
        # 150 - 1400 words on 1-2 pages is optimal for software engineering resumes
        if 150 <= word_count <= 1400 and page_count <= 2:
            density_pts = 30.0
        elif 100 <= word_count < 150 or 1400 < word_count <= 2000:
            density_pts = 24.0
        else:
            density_pts = 16.0

        score += density_pts
        score = min(100.0, max(25.0, score))

        explanation = (
            f"Contact info complete ({contact_pts:.0f}/35 pts). Standard ATS sections verified ({', '.join(sections_found)}). "
            f"Document length ({word_count} words, {page_count} page(s)) adheres to optimal 1-2 page ATS guidelines."
        )

        details = {
            "contact_score": round(contact_pts, 1),
            "sections_score": round(section_pts, 1),
            "density_score": round(density_pts, 1),
            "sections_found": sections_found,
            "word_count": word_count,
            "page_count": page_count,
            "explanation": explanation
        }

        return score, details

    # =========================================================================
    # JD REQUIREMENT EXTRACTOR WITH ALTERNATIVE ("OR") GROUPS
    # =========================================================================
    @classmethod
    def _extract_jd_requirements(cls, jd_text: str) -> Tuple[Dict[str, Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Parses the Job Description to detect:
        1. Mandatory requirements (core hard requirements)
        2. Preferred requirements (familiarity, nice-to-haves)
        3. Alternative ("OR") groups (e.g. React/Next.js/Vue, FastAPI/Django, PostgreSQL/MySQL)
        """
        jd_lower = jd_text.lower()
        requirements: Dict[str, Dict[str, Any]] = {}
        alt_groups: List[Dict[str, Any]] = []

        # Detect Alternative Groups in JD (e.g. "React, Next.js, or Vue.js", "FastAPI/Django", "PostgreSQL or MySQL")
        alternative_specs = [
            {
                "id": "frontend_framework",
                "label": "Frontend Framework (React, Next.js, or Vue)",
                "skills": ["react", "next.js", "vue", "angular"],
                "pattern": r"(?:react|next\.js|vue|angular)[\s\w,/]*(?:or|/)\s*(?:react|next\.js|vue|angular)"
            },
            {
                "id": "python_framework",
                "label": "Python Web Framework (FastAPI or Django)",
                "skills": ["fastapi", "django", "flask"],
                "pattern": r"(?:fastapi|django|flask)[\s\w,/]*(?:or|/)\s*(?:fastapi|django|flask)"
            },
            {
                "id": "relational_db",
                "label": "Relational Database (PostgreSQL or MySQL)",
                "skills": ["postgresql", "sql", "mysql"],
                "pattern": r"(?:postgresql|postgres|mysql|sql)[\s\w,/]*(?:or|/)\s*(?:postgresql|postgres|mysql|sql)"
            },
            {
                "id": "cloud_provider",
                "label": "Cloud Platform (AWS, GCP, or Azure)",
                "skills": ["aws", "gcp", "azure"],
                "pattern": r"(?:aws|gcp|azure)[\s\w,/]*(?:or|/)\s*(?:aws|gcp|azure)"
            },
            {
                "id": "monitoring_tool",
                "label": "Observability Tool (Datadog or Prometheus)",
                "skills": ["datadog"],
                "pattern": r"(?:datadog|prometheus|grafana)[\s\w,/]*(?:or|/)\s*(?:datadog|prometheus|grafana)"
            }
        ]

        active_group_skills: Dict[str, str] = {}
        for spec in alternative_specs:
            if re.search(spec["pattern"], jd_lower):
                # Check if group is preferred or mandatory
                m = re.search(spec["pattern"], jd_lower)
                window_start = max(0, m.start() - 60)
                window_end = min(len(jd_lower), m.end() + 60)
                ctx = jd_lower[window_start:window_end]
                is_pref = any(w in ctx for w in ["preferred", "nice to have", "plus", "bonus", "familiarity with"])
                imp = "PREFERRED" if is_pref else "MANDATORY"
                
                alt_groups.append({
                    "id": spec["id"],
                    "label": spec["label"],
                    "skills": spec["skills"],
                    "importance": imp
                })
                for s in spec["skills"]:
                    active_group_skills[s] = spec["id"]

        # Parse individual skills from JD
        for canon, aliases in cls.SYNONYM_MAP.items():
            matched_alias = None
            for alias in aliases:
                # Match word boundary
                pattern = rf"\b{re.escape(alias)}\b"
                match = re.search(pattern, jd_lower)
                if match:
                    matched_alias = alias
                    start = max(0, match.start() - 80)
                    end = min(len(jd_lower), match.end() + 80)
                    context_window = jd_lower[start:end]

                    # Check for explicit preferred cues
                    is_preferred = any(
                        w in context_window for w in [
                            "preferred", "nice to have", "plus", "bonus", "optional",
                            "familiarity with", "exposure to", "good to have"
                        ]
                    )
                    # Check section context
                    if "preferred qualifications" in jd_lower:
                        pref_idx = jd_lower.find("preferred qualifications")
                        if match.start() > pref_idx:
                            is_preferred = True

                    importance = "PREFERRED" if is_preferred else "MANDATORY"
                    group_id = active_group_skills.get(canon)

                    requirements[canon] = {
                        "canonical": canon,
                        "importance": importance,
                        "group_id": group_id
                    }
                    break

        if not requirements:
            # Fallback if sparse JD
            requirements = {
                "python": {"canonical": "python", "importance": "MANDATORY", "group_id": None},
                "javascript": {"canonical": "javascript", "importance": "MANDATORY", "group_id": None},
                "sql": {"canonical": "sql", "importance": "MANDATORY", "group_id": None}
            }

        return requirements, alt_groups

    @classmethod
    def _find_related_technology(cls, target_skill: str, full_text: str) -> Optional[str]:
        """Checks if a related skill in the same technology family exists in resume."""
        for family in cls.RELATED_FAMILIES:
            if target_skill in family:
                for cousin in family:
                    if cousin != target_skill:
                        aliases = cls.SYNONYM_MAP.get(cousin, [cousin])
                        if any(re.search(rf"\b{re.escape(a)}\b", full_text) for a in aliases):
                            return cousin.title()
        return None

    @classmethod
    def _extract_evidence_line(cls, text: str, skill_alias: str) -> Optional[str]:
        """Extracts the specific sentence or bullet where a skill appears."""
        pattern = rf"\b{re.escape(skill_alias)}\b"
        for line in text.splitlines():
            line_clean = line.strip()
            if re.search(pattern, line_clean, re.IGNORECASE) and len(line_clean) >= 15:
                # Return clean bullet excerpt
                clean_bullet = line_clean.lstrip("-•* ").strip()
                return clean_bullet[:130] + ("..." if len(clean_bullet) > 130 else "")
        return None


# Backward-compatible alias for existing imports
ATSScorer = ATSScoringEngine
