from typing import Tuple, Optional
import geopandas as gpd
from pyproj import CRS
import shapely.geometry.base

from app.core.logging import logger


class CRSService:
    """
    Dedicated service for Coordinate Reference System (CRS) detection,
    geographic vs. projected classification, and automatic UTM transformation.
    """

    @staticmethod
    def get_crs_string(gdf: gpd.GeoDataFrame) -> str:
        """Returns string representation of source CRS (e.g. 'EPSG:4326' or 'UNKNOWN')."""
        if gdf.crs is not None:
            return gdf.crs.to_string()
        return "EPSG:4326 (Assumed Default)"

    @classmethod
    def transform_to_projected(cls, gdf: gpd.GeoDataFrame) -> Tuple[gpd.GeoDataFrame, str]:
        """
        Transforms a GeoDataFrame to an appropriate metric projected CRS (UTM).
        
        - If source CRS is missing, assumes EPSG:4326 WGS84 geographic CRS.
        - If source CRS is geographic (e.g., EPSG:4326), automatically estimates the local UTM zone
          projected CRS based on geometry centroid and reprojects data.
        - If source CRS is already projected, preserves the existing CRS.

        Returns:
            Tuple of (Transformed GeoDataFrame, Projected CRS string)
        """
        if gdf.empty:
            return gdf, "EPSG:4326"

        source_crs = gdf.crs

        # Fallback if CRS is missing
        if source_crs is None:
            logger.warning("File missing CRS information. Assuming standard geographic EPSG:4326 (WGS84).")
            gdf = gdf.set_crs("EPSG:4326")
            source_crs = gdf.crs

        # Check if CRS is geographic (latitude/longitude in degrees)
        if source_crs.is_geographic:
            try:
                # Estimate optimal UTM zone for metric projection
                target_utm_crs = gdf.estimate_utm_crs()
                logger.info(f"Source CRS is geographic ({source_crs.to_string()}). Transforming to projected UTM: {target_utm_crs.to_string()}")
                gdf_projected = gdf.to_crs(target_utm_crs)
                return gdf_projected, target_utm_crs.to_string()
            except Exception as e:
                logger.error(f"Failed to estimate UTM CRS: {str(e)}. Falling back to EPSG:3857 (Web Mercator).")
                gdf_projected = gdf.to_crs("EPSG:3857")
                return gdf_projected, "EPSG:3857"
        else:
            logger.info(f"Source CRS is already projected: {source_crs.to_string()}")
            return gdf, source_crs.to_string()
