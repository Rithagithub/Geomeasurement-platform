from fastapi.testclient import TestClient


def test_upload_valid_kml(client: TestClient, sample_kml_polygon_bytes: bytes):
    response = client.post(
        "/api/files/",
        files={"file": ("test_poly.kml", sample_kml_polygon_bytes, "application/vnd.google-earth.kml+xml")}
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["filename"] == "test_poly.kml"
    assert data["status"] == "COMPLETED"
    assert data["feature_count"] == 1
    assert data["crs"] is not None


def test_upload_valid_zip_shapefile(client: TestClient, sample_zip_shapefile_bytes: bytes):
    response = client.post(
        "/api/files/",
        files={"file": ("survey_data.zip", sample_zip_shapefile_bytes, "application/zip")}
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["filename"] == "survey_data.zip"
    assert data["status"] == "COMPLETED"
    assert data["feature_count"] == 1
    assert "EPSG:4326" in data["crs"]
