from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class FeatureResponse(BaseModel):
    """Schema representing feature details."""

    id: str
    file_id: str
    feature_index: int
    geometry_type: str
    geometry: str
    properties: Optional[Dict[str, Any]] = None
    source_crs: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
