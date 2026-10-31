from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class CategoryScoreDetail(BaseModel):
    category_name: str
    weight_pct: int = Field(description="Configured weight percentage (e.g., 40 for 40%)")
    score: float = Field(ge=0.0, le=100.0, description="Score for this category between 0 and 100")
    weighted_contribution: float = Field(description="score * (weight_pct / 100)")
    explanation: str = Field(description="Detailed explanation of how the score was determined")
    metrics: Dict[str, Any] = Field(default_factory=dict, description="Internal metrics and sub-factors")


class SkillMatchDetail(BaseModel):
    skill: str = Field(description="Name of the skill from job requirements")
    status: str = Field(description="'matched', 'partially_matched', or 'missing'")
    importance: str = Field(default="MANDATORY", description="'MANDATORY' or 'PREFERRED'")
    match_type: str = Field(
        description="'EXACT_DEMONSTRATED', 'EXACT_MENTIONED', 'SYNONYM_DEMONSTRATED', 'RELATED_TECHNOLOGY', 'NOT_FOUND'"
    )
    score_credit: float = Field(description="Credit awarded (1.0 for demonstrated, 0.5 for partial/mentioned, 0 for missing)")
    evidence: Optional[str] = Field(default=None, description="Excerpt from resume evidencing the skill")
    synonym_matched: Optional[str] = Field(default=None, description="Synonym or alias found in resume")


class ATSScoringResult(BaseModel):
    overall_score: float = Field(ge=0.0, le=100.0, description="Final mathematically calculated weighted score (0-100)")
    rating_label: str = Field(description="Human-readable rating tier")
    categories: Dict[str, CategoryScoreDetail]
    matched_skills: List[SkillMatchDetail] = Field(default_factory=list)
    partially_matched_skills: List[SkillMatchDetail] = Field(default_factory=list)
    missing_skills: List[SkillMatchDetail] = Field(default_factory=list)
    formula_breakdown: str = Field(description="Mathematical formula used to compute the composite score")
