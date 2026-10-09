# Geospatial File Measurement API

A production-quality, interview-explainable FastAPI backend service designed to safely upload, validate, process, and extract spatial measurements from **KML** files and **ZIP archives containing Shapefiles**.

Built for enterprise geospatial analytics workflows, this project handles coordinate reference system (CRS) transformations to projected metric systems (UTM) and performs geometric calculations (Polygon Area in $m^2$, LineString Length in $m$).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Architecture Flow](#architecture-flow)
- [Geospatial & CRS Strategy](#geospatial--crs-strategy)
- [Measurement Calculation](#measurement-calculation)
- [Database Schema](#database-schema)
- [API Documentation & Examples](#api-documentation--examples)
- [Local Setup & Development](#local-setup--development)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Running Migrations](#running-migrations)
- [Running Tests](#running-tests)
- [Sample Data](#sample-data)
- [Design Decisions](#design-decisions)
- [Alternatives Considered](#alternatives-considered)
- [Security & Validation](#security--validation)
- [Limitations & Future Scope](#limitations--future-scope)
- [AEREO Alignment](#aereo-alignment)
- [Interview Preparation Q&A](#interview-preparation-qa)

---

## 🌟 Overview

Enterprise geospatial products (e.g., drone survey platforms, digital twin solutions, GIS portals) frequently receive user vector uploads in unprojected geographic formats such as **KML** (from Google Earth) or **ESRI Shapefiles** (zipped with `.shp`, `.shx`, `.dbf`, `.prj`).

Calculating real-world spatial measurements directly on unprojected geographic coordinates (latitude/longitude degrees in `EPSG:4326`) produces inaccurate results due to the curvature of the Earth and degree-to-meter distortions.

This service provides an automated backend pipeline that:
1. Validates and safely extracts uploaded spatial files.
2. Identifies source CRS and transforms geographic coordinates to optimal **Universal Transverse Mercator (UTM)** projected metric systems.
3. Calculates exact metric spatial dimensions (Area for Polygons, Length for LineStrings).
4. Persists metadata, features, and measurements in a relational PostgreSQL database.
5. Exposes clean REST API endpoints.

---

## 🎯 Problem Statement

Geospatial API backends face several core engineering challenges:
- **File Diversity & Security**: Insecure zip extraction can expose systems to path traversal (Zip Slip). Invalid formats or script files (`.exe`, `.py`) must be rejected.
- **CRS Distortion**: Geographic degree units ($^\circ$) cannot be summed directly for area ($m^2$) or length ($m$) without coordinate projection.
- **Heterogeneous Geometries**: Single files may contain Points, Lines, Polygons, or unsupported collections. Processing must not crash when encountering non-measurable features.

---

## ✨ Key Features

- **Multi-Format Ingestion**: Supports `.kml` XML files and `.zip` Shapefile archives.
- **Safe ZIP Handling**: Built-in Zip Slip path traversal protection and component verification (`.shp`, `.shx`, `.dbf`).
- **Dynamic CRS Projection**: Automatic detection of source CRS and dynamic transformation to local metric UTM zones via GeoPandas/PyProj.
- **Robust Spatial Engine**:
  - **Polygon / MultiPolygon** $\rightarrow$ Area ($m^2$)
  - **LineString / MultiLineString** $\rightarrow$ Length ($m$)
  - **Point / MultiPoint** $\rightarrow$ Graceful pass (no unnecessary measurement)
  - **Unsupported Geometries** $\rightarrow$ Handled without failing the batch request
- **Database Persistence**: Fully typed SQLAlchemy 2.x models stored in PostgreSQL with Alembic database migrations.
- **Dockerized Ready**: Production-ready `Dockerfile` and `docker-compose.yml`.
- **Comprehensive Test Suite**: 100% automated test coverage for upload, validation, CRS reprojection, measurements, and REST APIs using `pytest`.

---

## 🛠 Technology Stack

- **Language**: Python 3.12+
- **Web Framework**: FastAPI (Uvicorn ASGI server)
- **Data Validation**: Pydantic v2 & Pydantic-Settings
- **Geospatial Processing**: GeoPandas, Shapely 2.x, PyProj, Fiona / PyOGRIO
- **Database**: PostgreSQL 16
- **ORM & Migrations**: SQLAlchemy 2.x & Alembic
- **Testing**: Pytest & HTTPX (FastAPI TestClient)
- **Containerization**: Docker & Docker Compose

---

## 📐 Architecture

The application follows a **Clean Modular Monolithic Architecture**, prioritizing separation of concerns, readability, maintainability, and ease of explanation during technical interviews.

```
geospatial-file-measurement-api/
│
├── backend/                     # FastAPI Backend Service
│   ├── app/
│   │   ├── main.py              # FastAPI app & lifespan
│   │   ├── api/routes/          # REST API endpoints
│   │   ├── core/                # Config & logging
│   │   ├── db/models/           # SQLAlchemy 2.x models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # CRS, Measurement, Geospatial services
│   │   ├── utils/               # File validation & Zip Slip protection
│   │   └── exceptions/          # Error handlers
│   ├── tests/                   # Automated Pytest suite (15 tests)
│   ├── alembic/                 # Database migrations
│   ├── sample_data/             # Sample KML and ZIP Shapefiles
│   ├── data/                    # Storage directories
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Backend Dockerfile
│   └── alembic.ini              # Alembic config
│
├── frontend/                    # React + TypeScript + Tailwind Frontend (GeoMeasure)
│   ├── src/
│   │   ├── components/          # Header, UploadPanel, SummaryCards, MeasurementsTable, etc.
│   │   ├── services/            # Axios API client
│   │   ├── types/               # TypeScript interfaces
│   │   └── App.tsx              # Main dashboard workflow
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docker-compose.yml           # Multi-container orchestration
├── .gitignore
└── README.md
```

---

## 🔄 Architecture Flow

```
CLIENT
  |
  | POST /api/files/ (.kml or .zip)
  v
FASTAPI ROUTE HANDLER
  |
  v
FILE VALIDATION ENGINE
  |-- Extension Check (.kml / .zip)
  |-- Size Check (< 10MB)
  |-- Zip Slip & File Header Validation
  v
GEOSPATIAL SERVICE
  |-- Read GeoDataFrame (GeoPandas / Fiona)
  |-- Source CRS Check (e.g. EPSG:4326)
  v
CRS SERVICE
  |-- Is Geographic? -> Estimate local UTM zone (e.g. EPSG:32643)
  |-- Reproject Geometries to Projected Metric CRS
  v
MEASUREMENT SERVICE
  |-- Polygon -> Calculate Area (m²)
  |-- LineString -> Calculate Length (m)
  |-- Point / Unsupported -> Graceful skip
  v
DATABASE PERSISTENCE (SQLAlchemy 2.x)
  |-- Persist File Metadata -> Status: COMPLETED
  |-- Persist Features & Measurements
  v
REST JSON RESPONSE
```

---

## 🗺 Geospatial & CRS Strategy

### 1. Why EPSG:4326 Cannot Be Used Directly
`EPSG:4326` (WGS84) stores coordinates as angular latitude and longitude in decimal degrees ($^\circ$). Because the distance represented by one degree of longitude shrinks from ~111 km at the equator to 0 km at the poles, calculating area or length directly on raw $^\circ$ values produces meaningless numbers.

### 2. Projected CRS Selection (UTM Strategy)
To calculate accurate metric measurements ($m^2$ and $m$), geometries must be transformed to a 2D Cartesian projected coordinate system.

The application uses GeoPandas' `gdf.estimate_utm_crs()`, which:
1. Calculates the geographic centroid (longitude/latitude center) of the geometry dataset.
2. Determines the appropriate **UTM (Universal Transverse Mercator) zone** (e.g. `EPSG:32643` for North India/Bangalore).
3. Reprojects all geometries into metric coordinates before passing them to the measurement engine.

---

## 📏 Measurement Calculation

| Geometry Type | Measurement Type | Unit | Calculation Method |
|---|---|---|---|
| **Polygon / MultiPolygon** | `area` | `m²` | `geometry.area` on reprojected UTM geometry |
| **LineString / MultiLineString** | `length` | `m` | `geometry.length` on reprojected UTM geometry |
| **Point / MultiPoint** | *None* | *N/A* | Skipped (Point represents zero-dimensional location) |
| **GeometryCollection / Unknown** | *None* | *N/A* | Skipped gracefully with warning log |

---

## 🗄 Database Schema

The relational schema uses PostgreSQL with 3 normalized tables:

```
+---------------------------------------+
|                 files                 |
+---------------------------------------+
| id (PK, String 36)                    |
| filename (String 255)                 |
| original_filename (String 255)        |
| file_type (String 50)                 |
| crs (String 100)                      |
| feature_count (Integer)               |
| status (String 20: COMPLETED/FAILED)  |
| error_message (Text)                  |
| created_at (DateTime TZ)              |
| updated_at (DateTime TZ)              |
+---------------------------------------+
                   | 1
                   |
                   | N
+---------------------------------------+
|               features                |
+---------------------------------------+
| id (PK, String 36)                    |
| file_id (FK -> files.id, Index)       |
| feature_index (Integer)               |
| geometry_type (String 50)             |
| geometry (Text - WKT)                 |
| properties (JSON)                     |
| source_crs (String 100)               |
+---------------------------------------+
                   | 1
                   |
                   | N
+---------------------------------------+
|             measurements              |
+---------------------------------------+
| id (PK, String 36)                    |
| feature_id (FK -> features.id, Index) |
| measurement_type (String 50)          |
| measurement_value (Float)             |
| unit (String 20: m² / m)              |
+---------------------------------------+
```

---

## 🚀 API Documentation & Examples

### 1. Upload & Process File
**`POST /api/files/`**

Uploads a `.kml` file or `.zip` Shapefile archive for validation and immediate spatial processing.

#### Request (Multipart Form Data):
```bash
curl -X POST "http://localhost:8000/api/files/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample_data/sample_polygon.kml"
```

#### Response (201 Created):
```json
{
  "id": "e865f3a1-12bf-4888-b21a-6d43ef199411",
  "filename": "sample_polygon.kml",
  "status": "COMPLETED",
  "feature_count": 1,
  "crs": "EPSG:4326 (Assumed Default)"
}
```

---

### 2. Get File Information
**`GET /api/files/{id}/`**

Retrieves metadata, status, feature count, and timestamps for a uploaded file.

#### Request:
```bash
curl -X GET "http://localhost:8000/api/files/e865f3a1-12bf-4888-b21a-6d43ef199411/"
```

#### Response (200 OK):
```json
{
  "id": "e865f3a1-12bf-4888-b21a-6d43ef199411",
  "filename": "e865f3a1-12bf-4888-b21a-6d43ef199411_sample_polygon.kml",
  "original_filename": "sample_polygon.kml",
  "file_type": "kml",
  "status": "COMPLETED",
  "feature_count": 1,
  "crs": "EPSG:4326 (Assumed Default)",
  "error_message": null,
  "created_at": "2026-10-08T18:30:00Z",
  "updated_at": "2026-10-08T18:30:01Z"
}
```

---

### 3. Get File Measurements
**`GET /api/files/{id}/measurements/`**

Retrieves area ($m^2$) and length ($m$) measurements for all measurable features in the file.

#### Request:
```bash
curl -X GET "http://localhost:8000/api/files/e865f3a1-12bf-4888-b21a-6d43ef199411/measurements/"
```

#### Response (200 OK):
```json
{
  "file_id": "e865f3a1-12bf-4888-b21a-6d43ef199411",
  "measurements": [
    {
      "feature_index": 0,
      "geometry_type": "Polygon",
      "measurement_type": "area",
      "value": 12154.32,
      "unit": "m²"
    }
  ]
}
```

---

## 💻 Local Setup & Development

### Prerequisites
- Python 3.12+
- PostgreSQL running locally (optional, or use SQLite default for testing)

### Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/geospatial-file-measurement-api.git
   cd geospatial-file-measurement-api
   ```

2. **Set up Backend (FastAPI)**:
   ```bash
   # Create and activate virtual environment in project root
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate

   # Navigate to backend and install requirements
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   python scripts/generate_sample_data.py

   # Start FastAPI server
   uvicorn app.main:app --reload --port 8000
   ```
   - Swagger API Documentation: `http://localhost:8000/docs`

3. **Set up Frontend (React Dashboard)**:
   ```bash
   # In a new terminal window
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```
   - GeoMeasure Dashboard: `http://localhost:5173`

---

## 🐳 Docker Deployment

Run the complete containerized stack (Backend API + PostgreSQL Database) with Docker Compose:

```bash
docker compose up --build -d
```

- **API Server**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432`

To shut down containers and volumes:
```bash
docker compose down -v
```

---

## ☁️ Cloud & Production Deployment Guide

### 1. Deploying Backend (e.g. AWS EC2 / Render / Railway / DigitalOcean)
- **Containerized**: Deploy using the provided `Dockerfile` or push container image to AWS ECR / Docker Hub and run via ECS or Kubernetes.
- **Environment**: Set `DATABASE_URL=postgresql://user:password@db-host:5432/dbname` in your production environment variables.
- **Database Migrations**: Run `alembic upgrade head` upon deployment before starting `uvicorn`.

### 2. Deploying Frontend (e.g. Vercel / Netlify / AWS S3 + CloudFront)
- Set build command: `npm run build`
- Set output directory: `dist`
- Set environment variable: `VITE_API_BASE_URL=https://your-backend-api-domain.com`

---

## 🧪 Running Tests

Run the full automated `pytest` test suite:

```bash
pytest -v
```

Output:
```
tests/test_crs.py::test_geographic_crs_to_utm_transformation PASSED
tests/test_crs.py::test_missing_crs_fallback PASSED
tests/test_crs.py::test_unsupported_geometry_collection_graceful_handling PASSED
tests/test_file_info.py::test_get_file_info_success PASSED
tests/test_file_info.py::test_get_file_info_not_found PASSED
tests/test_measurements.py::test_polygon_area_measurement PASSED
tests/test_measurements.py::test_linestring_length_and_point_handling PASSED
tests/test_measurements.py::test_direct_measurement_service_unit PASSED
tests/test_upload.py::test_upload_valid_kml PASSED
tests/test_upload.py::test_upload_valid_zip_shapefile PASSED
tests/test_validation.py::test_reject_forbidden_extensions PASSED
tests/test_validation.py::test_reject_unsupported_extensions PASSED
tests/test_validation.py::test_reject_corrupted_zip PASSED
tests/test_validation.py::test_zip_slip_protection PASSED
==================== 16 passed in 1.95s ====================
```

---

## 📁 Sample Geospatial Datasets & Sources

### 1. Included Sample Files (Ready to Use)
The repository includes pre-built synthetic sample datasets inside the `backend/sample_data/` directory:
- `backend/sample_data/sample_polygon.kml` — Sample agricultural land boundary for testing Area ($m^2$).
- `backend/sample_data/sample_lines.kml` — Road/transmission line for testing Length ($m$) and Point tower waypoint.
- `backend/sample_data/sample_shapefile.zip` — ESRI Shapefile archive containing `.shp`, `.shx`, `.dbf`, and `.prj` files.

### 2. External Dataset Sources for Testing
Users and interview evaluators can test the API using real-world GIS datasets from:
- **[Natural Earth Data](https://www.naturalearthdata.com/)**: Free public domain vector datasets (roads, land boundaries, rivers) downloadable as Shapefile `.zip`.
- **[Google Earth Web / Pro](https://earth.google.com/web/)**: Draw custom polygon boundaries or paths and export directly as `.kml`.
- **[Kaggle Geospatial Datasets](https://www.kaggle.com/datasets?search=shapefile)**: Search for drone surveys, district maps, and GIS shapefiles.
- **[Geofabrik (OpenStreetMap)](https://download.geofabrik.de/)**: City and regional administrative boundaries as Shapefile `.zip`.
- **[Bhuvan (ISRO)](https://bhuvan.nrsc.gov.in/)**: Indian geospatial vector datasets for agriculture and forestry.

---

## 💡 Design Decisions

1. **Why Modular Monolith instead of Microservices?**
   - For an intern technical assignment, microservices add unnecessary network latency, inter-service communication overhead, and complex local setup. A modular monolith provides clear domain boundaries (`services/`, `db/`, `api/`) while keeping code interview-explainable.

2. **Why GeoPandas over PostGIS for Measurement Calculations?**
   - In-memory calculation with GeoPandas and Shapely allows high-performance vector processing during upload without requiring binary PostGIS extensions in PostgreSQL. Standard WKT geometries stored in relational tables remain portable and lightweight.

3. **Why Synchronous Processing Initially?**
   - For typical survey files (<10MB, <10,000 features), synchronous processing finishes in milliseconds. Introducing Celery/Redis at this stage adds setup friction without clear benefit.

---

## 🔒 Security & Validation

- **Zip Slip Path Traversal Protection**: During ZIP extraction, canonical destination paths are checked to ensure no file writes occur outside the target directory.
- **Extension & Magic Number Validation**: Uploaded files are verified against whitelist (`.kml`, `.zip`) and forbidden extensions (`.exe`, `.py`, `.js`).
- **File Size Limits**: Configurable upload threshold (default 10 MB) prevents memory exhaustion attacks.
- **No Path Leakage**: Internal filesystem file paths are never exposed to API clients.

---

## 🔮 Production Future Scope

If scaled for production enterprise drone & GIS analytics:
- **Asynchronous Processing**: Offload large file processing (>100MB orthomosaics/shapefiles) to background workers using **Celery + Redis**.
- **Object Storage**: Store uploaded raw files and extracted shapefile artifacts in **AWS S3** or **MinIO** instead of local disk.
- **Spatial Indexing & PostGIS**: Enable PostGIS column types (`GEOMETRY`) with `SP-GiST` spatial indexes for fast spatial bounding box queries.
- **Large Dataset Streaming**: Stream GeoJSON / Vector Tiles (MVT) for 2D/3D visualization engines.

---

## 🛸 AEREO Alignment

This project aligns directly with AEREO's core focus on enterprise geospatial intelligence, drone data analytics, 2D/3D visual inspection, and digital twins:
- **Spatial Data Ingestion**: Demonstrates backend processing of vector formats common in drone mapping workflows (KML boundaries, Shapefiles).
- **Coordinate Reference Systems**: Demonstrates fundamental domain knowledge in geographic vs. projected coordinate transformations.
- **Reliable Backend APIs**: Demonstrates clean Python 3.12, FastAPI, Pydantic, SQLAlchemy 2.x, PostgreSQL, and Docker containerization.

---

## 🎙 Interview Preparation Q&A

Here are concise, interview-tested answers to 25 technical questions:

### 1. Why FastAPI?
FastAPI offers high performance (built on Starlette & Pydantic), automatic OpenAPI/Swagger documentation, native async support, and static type hinting with minimal boilerplate.

### 2. Why GeoPandas?
GeoPandas extends Pandas data structures to support spatial operations on geometric types using Shapely, PyProj, and Fiona, making vector data manipulation intuitive.

### 3. What is Shapely?
Shapely is a Python library for set-theoretic analysis and manipulation of planar features using GEOS C/C++ engine under the hood.

### 4. What is a Coordinate Reference System (CRS)?
A CRS defines how 2D/3D coordinates map to actual locations on the Earth's surface.

### 5. What is EPSG:4326?
EPSG:4326 is the WGS84 geographic coordinate system used by GPS and KML, expressed in decimal degrees (latitude/longitude).

### 6. Why can't we calculate area directly from EPSG:4326?
Because degrees are angular units, not linear metric distance. 1 degree of longitude varies in distance from ~111 km at the equator to 0 at the poles.

### 7. What is a projected CRS?
A projected CRS maps the 3D spherical Earth onto a 2D flat plane using Cartesian coordinates (meters/feet), allowing accurate linear and area measurements.

### 8. How do you automatically choose the projected CRS?
We calculate the dataset's geographic centroid and estimate the local **UTM (Universal Transverse Mercator) zone** using GeoPandas' `estimate_utm_crs()`.

### 9. How does KML processing work?
KML is XML-based. We use Fiona's KML driver with GeoPandas to parse `<Placemark>` nodes into Shapely geometries and attribute dictionaries.

### 10. How does Shapefile processing work?
An ESRI Shapefile consists of `.shp` (geometries), `.shx` (index), `.dbf` (attributes), and `.prj` (CRS). We extract the ZIP, locate the `.shp`, and load it with GeoPandas.

### 11. Why is Shapefile distributed as a ZIP archive?
Because a Shapefile is not a single file; it requires multiple sidecar files (`.shp`, `.shx`, `.dbf`, `.prj`) to function properly.

### 12. How do you prevent malicious ZIP extraction?
By checking that `(target_dir / member.filename).resolve()` starts with `target_dir.resolve()`, preventing Zip Slip directory traversal attacks.

### 13. How do you handle unsupported geometries?
We log warnings and skip measurements for unsupported geometries (e.g., GeometryCollection), allowing valid features in the file to process without crashing the request.

### 14. Why PostgreSQL?
PostgreSQL is an enterprise-grade ACID-compliant relational database with strong ecosystem support for spatial data (PostGIS).

### 15. Why SQLAlchemy 2.x?
SQLAlchemy 2.x provides modern, type-safe Pythonic ORM mappings, clean session management, and seamless integration with Alembic migrations.

### 16. Why Docker?
Docker encapsulates system-level C/C++ dependencies (GDAL, GEOS, PROJ) ensuring consistent runtime environments across local development and production deployments.

### 17. What happens if file processing fails?
The transaction rolls back, and the `FileModel` record status is marked as `FAILED` with the detailed error message stored for client inspection.

### 18. How would you process very large files?
By streaming features in chunks using Fiona iterators, or distributing vector partitioning across workers.

### 19. How would you make processing asynchronous?
By accepting the upload, returning a `202 Accepted` status with job ID, and processing the file in a background worker via Celery + Redis.

### 20. How would you scale this system?
By containerizing with Kubernetes (EKS/GKE), using S3 for shared file storage, adding Redis caching for read queries, and autoscaling API pods.

### 21. How would you add authentication?
By implementing OAuth2 JWT bearer token authentication middleware in FastAPI.

### 22. How would you store files in cloud storage?
By uploading raw files directly to AWS S3 using `boto3` and generating presigned URLs for client retrieval.

### 23. How would you add Redis/Celery later?
Create a Celery task `process_geospatial_file_task.delay(file_id)`, push task state to Redis, and poll task status via REST API.

### 24. What are current limitations?
Synchronous execution for uploaded files and single-file zip archive extraction limit handling multi-gigabyte rasters/orthomosaics.

### 25. What would you improve in production?
Add PostGIS geometry columns, S3 storage, Celery background queues, Prometheus metrics, and rate-limiting middleware.
