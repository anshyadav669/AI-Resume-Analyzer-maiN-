import os
import io
import pytest
from fastapi import UploadFile

from app.core.exceptions import (
    PDFValidationError,
    FileSizeLimitError,
    EmptyPDFError,
    ScannedPDFError,
)
from app.services.pdf_service import PDFService
from app.services.text_cleaner import TextCleaner
from app.api.endpoints.pdf import extract_text_endpoint

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAMPLE_PDF_PATH = os.path.join(BASE_DIR, "sample_data", "sample_software_engineer.pdf")
FIXTURES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures")
BLANK_PDF_PATH = os.path.join(FIXTURES_DIR, "blank_page.pdf")
SCANNED_PDF_PATH = os.path.join(FIXTURES_DIR, "scanned_simulated.pdf")


def test_text_cleaner_ligatures_and_bullets():
    raw = "• Built distributed architec-\n  ture with eﬃcient dataﬂow and ﬁrewall."
    cleaned, stats = TextCleaner.clean(raw)
    
    assert "•" not in cleaned
    assert "- Built" in cleaned
    assert "architecture" in cleaned
    assert "efficient" in cleaned
    assert "dataflow" in cleaned
    assert "firewall" in cleaned
    assert stats.bullets_normalized >= 1
    assert stats.ligatures_fixed >= 3
    assert stats.hyphenated_linebreaks_fixed >= 1


def test_text_cleaner_control_characters():
    raw = "Software Engineer\x00\x08\x0b\x1f - Nexus Systems"
    cleaned, stats = TextCleaner.clean(raw)
    assert "\x00" not in cleaned
    assert "\x08" not in cleaned
    assert "Software Engineer - Nexus Systems" in cleaned


def test_valid_pdf_extraction_and_temp_cleanup():
    with open(SAMPLE_PDF_PATH, "rb") as f:
        file_bytes = f.read()

    upload = UploadFile(
        filename="alex_chen_resume.pdf",
        file=io.BytesIO(file_bytes)
    )

    temp_path_captured = None
    with PDFService.save_upload_to_temp_file(upload) as (temp_path, size):
        temp_path_captured = temp_path
        assert os.path.exists(temp_path)
        assert size == len(file_bytes)
        
        result = PDFService.extract_text_from_temp_file(temp_path, "alex_chen_resume.pdf", size)
        assert result.success is True
        assert result.page_count == 1
        assert result.word_count > 100
        assert "Alex Chen" in result.cleaned_text or "ALEX CHEN" in result.cleaned_text
        assert result.contact_info.email == "alex.chen@example.com"
        assert len(result.sections_detected) >= 3

    # Verify temp file was cleanly deleted
    assert temp_path_captured is not None
    assert not os.path.exists(temp_path_captured), "Temporary file was not deleted after extraction!"


def test_invalid_extension_rejection():
    upload = UploadFile(
        filename="malicious.exe",
        file=io.BytesIO(b"%PDF-1.4 dummy content")
    )
    with pytest.raises(PDFValidationError) as exc_info:
        with PDFService.save_upload_to_temp_file(upload):
            pass
    assert "Only .pdf files are accepted" in str(exc_info.value)


def test_invalid_magic_header_rejection():
    upload = UploadFile(
        filename="fake_resume.pdf",
        file=io.BytesIO(b"This is a text file renamed to .pdf")
    )
    with pytest.raises(PDFValidationError) as exc_info:
        with PDFService.save_upload_to_temp_file(upload):
            pass
    assert "invalid magic header %PDF-" in str(exc_info.value)


def test_empty_zero_byte_file_rejection():
    upload = UploadFile(
        filename="empty.pdf",
        file=io.BytesIO(b"")
    )
    with pytest.raises(PDFValidationError) as exc_info:
        with PDFService.save_upload_to_temp_file(upload):
            pass


def test_scanned_pdf_detection():
    with open(SCANNED_PDF_PATH, "rb") as f:
        scanned_bytes = f.read()

    upload = UploadFile(
        filename="scanned_simulated.pdf",
        file=io.BytesIO(scanned_bytes)
    )
    with pytest.raises(ScannedPDFError) as exc_info:
        with PDFService.save_upload_to_temp_file(upload) as (temp_path, size):
            PDFService.extract_text_from_temp_file(temp_path, "scanned_simulated.pdf", size)
    assert "Scanned image PDF detected" in str(exc_info.value)


def test_blank_pdf_detection():
    with open(BLANK_PDF_PATH, "rb") as f:
        blank_bytes = f.read()

    upload = UploadFile(
        filename="blank_page.pdf",
        file=io.BytesIO(blank_bytes)
    )
    with pytest.raises(EmptyPDFError) as exc_info:
        with PDFService.save_upload_to_temp_file(upload) as (temp_path, size):
            PDFService.extract_text_from_temp_file(temp_path, "blank_page.pdf", size)
    assert "no readable text content" in str(exc_info.value)


def test_extract_text_endpoint_handler():
    with open(SAMPLE_PDF_PATH, "rb") as f:
        file_bytes = f.read()

    upload = UploadFile(
        filename="sample_software_engineer.pdf",
        file=io.BytesIO(file_bytes)
    )
    response = extract_text_endpoint(upload)
    assert response.success is True
    assert response.filename == "sample_software_engineer.pdf"
    assert response.page_count == 1
    assert response.word_count > 100
    assert response.cleaning_stats.original_character_count > 0
    assert response.contact_info.email == "alex.chen@example.com"
    print("Endpoint returned extracted text preview:", response.cleaned_text[:120])
