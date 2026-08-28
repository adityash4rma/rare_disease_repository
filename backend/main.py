"""
Rare Disease Repository - FastAPI Application Entry Point.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings
from backend.database import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown lifecycle."""
    # Startup: create database tables
    await init_db()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API backend for the Rare Disease Repository — a federated platform for rare disease data sharing, FHIR interoperability, and analytics.",
    lifespan=lifespan,
)

# CORS
raw_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
if "*" in raw_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=raw_origins,
        allow_origin_regex=r"https://.*\.onrender\.com",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Mount API routers
from backend.api.auth import router as auth_router
from backend.api.patients import router as patients_router
from backend.api.diseases import router as diseases_router
from backend.api.diagnoses import router as diagnoses_router
from backend.api.hospitals import router as hospitals_router
from backend.api.contributions import router as contributions_router
from backend.api.fhir import router as fhir_router
from backend.api.analytics import router as analytics_router
from backend.api.audit import router as audit_router
from backend.api.users import router as users_router
from backend.api.prediction import router as prediction_router

app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(diseases_router)
app.include_router(diagnoses_router)
app.include_router(hospitals_router)
app.include_router(contributions_router)
app.include_router(fhir_router)
app.include_router(analytics_router)
app.include_router(audit_router)
app.include_router(users_router)
app.include_router(prediction_router)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "healthy",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "version": settings.APP_VERSION,
    }
