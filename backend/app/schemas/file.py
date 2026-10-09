from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class FileUploadResponse(BaseModel):
    """Response schema for file upload endpoint POST /api/files/."""

    id: str
    filename: str
    status: str
    feature_count: int
    crs: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class FileDetailResponse(BaseModel):
    """Detailed file metadata response schema for GET /api/files/{id}/."""

    id: str
    filename: str
    original_filename: str
    file_type: str
    status: str
    feature_count: int
    crs: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
