import os
import zipfile
import tempfile
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import geopandas as gpd
from shapely.geometry import Polygon, LineString, Point

from app.main import app
from app.db.database import Base, get_db
from app.core.config import settings

# Setup isolated SQLite test database
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test_geomeasurement.db"

engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_geomeasurement.db"):
        try:
            os.remove("./test_geomeasurement.db")
        except Exception:
            pass


@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def sample_kml_polygon_bytes() -> bytes:
    content = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Test Polygon</name>
    <Placemark>
      <name>Field Zone 1</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              77.5946,12.9716,0
              77.5956,12.9716,0
              77.5956,12.9726,0
              77.5946,12.9726,0
              77.5946,12.9716,0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>"""
    return content.encode("utf-8")


@pytest.fixture
def sample_kml_lines_bytes() -> bytes:
    content = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Test Line and Point</name>
    <Placemark>
      <name>Road Segment A</name>
      <LineString>
        <coordinates>
          77.5946,12.9716,0
          77.5986,12.9756,0
        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Tower Point</name>
      <Point>
        <coordinates>
          77.5946,12.9716,0
        </coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>"""
    return content.encode("utf-8")


@pytest.fixture
def sample_zip_shapefile_bytes() -> bytes:
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        poly = Polygon([(77.5946, 12.9716), (77.5966, 12.9716), (77.5966, 12.9736), (77.5946, 12.9736)])
        gdf = gpd.GeoDataFrame([{"id": 1, "name": "Zone Alpha"}], geometry=[poly], crs="EPSG:4326")
        
        shp_file = tmp_path / "test_shape.shp"
        gdf.to_file(shp_file, driver="ESRI Shapefile")
        
        zip_path = tmp_path / "test_shapefile.zip"
        with zipfile.ZipFile(zip_path, "w") as zf:
            for ext in [".shp", ".shx", ".dbf", ".prj"]:
                f_part = tmp_path / f"test_shape{ext}"
                if f_part.exists():
                    zf.write(f_part, arcname=f_part.name)
                    
        with open(zip_path, "rb") as f:
            return f.read()
