import uuid
from pathlib import Path
from typing import Tuple, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import UploadFile

from app.core.config import settings
from app.core.logging import logger
from app.db.models.file import FileModel, FileStatus
from app.db.models.feature import FeatureModel
from app.db.models.measurement import MeasurementModel
from app.exceptions.handlers import (
    FileNotFoundException,
    ProcessingException,
    InvalidFileException,
    GeospatialAppException,
)
from app.services.geospatial_service import GeospatialService
from app.utils.file_validation import validate_upload_file


class FileService:
    """
    Coordinates file uploading, file persistence, geospatial processing execution,
    database record updates, and retrieval queries.
    """

    @classmethod
    def upload_and_process_file(cls, db: Session, file: UploadFile, file_bytes: bytes) -> FileModel:
        """
        Main pipeline method:
        1. Validates file extension, size, and magic headers.
        2. Saves uploaded file safely to disk.
        3. Creates initial File DB record with status=PROCESSING.
        4. Processes geospatial data, extracts features and measurements.
        5. Persists features and measurements to DB.
        6. Updates status to COMPLETED (or FAILED on error).
        """
        file_type = validate_upload_file(file, file_bytes)
        original_filename = file.filename or "unknown_file"

        # Unique safe storage filename
        file_uuid = str(uuid.uuid4())
        safe_filename = f"{file_uuid}_{Path(original_filename).name}"
        upload_file_path = settings.UPLOAD_DIR / safe_filename

        # Write uploaded bytes to disk
        with open(upload_file_path, "wb") as f:
            f.write(file_bytes)

        # Create database file record
        file_record = FileModel(
            id=file_uuid,
            filename=safe_filename,
            original_filename=original_filename,
            file_type=file_type,
            status=FileStatus.PROCESSING.value,
            feature_count=0
        )
        db.add(file_record)
        db.commit()
        db.refresh(file_record)

        # Process file content
        extract_dir = settings.PROCESSED_DIR / file_uuid
        extract_dir.mkdir(parents=True, exist_ok=True)

        try:
            source_crs, features_data, measurements_data = GeospatialService.process_geospatial_file(
                file_path=upload_file_path,
                file_type=file_type,
                extract_dir=extract_dir
            )

            # Persist features and measurements in database
            feature_index_to_model_id = {}

            for feat in features_data:
                feat_model = FeatureModel(
                    file_id=file_record.id,
                    feature_index=feat["feature_index"],
                    geometry_type=feat["geometry_type"],
                    geometry=feat["geometry"],
                    properties=feat["properties"],
                    source_crs=feat["source_crs"]
                )
                db.add(feat_model)
                db.flush()  # Generate feat_model.id
                feature_index_to_model_id[feat["feature_index"]] = feat_model.id

            for meas in measurements_data:
                feat_id = feature_index_to_model_id.get(meas["feature_index"])
                if feat_id:
                    meas_model = MeasurementModel(
                        feature_id=feat_id,
                        measurement_type=meas["measurement_type"],
                        measurement_value=meas["value"],
                        unit=meas["unit"]
                    )
                    db.add(meas_model)

            # Mark COMPLETED
            file_record.status = FileStatus.COMPLETED.value
            file_record.crs = source_crs
            file_record.feature_count = len(features_data)
            db.commit()
            db.refresh(file_record)

            logger.info(f"File record {file_record.id} successfully processed and marked COMPLETED.")
            return file_record

        except Exception as e:
            logger.error(f"Error processing file {file_record.id}: {str(e)}")
            try:
                db.rollback()
                rec = db.query(FileModel).filter(FileModel.id == file_record.id).first()
                if rec:
                    rec.status = FileStatus.FAILED.value
                    rec.error_message = str(e)
                    db.commit()
            except Exception as db_err:
                logger.warning(f"Could not persist failure status in DB: {db_err}")
                db.rollback()
            
            if isinstance(e, (InvalidFileException, ProcessingException, GeospatialAppException)):
                raise e
            raise ProcessingException(f"Failed to process geospatial file: {str(e)}")

    @classmethod
    def get_file_record(cls, db: Session, file_id: str) -> FileModel:
        """Retrieves file record by ID or raises FileNotFoundException."""
        file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
        if not file_record:
            raise FileNotFoundException(f"File with ID '{file_id}' was not found.")
        return file_record

    @classmethod
    def get_measurements_for_file(cls, db: Session, file_id: str) -> Tuple[FileModel, List[Dict[str, Any]]]:
        """
        Retrieves file metadata and all calculated measurements for measurable features.
        """
        file_record = cls.get_file_record(db, file_id)

        # Join features and measurements
        measurements_query = (
            db.query(MeasurementModel, FeatureModel)
            .join(FeatureModel, MeasurementModel.feature_id == FeatureModel.id)
            .filter(FeatureModel.file_id == file_id)
            .order_by(FeatureModel.feature_index)
            .all()
        )

        results = []
        for meas, feat in measurements_query:
            results.append({
                "feature_index": feat.feature_index,
                "geometry_type": feat.geometry_type,
                "measurement_type": meas.measurement_type,
                "value": meas.measurement_value,
                "unit": meas.unit
            })

        return file_record, results

    @classmethod
    def get_features_for_file(cls, db: Session, file_id: str) -> List[FeatureModel]:
        """
        Retrieves all extracted features for a specific file.
        """
        cls.get_file_record(db, file_id)  # Ensure file exists
        return (
            db.query(FeatureModel)
            .filter(FeatureModel.file_id == file_id)
            .order_by(FeatureModel.feature_index)
            .all()
        )
