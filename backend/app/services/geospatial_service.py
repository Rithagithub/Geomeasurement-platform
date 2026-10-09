import json
from pathlib import Path
from typing import List, Dict, Any, Tuple
import geopandas as gpd
import pandas as pd
import numpy as np
import fiona

from app.services.crs_service import CRSService
from app.services.measurement_service import MeasurementService
from app.utils.archive_utils import safe_extract_zip
from app.exceptions.handlers import ProcessingException, InvalidFileException
from app.core.logging import logger

# Enable KML driver support in Fiona
try:
    fiona.drvsupport.supported_drivers["KML"] = "rw"
    fiona.drvsupport.supported_drivers["LIBKML"] = "rw"
except Exception as e:
    logger.warning(f"Could not register KML driver in Fiona: {str(e)}")


def clean_properties(row_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts DataFrame row properties to JSON-serializable Python types.
    Handles NaN, NaT, NumPy primitives, and Datetime objects.
    """
    cleaned = {}
    for key, val in row_dict.items():
        if key.lower() in ("geometry", "geom"):
            continue
        if pd.isna(val) or val is None:
            cleaned[key] = None
        elif isinstance(val, (np.integer, int)):
            cleaned[key] = int(val)
        elif isinstance(val, (np.floating, float)):
            cleaned[key] = float(val) if not np.isnan(val) else None
        elif isinstance(val, (pd.Timestamp, np.datetime64)):
            cleaned[key] = str(val)
        elif isinstance(val, (list, dict, str, bool)):
            cleaned[key] = val
        else:
            cleaned[key] = str(val)
    return cleaned


class GeospatialService:
    """
    Service responsible for reading KML and Shapefile files using GeoPandas,
    extracting features, determining CRS, and orchestrating measurement calculations.
    """

    @classmethod
    def load_geodataframe(cls, file_path: Path, file_type: str, extract_dir: Path) -> gpd.GeoDataFrame:
        """
        Reads a geospatial file (.kml or .zip Shapefile) into a GeoPandas GeoDataFrame.
        """
        try:
            if file_type == "kml":
                logger.info(f"Reading KML file: {file_path.name}")
                try:
                    gdf = gpd.read_file(file_path, engine="fiona")
                except Exception:
                    gdf = gpd.read_file(file_path)

            elif file_type == "zip_shapefile":
                logger.info(f"Extracting and reading ZIP Shapefile: {file_path.name}")
                shp_path = safe_extract_zip(file_path, extract_dir)
                logger.info(f"Reading extracted Shapefile: {shp_path.name}")
                gdf = gpd.read_file(shp_path)

            else:
                raise InvalidFileException(f"Unsupported file type: {file_type}")

            if gdf.empty:
                raise InvalidFileException("Geospatial file contains no valid features/geometries.")

            return gdf

        except InvalidFileException:
            raise
        except Exception as e:
            logger.exception(f"Failed to read geospatial file {file_path.name}: {str(e)}")
            raise ProcessingException(f"Could not parse geospatial file content: {str(e)}")

    @classmethod
    def process_geospatial_file(
        cls, file_path: Path, file_type: str, extract_dir: Path
    ) -> Tuple[str, List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Orchestrates full file processing:
        1. Reads GeoDataFrame.
        2. Detects original source CRS string.
        3. Reprojects to UTM projected CRS for accurate measurement calculations.
        4. Extracts features and computes measurements.

        Returns:
            Tuple of (source_crs_str, extracted_features_list, calculated_measurements_list)
        """
        gdf = cls.load_geodataframe(file_path, file_type, extract_dir)

        source_crs_str = CRSService.get_crs_string(gdf)
        logger.info(f"Source CRS for file {file_path.name}: {source_crs_str}")

        # Perform CRS transformation to projected metric CRS (UTM) for measurements
        gdf_projected, projected_crs_str = CRSService.transform_to_projected(gdf)
        logger.info(f"Projected CRS for measurements: {projected_crs_str}")

        features_data = []
        measurements_data = []

        for idx, row in gdf.iterrows():
            geom = row.geometry
            if geom is None or geom.is_empty:
                logger.warning(f"Feature index {idx} has empty or null geometry. Skipping feature.")
                continue

            geom_type = geom.geom_type
            wkt_geometry = geom.wkt
            properties = clean_properties(row.to_dict())

            feature_dict = {
                "feature_index": int(idx),
                "geometry_type": geom_type,
                "geometry": wkt_geometry,
                "properties": properties,
                "source_crs": source_crs_str
            }
            features_data.append(feature_dict)

            # Measurement calculation on projected geometry
            projected_geom = gdf_projected.geometry.iloc[idx]
            measurement_res = MeasurementService.calculate_measurement(projected_geom)

            if measurement_res is not None:
                measurements_data.append({
                    "feature_index": int(idx),
                    "geometry_type": geom_type,
                    "measurement_type": measurement_res["measurement_type"],
                    "value": measurement_res["value"],
                    "unit": measurement_res["unit"]
                })

        logger.info(
            f"Successfully processed {len(features_data)} features and {len(measurements_data)} measurements "
            f"for file {file_path.name}"
        )

        return source_crs_str, features_data, measurements_data
