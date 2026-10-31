import logging
from fastapi import APIRouter, File, UploadFile, status
from app.services.pdf_service import PDFService
from app.schemas.pdf import PDFExtractionResponse, PDFValidationResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["PDF Extraction & Validation"])


@router.post(
    "/extract-text",
    response_model=PDFExtractionResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload PDF Resume & Extract Structured Normalized Text",
    description="Accepts a PDF resume, enforces size & format restrictions, extracts block-level text via PyMuPDF, cleans and normalizes ligatures/bullets, and returns structured JSON.",
)
def extract_text_endpoint(
    file: UploadFile = File(..., description="PDF resume file to extract")
):
    """
    Accepts a resume PDF, validates magic bytes and size, writes to a secure
    temporary file on disk, extracts raw & normalized text, and safely deletes
    the temp file upon completion.
    """
    filename = file.filename or "resume.pdf"
    logger.info(f"Processing PDF extraction request for: {filename}")

    with PDFService.save_upload_to_temp_file(file) as (temp_path, file_size):
        result = PDFService.extract_text_from_temp_file(
            file_path=temp_path,
            filename=filename,
            file_size=file_size
        )

    logger.info(
        f"Successfully extracted {result.word_count} words across {result.page_count} page(s) from {filename}"
    )
    return result


@router.post(
    "/pdf/validate",
    response_model=PDFValidationResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate PDF File Integrity & Parsability",
    description="Quick pre-flight check to verify that the PDF is not encrypted, empty, or corrupted.",
)
def validate_pdf_endpoint(
    file: UploadFile = File(..., description="PDF resume file to validate")
):
    filename = file.filename or "resume.pdf"
    with PDFService.save_upload_to_temp_file(file) as (temp_path, file_size):
        # Inspect using extract_text_from_temp_file (which validates encryption, pages, and text density)
        result = PDFService.extract_text_from_temp_file(
            file_path=temp_path,
            filename=filename,
            file_size=file_size
        )
        return PDFValidationResponse(
            is_valid=True,
            filename=filename,
            file_size_bytes=file_size,
            page_count=result.page_count,
            is_encrypted=False,
            is_scanned=False,
            message=f"PDF is valid with {result.page_count} page(s) and {result.word_count} extractable words."
        )
