import os
import zipfile
from pathlib import Path
from typing import List

from app.exceptions.handlers import InvalidFileException
from app.core.logging import logger


def safe_extract_zip(zip_path: Path, target_dir: Path) -> Path:
    """
    Safely extracts a ZIP archive preventing Zip Slip vulnerabilities.
    Locates and verifies mandatory Shapefile components (.shp, .shx, .dbf).
    Returns the Path to the primary .shp file.
    """
    target_dir_resolved = target_dir.resolve()

    try:
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            for member in zip_ref.infolist():
                # Resolve destination path forZip Slip check
                member_path = (target_dir / member.filename).resolve()
                if not str(member_path).startswith(str(target_dir_resolved)):
                    raise InvalidFileException(
                        f"Zip Slip path traversal attempt detected in archive member: {member.filename}"
                    )
            zip_ref.extractall(target_dir)
    except zipfile.BadZipFile:
        raise InvalidFileException("Uploaded ZIP file is corrupted or not a valid archive.")

    # Locate .shp file
    shp_files: List[Path] = list(target_dir.rglob("*.shp"))
    if not shp_files:
        raise InvalidFileException("No .shp file found inside the uploaded ZIP archive.")

    primary_shp = shp_files[0]
    shp_stem = primary_shp.stem
    shp_dir = primary_shp.parent

    # Verify matching components (.shx, .dbf)
    shx_file = shp_dir / f"{shp_stem}.shx"
    dbf_file = shp_dir / f"{shp_stem}.dbf"

    missing_components = []
    if not shx_file.exists():
        missing_components.append(f"{shp_stem}.shx")
    if not dbf_file.exists():
        missing_components.append(f"{shp_stem}.dbf")

    if missing_components:
        logger.warning(f"Shapefile in {zip_path.name} missing components: {missing_components}")
        # Note: Fiona/GeoPandas might still read if missing .shx/.dbf, but we warn or enforce.
        # Enforce minimum .shx and .dbf for valid shapefile structure
        raise InvalidFileException(
            f"Shapefile is missing essential component files: {', '.join(missing_components)}"
        )

    return primary_shp
