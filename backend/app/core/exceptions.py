from typing import Optional, Dict, Any


class AppException(Exception):
    """Base application exception."""
    status_code: int = 500
    error_code: str = "INTERNAL_SERVER_ERROR"

    def __init__(
        self,
        message: str,
        status_code: Optional[int] = None,
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        if status_code:
            self.status_code = status_code
        if error_code:
            self.error_code = error_code
        self.details = details or {}


class PDFValidationError(AppException):
    """Raised when PDF file validation fails (extension, MIME, magic bytes)."""
    status_code = 400
    error_code = "PDF_VALIDATION_ERROR"


class FileSizeLimitError(AppException):
    """Raised when uploaded file exceeds the configured size limit."""
    status_code = 413
    error_code = "FILE_TOO_LARGE"


class EmptyPDFError(AppException):
    """Raised when the PDF has 0 pages or contains no content."""
    status_code = 422
    error_code = "EMPTY_PDF_ERROR"


class ScannedPDFError(AppException):
    """Raised when PDF consists of scanned images without extractable text."""
    status_code = 422
    error_code = "SCANNED_PDF_NO_TEXT"


class EncryptedPDFError(AppException):
    """Raised when PDF is encrypted or password-protected."""
    status_code = 422
    error_code = "ENCRYPTED_PDF_ERROR"


class PDFExtractionError(AppException):
    """Raised when PyMuPDF encounters parsing errors."""
    status_code = 422
    error_code = "PDF_EXTRACTION_ERROR"
