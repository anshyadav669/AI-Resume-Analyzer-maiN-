from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.resume import ContactInfo


class TextCleaningStats(BaseModel):
    original_character_count: int = 0
    cleaned_character_count: int = 0
    reduction_pct: float = 0.0
    bullets_normalized: int = 0
    ligatures_fixed: int = 0
    hyphenated_linebreaks_fixed: int = 0


class ExtractedPage(BaseModel):
    page_number: int
    text: str
    word_count: int
    has_images: bool = False


class PDFExtractionResponse(BaseModel):
    success: bool = True
    filename: str
    file_size_bytes: int
    page_count: int
    word_count: int
    character_count: int
    is_scanned: bool = False
    is_encrypted: bool = False
    raw_text: str = Field(description="Raw text extracted directly from PyMuPDF blocks")
    cleaned_text: str = Field(description="Normalized, sanitized text with standard bullets & unicode cleanup")
    pages: List[ExtractedPage] = Field(default_factory=list)
    contact_info: ContactInfo
    sections_detected: List[str] = Field(default_factory=list)
    links: List[str] = Field(default_factory=list)
    cleaning_stats: TextCleaningStats


class PDFValidationResponse(BaseModel):
    is_valid: bool
    filename: str
    file_size_bytes: int
    page_count: int
    is_encrypted: bool = False
    is_scanned: bool = False
    message: str


class ErrorDetail(BaseModel):
    error_code: str
    message: str
    details: Optional[Dict] = None
