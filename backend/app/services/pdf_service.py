import os
import re
import tempfile
import logging
from contextlib import contextmanager
from typing import Generator, Tuple, List, Optional, Dict
from fastapi import UploadFile

try:
    import pymupdf as fitz
except ImportError:
    import fitz

from app.core.config import settings
from app.core.exceptions import (
    PDFValidationError,
    FileSizeLimitError,
    EmptyPDFError,
    ScannedPDFError,
    EncryptedPDFError,
    PDFExtractionError,
)
from app.schemas.resume import ContactInfo
from app.schemas.pdf import PDFExtractionResponse, ExtractedPage
from app.services.text_cleaner import TextCleaner

logger = logging.getLogger(__name__)


class PDFService:
    """
    Enterprise-grade PDF text extraction, validation, and layout analysis service.
    Powered by PyMuPDF (fitz) with automated temporary file lifecycle management.
    """

    MAGIC_HEADER = b"%PDF-"
    CHUNK_SIZE = 64 * 1024  # 64 KB chunks

    @classmethod
    @contextmanager
    def save_upload_to_temp_file(cls, upload_file: UploadFile) -> Generator[Tuple[str, int], None, None]:
        """
        Safely streams uploaded PDF chunks into a temporary file on disk.
        Validates magic bytes and file size during streaming.
        Guarantees file deletion in the finally block.
        """
        # 1. Basic Extension Check
        filename = upload_file.filename or "unknown.pdf"
        if not filename.lower().endswith(".pdf"):
            raise PDFValidationError(
                f"Invalid file extension for '{filename}'. Only .pdf files are accepted.",
                details={"filename": filename}
            )

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf",
            dir=settings.TEMP_DIR
        )
        temp_path = temp_file.name
        total_bytes = 0
        header_checked = False

        try:
            # Reset file pointer if already read
            upload_file.file.seek(0)

            while chunk := upload_file.file.read(cls.CHUNK_SIZE):
                # 2. Magic Bytes Validation on first chunk
                if not header_checked:
                    header_checked = True
                    if len(chunk) < 5 or cls.MAGIC_HEADER not in chunk[:1024]:
                        raise PDFValidationError(
                            f"File '{filename}' does not appear to be a valid PDF (invalid magic header %PDF-).",
                            details={"filename": filename}
                        )

                total_bytes += len(chunk)
                if total_bytes > settings.max_upload_size_bytes:
                    raise FileSizeLimitError(
                        f"File size ({round(total_bytes / (1024 * 1024), 2)}MB) exceeds maximum allowable limit of {settings.MAX_UPLOAD_SIZE_MB}MB.",
                        details={"file_size_bytes": total_bytes, "max_allowed_mb": settings.MAX_UPLOAD_SIZE_MB}
                    )

                temp_file.write(chunk)

            temp_file.flush()
            temp_file.close()

            # 3. Check for empty upload (0 bytes)
            if total_bytes == 0:
                raise PDFValidationError(
                    f"Uploaded file '{filename}' is empty (0 bytes).",
                    details={"filename": filename}
                )

            yield temp_path, total_bytes

        finally:
            # Ensure file descriptor is closed
            try:
                if not temp_file.closed:
                    temp_file.close()
            except Exception:
                pass

            # Safe unlink from disk
            if os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                    logger.debug(f"Temporary PDF cleanly unlinked: {temp_path}")
                except Exception as e:
                    logger.warning(f"Failed to remove temp file {temp_path}: {e}")

    @classmethod
    def extract_text_from_temp_file(cls, file_path: str, filename: str, file_size: int) -> PDFExtractionResponse:
        """
        Extracts structured text, layout blocks, links, and contact info from a validated PDF file.
        Detects empty and scanned PDFs.
        """
        try:
            doc = fitz.open(file_path)
        except Exception as e:
            raise PDFExtractionError(
                f"Failed to parse PDF document '{filename}': {str(e)}",
                details={"filename": filename, "error": str(e)}
            )

        # 1. Encryption check
        if doc.is_encrypted:
            doc.close()
            raise EncryptedPDFError(
                f"PDF file '{filename}' is password-protected or encrypted. Please remove the password and retry.",
                details={"filename": filename}
            )

        # 2. Empty document check
        page_count = len(doc)
        if page_count == 0:
            doc.close()
            raise EmptyPDFError(
                f"PDF file '{filename}' contains zero pages.",
                details={"filename": filename}
            )

        pages_extracted: List[ExtractedPage] = []
        all_links: List[str] = []
        total_images = 0
        raw_page_texts: List[str] = []

        for page_idx in range(page_count):
            page = doc[page_idx]

            # Extract links embedded in annotations
            try:
                for link in page.get_links():
                    uri = link.get("uri")
                    if uri and uri not in all_links:
                        all_links.append(uri)
            except Exception:
                pass

            # Count embedded images
            image_list = page.get_images(full=True)
            has_images = len(image_list) > 0
            total_images += len(image_list)

            # Block-level extraction to maintain natural reading order (critical for 2-column resumes)
            blocks = page.get_text("blocks")
            # blocks format: (x0, y0, x1, y1, text, block_no, block_type)
            text_blocks = [b for b in blocks if len(b) >= 7 and b[6] == 0 and b[4].strip()]
            
            # Sort blocks primarily by vertical y0 (within 6pt tolerance) then horizontal x0
            text_blocks.sort(key=lambda b: (round(b[1] / 6) * 6, b[0]))
            
            page_text = "\n".join(b[4].strip() for b in text_blocks)
            if not page_text.strip():
                # Fallback to plain text
                page_text = page.get_text("text").strip()

            raw_page_texts.append(page_text)
            page_word_count = len(page_text.split())

            pages_extracted.append(ExtractedPage(
                page_number=page_idx + 1,
                text=page_text,
                word_count=page_word_count,
                has_images=has_images
            ))

        doc.close()

        raw_full_text = "\n\n".join(raw_page_texts).strip()
        total_words = sum(p.word_count for p in pages_extracted)

        # 3. Scanned or Empty PDF Detection
        if total_words < settings.MIN_EXTRACTED_WORDS_THRESHOLD:
            if total_images > 0:
                raise ScannedPDFError(
                    f"Scanned image PDF detected in '{filename}'. Found only {total_words} words across {page_count} page(s) with {total_images} embedded image(s). "
                    "Modern ATS software requires machine-readable text. Please upload an OCR-processed or searchable PDF.",
                    details={
                        "filename": filename,
                        "words_extracted": total_words,
                        "images_detected": total_images,
                        "page_count": page_count
                    }
                )
            else:
                raise EmptyPDFError(
                    f"PDF document '{filename}' contains no readable text content ({total_words} words detected).",
                    details={"filename": filename, "page_count": page_count}
                )

        # 4. Text Cleaning and Normalization
        cleaned_text, cleaning_stats = TextCleaner.clean(raw_full_text)

        # 5. Contact Information Detection
        contact_info = cls._extract_contact_info(cleaned_text, all_links)

        # 6. Standard Resume Section Detection
        sections_detected = cls._detect_sections(cleaned_text)

        return PDFExtractionResponse(
            success=True,
            filename=filename,
            file_size_bytes=file_size,
            page_count=page_count,
            word_count=len(cleaned_text.split()),
            character_count=len(cleaned_text),
            is_scanned=False,
            is_encrypted=False,
            raw_text=raw_full_text,
            cleaned_text=cleaned_text,
            pages=pages_extracted,
            contact_info=contact_info,
            sections_detected=sections_detected,
            links=all_links,
            cleaning_stats=cleaning_stats,
        )

    @classmethod
    def _extract_contact_info(cls, text: str, links: List[str]) -> ContactInfo:
        """
        Heuristic extraction of contact info using regex and PDF annotation links.
        """
        # Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}', text)
        email = email_match.group(0) if email_match else None

        # Phone
        phone_match = re.search(
            r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}',
            text
        )
        phone = phone_match.group(0).strip() if phone_match else None

        # LinkedIn
        linkedin = None
        for link in links:
            if "linkedin.com/in/" in link:
                linkedin = link
                break
        if not linkedin:
            li_match = re.search(r'linkedin\.com/in/[\w\-]+', text, re.IGNORECASE)
            if li_match:
                linkedin = f"https://{li_match.group(0)}"

        # GitHub
        github = None
        for link in links:
            if "github.com/" in link and not any(x in link for x in ["/features", "/pricing", "/join"]):
                github = link
                break
        if not github:
            gh_match = re.search(r'github\.com/[\w\-]+', text, re.IGNORECASE)
            if gh_match:
                github = f"https://{gh_match.group(0)}"

        # Portfolio
        portfolio = None
        for link in links:
            if link not in [linkedin, github] and any(x in link for x in [".dev", ".io", ".me", "portfolio"]):
                portfolio = link
                break

        # Location heuristic (e.g. City, ST or City, Country)
        location = None
        loc_match = re.search(
            r'([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?),\s*([A-Z]{2}|[A-Z][a-zA-Z]+)',
            text[:600]
        )
        if loc_match:
            location = loc_match.group(0)

        # Name heuristic from first lines
        name = None
        first_lines = [line.strip() for line in text.splitlines() if line.strip()][:5]
        for line in first_lines:
            words = line.split()
            if 1 < len(words) <= 4 and all(w.replace(".", "").isalpha() for w in words):
                if not any(kw in line.lower() for kw in ["resume", "curriculum", "cv", "page", "developer", "engineer", "software"]):
                    name = line
                    break

        return ContactInfo(
            name=name,
            email=email,
            phone=phone,
            linkedin=linkedin,
            github=github,
            portfolio=portfolio,
            location=location,
        )

    @classmethod
    def parse_sections(cls, text: str) -> Dict[str, str]:
        """
        Parses resume text into clean, structured sections (summary, skills, experience, projects, education, certifications).
        """
        from app.services.ats_scorer import ATSScoringEngine
        return ATSScoringEngine._parse_resume_sections(text)

    @classmethod
    def _detect_sections(cls, text: str) -> List[str]:
        standard_sections = {
            "Professional Summary": [r"\bsummary\b", r"\bobjective\b", r"\bprofile\b", r"\babout me\b"],
            "Work Experience": [r"\bexperience\b", r"\bemployment\b", r"\bwork history\b", r"\bprofessional experience\b"],
            "Education": [r"\beducation\b", r"\bacademics\b", r"\bdegrees\b"],
            "Technical Skills": [r"\bskills\b", r"\btechnologies\b", r"\btechnical skills\b", r"\bcore competencies\b"],
            "Projects": [r"\bprojects\b", r"\bpersonal projects\b", r"\bkey projects\b"],
            "Certifications": [r"\bcertifications\b", r"\bcertificates\b", r"\blicenses\b"],
        }
        found: List[str] = []
        lower_text = text.lower()
        for section, patterns in standard_sections.items():
            if any(re.search(pat, lower_text) for pat in patterns):
                found.append(section)
        return found
