from typing import Optional, Dict, Any
import shapely.geometry.base
from shapely.geometry import Polygon, MultiPolygon, LineString, MultiLineString, Point, MultiPoint

from app.core.logging import logger


class MeasurementService:
    """
    Service responsible for calculating spatial measurements on geometries
    in a projected metric CRS.
    """

    @classmethod
    def calculate_measurement(cls, geometry: shapely.geometry.base.BaseGeometry) -> Optional[Dict[str, Any]]:
        """
        Calculates metric area or length based on geometry type.

        Rules:
        - Polygon / MultiPolygon -> Area (m²)
        - LineString / MultiLineString -> Length (m)
        - Point / MultiPoint -> None (Point measurement not required)
        - Unsupported / Invalid -> None (graceful failure, no crash)

        Returns:
            Dictionary with 'measurement_type', 'value', and 'unit', or None.
        """
        if geometry is None or geometry.is_empty:
            logger.warning("Empty or null geometry encountered in measurement service.")
            return None

        geom_type = geometry.geom_type

        try:
            if geom_type in ("Polygon", "MultiPolygon"):
                area_sqm = float(geometry.area)
                return {
                    "measurement_type": "area",
                    "value": round(area_sqm, 2),
                    "unit": "m²"
                }

            elif geom_type in ("LineString", "MultiLineString"):
                length_m = float(geometry.length)
                return {
                    "measurement_type": "length",
                    "value": round(length_m, 2),
                    "unit": "m"
                }

            elif geom_type in ("Point", "MultiPoint"):
                logger.debug(f"Geometry type '{geom_type}' does not require spatial measurement.")
                return None

            else:
                logger.warning(f"Unsupported geometry type for measurement: '{geom_type}'")
                return None

        except Exception as e:
            logger.error(f"Error calculating measurement for geometry type '{geom_type}': {str(e)}")
            return None
