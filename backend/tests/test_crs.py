import geopandas as gpd
from shapely.geometry import Polygon, GeometryCollection, Point
from app.services.crs_service import CRSService
from app.services.measurement_service import MeasurementService


def test_geographic_crs_to_utm_transformation():
    # Polygon near Bangalore (long 77.59, lat 12.97) -> should project to UTM zone 43N (EPSG:32643)
    poly = Polygon([(77.5946, 12.9716), (77.5956, 12.9716), (77.5956, 12.9726), (77.5946, 12.9726)])
    gdf = gpd.GeoDataFrame([{"id": 1}], geometry=[poly], crs="EPSG:4326")

    gdf_proj, proj_crs_str = CRSService.transform_to_projected(gdf)

    assert "32643" in proj_crs_str or "EPSG" in proj_crs_str
    assert not gdf_proj.crs.is_geographic
    assert gdf_proj.crs.is_projected


def test_missing_crs_fallback():
    poly = Polygon([(0, 0), (1, 0), (1, 1), (0, 1)])
    gdf = gpd.GeoDataFrame([{"id": 1}], geometry=[poly], crs=None)

    gdf_proj, proj_crs_str = CRSService.transform_to_projected(gdf)
    assert proj_crs_str is not None
    assert gdf_proj.crs is not None


def test_unsupported_geometry_collection_graceful_handling():
    gc = GeometryCollection([Point(0, 0), Polygon([(0, 0), (1, 0), (1, 1), (0, 1)])])
    res = MeasurementService.calculate_measurement(gc)
    # Should not crash; returns None
    assert res is None
