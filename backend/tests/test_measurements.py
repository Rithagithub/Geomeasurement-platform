from fastapi.testclient import TestClient
from shapely.geometry import Polygon, LineString, Point
from app.services.measurement_service import MeasurementService


def test_polygon_area_measurement(client: TestClient, sample_kml_polygon_bytes: bytes):
    upload_res = client.post(
        "/api/files/",
        files={"file": ("area_test.kml", sample_kml_polygon_bytes, "application/vnd.google-earth.kml+xml")}
    )
    file_id = upload_res.json()["id"]

    meas_res = client.get(f"/api/files/{file_id}/measurements/")
    assert meas_res.status_code == 200
    data = meas_res.json()
    assert data["file_id"] == file_id
    measurements = data["measurements"]
    assert len(measurements) == 1
    m = measurements[0]
    assert m["geometry_type"] == "Polygon"
    assert m["measurement_type"] == "area"
    assert m["unit"] == "m²"
    assert m["value"] > 0.0


def test_linestring_length_and_point_handling(client: TestClient, sample_kml_lines_bytes: bytes):
    upload_res = client.post(
        "/api/files/",
        files={"file": ("lines_and_points.kml", sample_kml_lines_bytes, "application/vnd.google-earth.kml+xml")}
    )
    file_id = upload_res.json()["id"]

    meas_res = client.get(f"/api/files/{file_id}/measurements/")
    assert meas_res.status_code == 200
    data = meas_res.json()
    measurements = data["measurements"]
    # Only LineString should have measurement; Point should be omitted
    assert len(measurements) == 1
    m = measurements[0]
    assert m["geometry_type"] == "LineString"
    assert m["measurement_type"] == "length"
    assert m["unit"] == "m"
    assert m["value"] > 0.0


def test_direct_measurement_service_unit():
    poly = Polygon([(0, 0), (10, 0), (10, 10), (0, 10)])
    res_poly = MeasurementService.calculate_measurement(poly)
    assert res_poly["measurement_type"] == "area"
    assert res_poly["value"] == 100.0
    assert res_poly["unit"] == "m²"

    line = LineString([(0, 0), (10, 0)])
    res_line = MeasurementService.calculate_measurement(line)
    assert res_line["measurement_type"] == "length"
    assert res_line["value"] == 10.0
    assert res_line["unit"] == "m"

    pt = Point(5, 5)
    res_pt = MeasurementService.calculate_measurement(pt)
    assert res_pt is None
