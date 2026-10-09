from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.feature import FeatureResponse
from app.schemas.file import FileUploadResponse, FileDetailResponse
from app.schemas.measurement import FileMeasurementsResponse, MeasurementItem
from app.services.file_service import FileService
from typing import List

router = APIRouter()


@router.post("/", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and process a geospatial file (.kml or .zip Shapefile).
    Validates file format, extracts features, transforms CRS, calculates measurements,
    and returns initial file processing status metadata.
    """
    file_bytes = await file.read()
    file_record = FileService.upload_and_process_file(db=db, file=file, file_bytes=file_bytes)
    return FileUploadResponse(
        id=file_record.id,
        filename=file_record.original_filename,
        status=file_record.status,
        feature_count=file_record.feature_count,
        crs=file_record.crs
    )


@router.get("/{id}/", response_model=FileDetailResponse)
def get_file_info(
    id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves complete metadata, status, feature count, CRS, and processing timestamp
    for a specific file record.
    """
    file_record = FileService.get_file_record(db=db, file_id=id)
    return FileDetailResponse.model_validate(file_record)


@router.get("/{id}/measurements/", response_model=FileMeasurementsResponse)
def get_file_measurements(
    id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves spatial measurement results (Polygon Area in m², LineString Length in m)
    for all measurable features in the specified file.
    """
    file_record, measurements = FileService.get_measurements_for_file(db=db, file_id=id)
    measurement_items = [
        MeasurementItem(
            feature_index=m["feature_index"],
            geometry_type=m["geometry_type"],
            measurement_type=m["measurement_type"],
            value=m["value"],
            unit=m["unit"]
        )
        for m in measurements
    ]
    return FileMeasurementsResponse(
        file_id=file_record.id,
        measurements=measurement_items
    )


@router.get("/{id}/features/", response_model=List[FeatureResponse])
def get_file_features(
    id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves detailed feature records (index, geometry type, WKT geometry, properties)
    for a specific file.
    """
    features = FileService.get_features_for_file(db=db, file_id=id)
    return [FeatureResponse.model_validate(f) for f in features]
