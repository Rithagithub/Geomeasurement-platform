from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import api_router
from app.exceptions.handlers import register_exception_handlers
from app.db.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for application startup and shutdown events."""
    # Create DB tables if using local development database
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        # PostgreSQL might not be running locally if tests are running or during build
        pass
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-quality Geospatial File Measurement API for processing KML and Shapefile ZIP archives, "
        "reprojecting CRS to UTM, and calculating geometric measurements (Polygon Area, LineString Length)."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for frontend/API clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers
register_exception_handlers(app)

# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["health"])
def root():
    """Root endpoint verifying API availability."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }


@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint for Docker containers and orchestration."""
    return {"status": "UP"}
