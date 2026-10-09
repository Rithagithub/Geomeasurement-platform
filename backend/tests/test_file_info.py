from fastapi.testclient import TestClient


def test_get_file_info_success(client: TestClient, sample_kml_polygon_bytes: bytes):
    upload_res = client.post(
        "/api/files/",
        files={"file": ("field_boundary.kml", sample_kml_polygon_bytes, "application/vnd.google-earth.kml+xml")}
    )
    file_id = upload_res.json()["id"]

    info_res = client.get(f"/api/files/{file_id}/")
    assert info_res.status_code == 200
    data = info_res.json()
    assert data["id"] == file_id
    assert data["original_filename"] == "field_boundary.kml"
    assert data["file_type"] == "kml"
    assert data["status"] == "COMPLETED"
    assert data["feature_count"] == 1
    assert "created_at" in data


def test_get_file_info_not_found(client: TestClient):
    response = client.get("/api/files/nonexistent-uuid-12345/")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] == "FILE_NOT_FOUND"
    assert "was not found" in data["message"]
