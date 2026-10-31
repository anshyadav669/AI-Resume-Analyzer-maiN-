from typing import List, Optional
from pydantic import BaseModel, Field


class CandidateSkill(BaseModel):
    name: str = Field(description="Name of the skill, tool, or technology")
    category: str = Field(
        default="General",
        description="Category: Programming, Frameworks, Cloud & DevOps, Databases, Practices, Soft Skills"
    )
    demonstration_level: str = Field(
        description="'DEMONSTRATED' if substantiated with project/work experience context; 'MENTIONED' if only listed in skills bank without proof."
    )
    context_snippet: Optional[str] = Field(
        default=None,
        description="Brief excerpt from resume where the candidate used or mentioned this skill"
    )


class JobSkillRequirement(BaseModel):
    name: str = Field(description="Name of technical skill or competency")
    category: str = Field(default="Technical", description="Category of the skill")
    importance: str = Field(
        default="MANDATORY",
        description="'MANDATORY' for core hard requirements; 'PREFERRED' for nice-to-have qualifications"
    )


class RelevantProjectExperience(BaseModel):
    title_or_role: str = Field(description="Project name or job title found in the resume")
    organization: Optional[str] = Field(default=None, description="Company, organization, or institution")
    relevance_summary: str = Field(description="Why and how this experience directly supports the target job requirements")
    relevance_score: int = Field(ge=0, le=100, description="Estimated role relevance (0-100)")


class EducationCompatibility(BaseModel):
    degree_found: Optional[str] = Field(default=None, description="Candidate's degree and field detected in resume")
    degree_required: Optional[str] = Field(default=None, description="Educational threshold requested in JD")
    is_compatible: bool = Field(description="Whether the candidate meets the educational requirements")
    field_relevance: str = Field(
        default="RELATED_FIELD",
        description="'EXACT_MATCH', 'RELATED_FIELD', 'UNRELATED', or 'NOT_SPECIFIED'"
    )
    certifications_found: List[str] = Field(default_factory=list, description="Accredited certifications detected")
    analysis: str = Field(description="Recruiter assessment of candidate's academic and certification credentials")


class ATSKeywordsAnalysis(BaseModel):
    critical_keywords: List[str] = Field(description="Top keywords from the job description that ATS algorithms prioritize")
    keywords_present: List[str] = Field(description="Critical keywords verified to exist in candidate's resume")
    keywords_missing: List[str] = Field(description="High-value keywords absent from candidate's resume")


class BulletRewrite(BaseModel):
    original: str = Field(description="Original bullet point from the resume")
    improved: str = Field(
        description="Rewritten bullet point using Google XYZ formula (Accomplished X, measured by Y, by doing Z)"
    )
    critique: str = Field(description="Explanation of why this rewrite increases ATS ranking and recruiter impact")


class SectionFeedback(BaseModel):
    section_name: str = Field(description="Section name e.g. Summary, Experience, Skills, Education")
    status: str = Field(description="Status: 'OPTIMAL', 'NEEDS_IMPROVEMENT', or 'MISSING'")
    observations: List[str] = Field(default_factory=list, description="What was observed in this section")
    recommendations: List[str] = Field(default_factory=list, description="Specific fixes to apply")


class ScoreBreakdown(BaseModel):
    overall_score: int = Field(ge=0, le=100, description="Weighted composite ATS score (0-100)")
    keyword_match_score: int = Field(ge=0, le=100, description="Hard skill and keyword alignment (0-100)")
    experience_impact_score: int = Field(ge=0, le=100, description="Action verbs, metrics, and quantifiable impact (0-100)")
    education_cert_score: int = Field(ge=0, le=100, description="Degrees, relevant certifications, and credentials (0-100)")
    formatting_readability_score: int = Field(ge=0, le=100, description="ATS parseability, bullet density, layout (0-100)")


class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    location: Optional[str] = None


class ResumeMetadata(BaseModel):
    page_count: int = 1
    word_count: int = 0
    reading_time_seconds: int = 0
    has_contact_info: bool = True
    is_ats_parsable: bool = True
    file_name: Optional[str] = None


class SkillCategoryMatch(BaseModel):
    category: str = Field(description="Skill grouping e.g. Languages, Cloud, Frameworks")
    matched: List[str] = Field(default_factory=list, description="Skills present in resume")
    missing: List[str] = Field(default_factory=list, description="Skills required by JD but missing")


class SkillMatchItem(BaseModel):
    name: str = Field(description="Name of the skill or tool")
    status: str = Field(description="Match status: 'matched', 'missing_critical', or 'missing_bonus'")
    category: str = Field(default="General", description="Skill category")
    relevance: str = Field(default="High", description="Relevance to job: High, Medium, Low")


class ResumeAnalysisResponse(BaseModel):
    candidate_name: Optional[str] = None
    target_role_detected: str = Field(description="Target job title or role detected from JD")
    scores: ScoreBreakdown
    candidate_skills: List[CandidateSkill] = Field(
        default_factory=list,
        description="Extracted candidate skills with DEMONSTRATED vs MENTIONED classification"
    )
    required_technical_skills: List[JobSkillRequirement] = Field(
        default_factory=list,
        description="Technical skills required by the job (mandatory vs preferred)"
    )
    matching_skills: List[str] = Field(default_factory=list, description="Skills present in both resume and JD")
    missing_skills: List[str] = Field(default_factory=list, description="Skills required by JD but absent in resume")
    missing_critical_skills: List[str] = Field(default_factory=list)
    missing_bonus_skills: List[str] = Field(default_factory=list)
    relevant_experience: List[RelevantProjectExperience] = Field(
        default_factory=list,
        description="Projects and past roles aligned with the target role"
    )
    education_compatibility: EducationCompatibility = Field(
        description="Evaluation of academic qualification and certification match"
    )
    strengths: List[str] = Field(default_factory=list, description="Strictly verified resume strengths")
    weaknesses: List[str] = Field(default_factory=list, description="Critical gaps and missing criteria")
    improvement_suggestions: List[str] = Field(default_factory=list, description="Specific actionable improvements")
    ats_keywords: ATSKeywordsAnalysis = Field(
        description="ATS keywords analysis distinguishing present vs missing terms"
    )
    bullet_improvements: List[BulletRewrite] = Field(default_factory=list)
    sections_review: List[SectionFeedback] = Field(default_factory=list)
    skills_analysis: List[SkillCategoryMatch] = Field(default_factory=list)
    all_skills: List[SkillMatchItem] = Field(default_factory=list)
    recruiter_verdict: str = Field(description="Executive summary verdict from a senior hiring manager perspective")
    action_items_priority: List[str] = Field(default_factory=list, description="Top actionable steps ordered by score impact")
    metadata: Optional[ResumeMetadata] = None
    detailed_scoring: Optional[dict] = Field(default=None, description="Complete mathematical category-wise breakdown")


class ExtractPdfResponse(BaseModel):
    filename: str
    page_count: int
    word_count: int
    text_preview: str
    full_text: str
    contact_info: ContactInfo


class OptimizeBulletRequest(BaseModel):
    bullet: str
    job_context: Optional[str] = ""
    target_role: Optional[str] = ""


class OptimizeBulletResponse(BaseModel):
    original: str
    optimized: str
    critique: str
