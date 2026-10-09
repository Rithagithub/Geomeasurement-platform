import zipfile
import io
import pytest
from fastapi.testclient import TestClient

from app.utils.file_validation import validate_upload_file
from app.utils.archive_utils import safe_extract_zip
from app.exceptions.handlers import InvalidFileException


def test_reject_forbidden_extensions(client: TestClient):
    response = client.post(
        "/api/files/",
        files={"file": ("malicious.exe", b"MZ...", "application/octet-stream")}
    )
    assert response.status_code == 400
    res_json = response.json()
    assert res_json["error"] == "INVALID_FILE"
    assert "Forbidden file extension" in res_json["message"]


def test_reject_unsupported_extensions(client: TestClient):
    response = client.post(
        "/api/files/",
        files={"file": ("notes.txt", b"plain text content", "text/plain")}
    )
    assert response.status_code == 400
    res_json = response.json()
    assert res_json["error"] == "INVALID_FILE"
    assert "Unsupported file format" in res_json["message"]


def test_reject_corrupted_zip(client: TestClient):
    response = client.post(
        "/api/files/",
        files={"file": ("bad_archive.zip", b"not a zip content", "application/zip")}
    )
    assert response.status_code == 400
    res_json = response.json()
    assert res_json["error"] == "INVALID_FILE"
    assert "Invalid or corrupted ZIP" in res_json["message"]


def test_zip_slip_protection(tmp_path):
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w") as zf:
        zf.writestr("../../etc/passwd", "root:x:0:0:root:/root:/bin/bash")
    
    zip_buf.seek(0)
    zip_path = tmp_path / "zip_slip.zip"
    with open(zip_path, "wb") as f:
        f.write(zip_buf.read())
        
    extract_target = tmp_path / "extracted"
    extract_target.mkdir()

    with pytest.raises(InvalidFileException) as exc_info:
        safe_extract_zip(zip_path, extract_target)
    
    assert "Zip Slip" in str(exc_info.value)


def test_missing_shapefile_components(tmp_path):
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w") as zf:
        zf.writestr("test.shp", b"dummy shapefile content")
        # Missing test.shx and test.dbf
    
    zip_buf.seek(0)
    zip_path = tmp_path / "missing_parts.zip"
    with open(zip_path, "wb") as f:
        f.write(zip_buf.read())

    extract_target = tmp_path / "extracted"
    extract_target.mkdir()

    with pytest.raises(InvalidFileException) as exc_info:
        safe_extract_zip(zip_path, extract_target)

    assert "missing essential component files" in str(exc_info.value)


def test_reject_zip_without_shapefile(client: TestClient):
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w") as zf:
        zf.writestr("code.js", "console.log('hello');")
        zf.writestr("README.txt", "Some text file")
    
    response = client.post(
        "/api/files/",
        files={"file": ("project_files.zip", zip_buf.getvalue(), "application/zip")}
    )
    assert response.status_code == 400
    res_json = response.json()
    assert res_json["error"] == "INVALID_FILE"
    assert "No .shp file found" in res_json["message"]
