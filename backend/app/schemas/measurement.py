from typing import List
from pydantic import BaseModel, ConfigDict


class MeasurementItem(BaseModel):
    """Schema representing an individual feature measurement."""

    feature_index: int
    geometry_type: str
    measurement_type: str
    value: float
    unit: str

    model_config = ConfigDict(from_attributes=True)


class FileMeasurementsResponse(BaseModel):
    """Response schema for GET /api/files/{id}/measurements/."""

    file_id: str
    measurements: List[MeasurementItem]

    model_config = ConfigDict(from_attributes=True)
