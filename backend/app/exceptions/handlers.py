from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from app.core.logging import logger


class GeospatialAppException(Exception):
    """Base exception for Geospatial Application."""
    def __init__(self, message: str, error_code: str = "INTERNAL_ERROR", status_code: int = 500):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(self.message)


class InvalidFileException(GeospatialAppException):
    """Exception raised for invalid file uploads or corrupted archives."""
    def __init__(self, message: str):
        super().__init__(message=message, error_code="INVALID_FILE", status_code=status.HTTP_400_BAD_REQUEST)


class FileNotFoundException(GeospatialAppException):
    """Exception raised when a requested file record is not found."""
    def __init__(self, message: str = "File not found."):
        super().__init__(message=message, error_code="FILE_NOT_FOUND", status_code=status.HTTP_404_NOT_FOUND)


class ProcessingException(GeospatialAppException):
    """Exception raised during geospatial file processing errors."""
    def __init__(self, message: str):
        super().__init__(message=message, error_code="PROCESSING_ERROR", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers with FastAPI application."""

    @app.exception_handler(GeospatialAppException)
    @app.exception_handler(InvalidFileException)
    @app.exception_handler(FileNotFoundException)
    @app.exception_handler(ProcessingException)
    async def custom_app_exception_handler(request: Request, exc: GeospatialAppException):
        logger.error(f"App Exception [{exc.error_code}]: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.error_code,
                "message": exc.message
            }
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled Server Error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "UNEXPECTED_ERROR",
                "message": "An unexpected internal server error occurred."
            }
        )
