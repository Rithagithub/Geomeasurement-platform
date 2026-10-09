# GeoMeasure - Frontend

A modern, enterprise-grade React + TypeScript frontend dashboard for the **Geospatial File Measurement API**, built for the **AEREO** engineering assignment.

GeoMeasure provides a clean visual interface for drone survey and GIS intelligence workflows, allowing users to drag-and-drop **KML** files or **ZIP archives containing Shapefiles**, inspect real-time processing statuses, review projected metric measurements (Polygon Area in $m^2$, LineString Length in $m$), explore extracted feature attributes, and export reports to CSV.

---

## 🚀 Technology Stack

- **Framework**: React 18 / 19 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS (Clean white/slate background, navy text, blue accents)
- **HTTP Client**: Axios with centralized error handling & upload progress
- **Icons**: Lucide React

---

## ✨ Features

- **Drag-and-Drop Ingestion**: Upload `.kml` or `.zip` Shapefiles with client-side extension & size validation (max 10MB).
- **Live Health Indicator**: Real-time polling badge showing backend connection status.
- **Summary Metrics**: Instant KPI cards for Total Features, Source CRS, File Type, and Pipeline Status.
- **Measurement Table**: Displays exact metric areas ($m^2$) and lengths ($m$) calculated via UTM projected coordinate systems.
- **Attribute & Geometry Explorer**: Expandable viewer for raw feature properties and WKT geometries.
- **Export to CSV**: Client-side export of returned measurements into formatted CSV files.
- **One-Click Swagger Link**: Direct header link to FastAPI OpenAPI interactive documentation (`/docs`).

---

## 🛠 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx             # App brand, connection badge, Swagger button
│   │   ├── UploadPanel.tsx        # Drag & drop upload zone with client validation
│   │   ├── SummaryCards.tsx       # KPI metrics (Features, CRS, Type, Status)
│   │   ├── MeasurementsTable.tsx  # Area & length measurements table
│   │   ├── FeatureDetails.tsx     # Extracted attributes and WKT geometry viewer
│   │   ├── ResultsActions.tsx     # Action bar (Refresh, Copy ID, Export CSV, Reset)
│   │   ├── LoadingSpinner.tsx     # Reusable loading spinner
│   │   └── ErrorMessage.tsx       # Alert banner for server & network errors
│   ├── services/
│   │   └── api.ts                 # Axios API client & error parsers
│   ├── types/
│   │   └── index.ts               # TypeScript DTOs matching FastAPI schemas
│   ├── utils/
│   │   ├── csv.ts                 # CSV export generator
│   │   └── formatters.ts          # Number, byte size, and date formatters
│   ├── App.tsx                    # Main single-page application workflow
│   ├── main.tsx                   # React root entrypoint
│   └── index.css                  # Tailwind CSS directives
├── public/
├── index.html                     # HTML shell
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 📡 API Integration

The frontend integrates with the FastAPI backend via Axios (`src/services/api.ts`):

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` or `/` | Connection heartbeat indicator |
| `POST` | `/api/files/` | Upload `.kml` or `.zip` (multipart/form-data with `file` field) |
| `GET` | `/api/files/{id}/` | Retrieve full file record & status |
| `GET` | `/api/files/{id}/measurements/` | Retrieve calculated area & length measurements |
| `GET` | `/api/files/{id}/features/` | Retrieve extracted feature attributes & WKT geometries |

---

## 💻 Local Setup & Execution

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env` file (defaults to `http://localhost:8000`):
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

Open your browser at: **`http://localhost:5173`**

### 4. Build for Production
```bash
npm run build
```

---

## 🎯 Verification & Testing

- ✅ **Build Check**: `npm run build` compiles with 0 TypeScript errors.
- ✅ **API Health**: Automatically checks backend connectivity on load and every 20 seconds.
- ✅ **Upload Workflow**: Tested with `sample_polygon.kml` and `sample_shapefile.zip`.
- ✅ **Measurements & CSV**: Verified area/length formatting and one-click CSV export.
