import zipfile
from pathlib import Path
from fastapi import UploadFile

from app.core.config import settings
from app.exceptions.handlers import InvalidFileException


FORBIDDEN_EXTENSIONS = {".exe", ".py", ".js", ".sh", ".bat", ".dll", ".so", ".elf", ".php"}


def validate_upload_file(file: UploadFile, file_bytes: bytes) -> str:
    """
    Validates uploaded file size, extension, and content headers.
    Returns detected file_type string ('kml' or 'zip_shapefile').
    Raises InvalidFileException if validation fails.
    """
    filename = file.filename or ""
    file_ext = Path(filename).suffix.lower()

    if file_ext in FORBIDDEN_EXTENSIONS:
        raise InvalidFileException(f"Forbidden file extension: '{file_ext}'. Executable/script files are rejected.")

    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise InvalidFileException(
            f"Unsupported file format '{file_ext}'. Allowed formats are: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Size validation
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise InvalidFileException(
            f"File size exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_MB} MB."
        )

    if len(file_bytes) == 0:
        raise InvalidFileException("Uploaded file is empty.")

    # Content validation
    if file_ext == ".zip":
        if not zipfile.is_zipfile(file.file):
            # Reset file stream position and retry with BytesIO-like check on bytes
            import io
            if not zipfile.is_zipfile(io.BytesIO(file_bytes)):
                raise InvalidFileException("Invalid or corrupted ZIP archive.")
        return "zip_shapefile"

    elif file_ext == ".kml":
        header_sample = file_bytes[:1024].decode("utf-8", errors="ignore").lower()
        if not ("<kml" in header_sample or "<?xml" in header_sample or "<placemark" in header_sample):
            raise InvalidFileException("Invalid KML file content. Missing valid XML/KML tags.")
        return "kml"

    raise InvalidFileException("File validation failed due to unsupported type.")
