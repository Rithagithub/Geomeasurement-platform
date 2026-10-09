import zipfile
import tempfile
from pathlib import Path
import geopandas as gpd
from shapely.geometry import Polygon, LineString, Point

sample_dir = Path("sample_data")
sample_dir.mkdir(parents=True, exist_ok=True)

# 1. Generate sample_polygon.kml
kml_polygon_content = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Sample Polygon Document</name>
    <Placemark>
      <name>Survey Field A</name>
      <description>Sample agricultural polygon field</description>
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

with open(sample_dir / "sample_polygon.kml", "w", encoding="utf-8") as f:
    f.write(kml_polygon_content)

# 2. Generate sample_lines.kml
kml_lines_content = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Sample Lines and Points</name>
    <Placemark>
      <name>Transmission Line 1</name>
      <LineString>
        <coordinates>
          77.5946,12.9716,0
          77.5986,12.9756,0
        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Waypoint Station</name>
      <Point>
        <coordinates>
          77.5946,12.9716,0
        </coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>"""

with open(sample_dir / "sample_lines.kml", "w", encoding="utf-8") as f:
    f.write(kml_lines_content)

# 3. Generate sample_shapefile.zip (containing Polygons and LineStrings)
with tempfile.TemporaryDirectory() as tmpdir:
    tmp_path = Path(tmpdir)
    
    # Create GeoDataFrame with Polygon, LineString, Point (Shapefiles usually enforce homogeneous geometry per layer, but let's create a Polygon shapefile for sample)
    poly = Polygon([(77.5946, 12.9716), (77.5966, 12.9716), (77.5966, 12.9736), (77.5946, 12.9736)])
    gdf = gpd.GeoDataFrame(
        [{"id": 1, "name": "Zone A", "type": "Boundary"}],
        geometry=[poly],
        crs="EPSG:4326"
    )
    
    shp_base = tmp_path / "sample_survey"
    gdf.to_file(f"{shp_base}.shp", driver="ESRI Shapefile")
    
    zip_dest = sample_dir / "sample_shapefile.zip"
    with zipfile.ZipFile(zip_dest, "w") as zf:
        for ext in [".shp", ".shx", ".dbf", ".prj", ".cpg"]:
            file_part = tmp_path / f"sample_survey{ext}"
            if file_part.exists():
                zf.write(file_part, arcname=file_part.name)

print("Sample data successfully created in sample_data/")
