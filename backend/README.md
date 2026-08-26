# Rare Disease Repository — Backend API

A production-ready **FastAPI** backend powering the Rare Disease Repository platform. Provides RESTful endpoints for patient management, disease cataloging, FHIR R4 interoperability, hospital federation, data contributions, analytics, and blockchain-style audit logging.

---

## Tech Stack

| Component       | Technology                         |
| --------------- | ---------------------------------- |
| Framework       | FastAPI 0.141+                     |
| Language        | Python 3.14                        |
| ORM             | SQLAlchemy 2.0 (async)             |
| Database        | SQLite (dev) / PostgreSQL (prod)   |
| Authentication  | JWT (python-jose) + bcrypt         |
| Validation      | Pydantic v2                        |
| Config          | pydantic-settings (env / .env)     |
| Server          | Uvicorn (ASGI)                     |

---

## Quick Start

```bash
# From the project root
cd d:\Projects\rare_disease_repository

# Activate the virtual environment
.\backend\venv\Scripts\activate        # Windows
# source backend/venv/bin/activate     # Linux/macOS

# (Optional) Seed the database with sample data
python -m backend.seed_data

# Start the dev server
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health check:** `GET /` or `GET /api/health`

### Default Login Credentials (after seeding)

| Role       | Email                       | Password      |
| ---------- | --------------------------- | ------------- |
| Admin      | `admin@raredisease.org`     | `admin123`    |
| Researcher | `sarah.chen@nih.gov`        | `password123` |
| Clinician  | `e.watson@gosh.nhs.uk`     | `password123` |

---

## Project Structure

```
backend/
├── __init__.py              # Package marker
├── main.py                  # FastAPI app, CORS, lifespan, router mounting
├── config.py                # Pydantic Settings (DATABASE_URL, JWT_SECRET, CORS, etc.)
├── database.py              # SQLAlchemy async engine, session factory, Base, init_db()
├── seed_data.py             # DB seeder — 8 hospitals, 15 diseases, 75 patients, etc.
├── requirements.txt         # Python dependencies
│
├── auth/                    # Authentication & Authorization
│   ├── __init__.py
│   ├── security.py          # bcrypt password hashing (hash_password, verify_password)
│   ├── jwt.py               # JWT token creation & validation (python-jose)
│   └── dependencies.py      # FastAPI Depends: get_current_user, require_role()
│
├── models/                  # SQLAlchemy ORM Models
│   ├── __init__.py          # Re-exports all models + enums
│   ├── user.py              # User (roles: admin, researcher, clinician)
│   ├── patient.py           # Patient demographics, hospital linkage
│   ├── disease.py           # Disease catalog (ORPHA/ICD-10 codes, symptoms, genes)
│   ├── diagnosis.py         # Patient ↔ Disease junction (status, genetic variant)
│   ├── hospital.py          # Hospital registry (data-sharing status)
│   ├── contribution.py      # Data contribution tracking (submit → review → approve)
│   ├── audit_log.py         # Audit trail with blockchain-style tx_hash
│   └── fhir_resource.py     # Cached FHIR R4 resource payloads
│
├── schemas/                 # Pydantic Request/Response DTOs
│   ├── __init__.py
│   ├── user.py              # UserRegister, UserLogin, TokenResponse, UserResponse
│   ├── patient.py           # PatientCreate/Update/Response/DetailResponse/ListResponse
│   ├── disease.py           # DiseaseCreate/Update/Response/ListResponse
│   ├── diagnosis.py         # DiagnosisCreate/Update/Response/ListResponse
│   ├── hospital.py          # HospitalCreate/Update/Response/ListResponse
│   ├── contribution.py      # ContributionCreate/Review/Response/ListResponse
│   ├── fhir.py              # FHIRResourceCreate/Response/ListResponse/TypeSummary
│   ├── audit.py             # AuditLogResponse/ListResponse
│   └── analytics.py         # DashboardStats, DiseaseDistribution, Demographics, etc.
│
├── api/                     # API Route Modules (FastAPI Routers)
│   ├── __init__.py
│   ├── auth.py              # POST /register, /login; GET /me
│   ├── patients.py          # CRUD + search/filter/pagination
│   ├── diseases.py          # CRUD + search + patient counts
│   ├── diagnoses.py         # CRUD with disease name enrichment
│   ├── hospitals.py         # CRUD + patient/user counts
│   ├── contributions.py     # Submit + admin review/approve workflow
│   ├── fhir.py              # FHIR resource CRUD + auto-generation from patient data
│   ├── analytics.py         # Dashboard stats, charts data, demographic breakdowns
│   ├── audit.py             # Paginated audit trail with filter helpers
│   └── users.py             # User profile + admin management
│
├── services/                # Business Logic Layer
│   ├── __init__.py
│   ├── analytics_service.py # SQL aggregation queries for dashboard & charts
│   ├── fhir_service.py      # FHIR R4 resource generation (Patient, Condition, Observation)
│   └── audit_service.py     # Audit log creation with SHA-256 tx_hash
│
└── venv/                    # Python 3.14 virtual environment (gitignored)
```

---

## API Endpoints Reference

### Health

| Method | Endpoint        | Auth   | Description          |
| ------ | --------------- | ------ | -------------------- |
| GET    | `/`             | Public | Basic health check   |
| GET    | `/api/health`   | Public | Detailed health info |

### Auth (`/api/auth`)

| Method | Endpoint             | Auth   | Description                |
| ------ | -------------------- | ------ | -------------------------- |
| POST   | `/api/auth/register` | Public | Create account & get token |
| POST   | `/api/auth/login`    | Public | Authenticate & get token   |
| GET    | `/api/auth/me`       | Bearer | Get current user profile   |

### Patients (`/api/patients`)

| Method | Endpoint                 | Auth   | Description                  |
| ------ | ------------------------ | ------ | ---------------------------- |
| GET    | `/api/patients`          | Bearer | List patients (search, filter, paginate) |
| POST   | `/api/patients`          | Bearer | Create a patient             |
| GET    | `/api/patients/{id}`     | Bearer | Get patient detail + diagnoses |
| PUT    | `/api/patients/{id}`     | Bearer | Update patient               |
| DELETE | `/api/patients/{id}`     | Bearer | Delete patient               |

### Diseases (`/api/diseases`)

| Method | Endpoint                 | Auth   | Description                  |
| ------ | ------------------------ | ------ | ---------------------------- |
| GET    | `/api/diseases`          | Bearer | List diseases (search, filter) |
| POST   | `/api/diseases`          | Bearer | Create a disease entry       |
| GET    | `/api/diseases/{id}`     | Bearer | Get disease detail           |
| PUT    | `/api/diseases/{id}`     | Bearer | Update disease               |
| DELETE | `/api/diseases/{id}`     | Bearer | Delete disease               |

### Diagnoses (`/api/diagnoses`)

| Method | Endpoint                  | Auth   | Description                  |
| ------ | ------------------------- | ------ | ---------------------------- |
| GET    | `/api/diagnoses`          | Bearer | List diagnoses (filter by patient/disease/status) |
| POST   | `/api/diagnoses`          | Bearer | Create diagnosis             |
| PUT    | `/api/diagnoses/{id}`     | Bearer | Update diagnosis             |
| DELETE | `/api/diagnoses/{id}`     | Bearer | Delete diagnosis             |

### Hospitals (`/api/hospitals`)

| Method | Endpoint                  | Auth   | Description                  |
| ------ | ------------------------- | ------ | ---------------------------- |
| GET    | `/api/hospitals`          | Bearer | List hospitals (search, status filter) |
| POST   | `/api/hospitals`          | Bearer | Create hospital              |
| GET    | `/api/hospitals/{id}`     | Bearer | Get hospital detail          |
| PUT    | `/api/hospitals/{id}`     | Bearer | Update hospital              |
| DELETE | `/api/hospitals/{id}`     | Bearer | Delete hospital              |

### Contributions (`/api/contributions`)

| Method | Endpoint                                | Auth        | Description                  |
| ------ | --------------------------------------- | ----------- | ---------------------------- |
| GET    | `/api/contributions`                    | Bearer      | List contributions           |
| POST   | `/api/contributions`                    | Bearer      | Submit a contribution        |
| PUT    | `/api/contributions/{id}/review`        | Admin only  | Approve or reject            |

### FHIR Resources (`/api/fhir`)

| Method | Endpoint                            | Auth   | Description                      |
| ------ | ----------------------------------- | ------ | -------------------------------- |
| GET    | `/api/fhir/resources`               | Bearer | List FHIR resources (type, patient filter) |
| GET    | `/api/fhir/resources/summary`       | Bearer | Resource counts by type          |
| GET    | `/api/fhir/resources/{id}`          | Bearer | Get a single FHIR resource       |
| POST   | `/api/fhir/resources`               | Bearer | Create a FHIR resource           |
| POST   | `/api/fhir/generate/{patient_id}`   | Bearer | Auto-generate Patient + Conditions |

### Analytics (`/api/analytics`)

| Method | Endpoint                              | Auth   | Description                      |
| ------ | ------------------------------------- | ------ | -------------------------------- |
| GET    | `/api/analytics/dashboard`            | Bearer | Aggregate dashboard stats        |
| GET    | `/api/analytics/diseases`             | Bearer | Disease distribution (top N)     |
| GET    | `/api/analytics/demographics/sex`     | Bearer | Patient sex breakdown            |
| GET    | `/api/analytics/demographics/ethnicity` | Bearer | Patient ethnicity breakdown    |
| GET    | `/api/analytics/contributions/monthly`| Bearer | Monthly contribution trends      |
| GET    | `/api/analytics/geographic`           | Bearer | Geographic distribution          |
| GET    | `/api/analytics/hospitals`            | Bearer | Per-hospital contribution summary|
| GET    | `/api/analytics/all`                  | Bearer | All analytics in one response    |

### Audit Trail (`/api/audit`)

| Method | Endpoint                     | Auth   | Description                      |
| ------ | ---------------------------- | ------ | -------------------------------- |
| GET    | `/api/audit`                 | Bearer | Paginated audit logs (filter by action, resource, user) |
| GET    | `/api/audit/actions`         | Bearer | Distinct action types            |
| GET    | `/api/audit/resource-types`  | Bearer | Distinct resource types          |

### Users (`/api/users`)

| Method | Endpoint              | Auth   | Description                      |
| ------ | --------------------- | ------ | -------------------------------- |
| GET    | `/api/users`          | Bearer | List users (search, role filter) |
| GET    | `/api/users/{id}`     | Bearer | Get user profile                 |
| PUT    | `/api/users/{id}`     | Bearer | Update profile (admins can edit any user) |

---

## Environment Variables

| Variable                         | Default                              | Description                    |
| -------------------------------- | ------------------------------------ | ------------------------------ |
| `APP_NAME`                       | `Rare Disease Repository API`        | Application display name       |
| `APP_VERSION`                    | `1.0.0`                              | Semantic version               |
| `DEBUG`                          | `True`                               | Enable debug logging           |
| `DATABASE_URL`                   | `sqlite+aiosqlite:///./rare_disease.db` | Async DB URL (SQLite or PostgreSQL) |
| `JWT_SECRET_KEY`                 | *(dev default)*                      | **Change in production!**      |
| `JWT_ALGORITHM`                  | `HS256`                              | JWT signing algorithm          |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`| `1440`                               | Token TTL (24 hours)           |
| `CORS_ORIGINS`                   | `http://localhost:3000,...`           | Comma-separated allowed origins|

Copy `.env.example` → `.env` and customize.

---

## Seed Data Summary

Running `python -m backend.seed_data` populates the database with:

| Entity        | Count | Details                                                 |
| ------------- | ----- | ------------------------------------------------------- |
| Hospitals     | 8     | GOSH, NIH, Necker, Charité, Bambino Gesù, TMU, AIIMS, RCH |
| Users         | 7     | 1 admin, 3 researchers, 3 clinicians                    |
| Diseases      | 15    | Cystic Fibrosis, Huntington, DMD, Gaucher, Marfan, PKU, EDS, SCD, Rett, Wilson, Pompe, Fabry, TSC, SMA, HAE |
| Patients      | 75    | Random demographics across 12 cities / 10 countries     |
| Diagnoses     | ~114  | 1-3 per patient with genetic variants                   |
| Contributions | 40    | Mixed statuses (pending/approved/rejected/processing)   |
| FHIR Resources| 50    | 20 Patient + 30 Condition resources                     |
| Audit Logs    | 60    | Simulated access/change events with SHA-256 tx hashes   |

---

## Changelog

All files below were **created new** on **2026-08-26** as part of the initial backend build.

### Core

| Status  | File                                     | Description                                               |
| ------- | ---------------------------------------- | --------------------------------------------------------- |
| **NEW** | `backend/__init__.py`                    | Package marker                                            |
| **NEW** | `backend/main.py`                        | FastAPI app — CORS, lifespan, all 10 routers mounted      |
| **NEW** | `backend/config.py`                      | Pydantic Settings with env-var-based configuration        |
| **NEW** | `backend/database.py`                    | Async SQLAlchemy engine, session factory, `init_db()`     |
| **NEW** | `backend/seed_data.py`                   | Database seeder with realistic rare disease data          |
| **NEW** | `backend/requirements.txt`               | Python dependencies (FastAPI, SQLAlchemy, JWT, bcrypt…)   |

### Auth (`backend/auth/`)

| Status  | File                                     | Description                                               |
| ------- | ---------------------------------------- | --------------------------------------------------------- |
| **NEW** | `auth/__init__.py`                       | Package marker                                            |
| **NEW** | `auth/security.py`                       | Password hashing via bcrypt (direct, not passlib)         |
| **NEW** | `auth/jwt.py`                            | JWT token creation & validation (python-jose)             |
| **NEW** | `auth/dependencies.py`                   | `get_current_user`, `get_optional_user`, `require_role()` |

### Models (`backend/models/`)

| Status  | File                                     | Description                                               |
| ------- | ---------------------------------------- | --------------------------------------------------------- |
| **NEW** | `models/__init__.py`                     | Re-exports all models & enums for Alembic discovery       |
| **NEW** | `models/user.py`                         | `User` — email, password, role (admin/researcher/clinician), hospital FK |
| **NEW** | `models/patient.py`                      | `Patient` — MRN, demographics, hospital FK, relationships |
| **NEW** | `models/disease.py`                      | `Disease` — name, ORPHA code, ICD-10, symptoms (JSON), genes (JSON) |
| **NEW** | `models/diagnosis.py`                    | `Diagnosis` — patient↔disease link, status, genetic variant |
| **NEW** | `models/hospital.py`                     | `Hospital` — code, location, data-sharing status          |
| **NEW** | `models/contribution.py`                 | `Contribution` — hospital, record type/count, review status |
| **NEW** | `models/audit_log.py`                    | `AuditLog` — action, resource, details (JSON), tx_hash   |
| **NEW** | `models/fhir_resource.py`                | `FHIRResource` — resource_type, payload (JSON), version   |

### Schemas (`backend/schemas/`)

| Status  | File                                     | Description                                               |
| ------- | ---------------------------------------- | --------------------------------------------------------- |
| **NEW** | `schemas/__init__.py`                    | Package marker                                            |
| **NEW** | `schemas/user.py`                        | `UserRegister`, `UserLogin`, `TokenResponse`, `UserResponse`, `UserUpdate`, `UserListResponse` |
| **NEW** | `schemas/patient.py`                     | `PatientCreate`, `PatientUpdate`, `PatientResponse`, `PatientDetailResponse`, `PatientListResponse` |
| **NEW** | `schemas/disease.py`                     | `DiseaseCreate`, `DiseaseUpdate`, `DiseaseResponse`, `DiseaseListResponse` |
| **NEW** | `schemas/diagnosis.py`                   | `DiagnosisCreate`, `DiagnosisUpdate`, `DiagnosisResponse`, `DiagnosisListResponse` |
| **NEW** | `schemas/hospital.py`                    | `HospitalCreate`, `HospitalUpdate`, `HospitalResponse`, `HospitalListResponse` |
| **NEW** | `schemas/contribution.py`                | `ContributionCreate`, `ContributionReview`, `ContributionResponse`, `ContributionListResponse` |
| **NEW** | `schemas/fhir.py`                        | `FHIRResourceCreate`, `FHIRResourceResponse`, `FHIRResourceListResponse`, `FHIRResourceTypeSummary` |
| **NEW** | `schemas/audit.py`                       | `AuditLogResponse`, `AuditLogListResponse`                |
| **NEW** | `schemas/analytics.py`                   | `DashboardStats`, `DiseaseDistribution`, `DemographicBreakdown`, `MonthlyContribution`, `GeographicDistribution`, `HospitalContributionSummary`, `AnalyticsResponse` |

### API Routes (`backend/api/`)

| Status  | File                                     | Description                                               |
| ------- | ---------------------------------------- | --------------------------------------------------------- |
| **NEW** | `api/__init__.py`                        | Package marker                                            |
| **NEW** | `api/auth.py`                            | `POST /register`, `POST /login`, `GET /me`                |
| **NEW** | `api/patients.py`                        | Full CRUD + search/filter/pagination for patients         |
| **NEW** | `api/diseases.py`                        | Full CRUD + search + patient-count enrichment             |
| **NEW** | `api/diagnoses.py`                       | CRUD with disease-name enrichment                         |
| **NEW** | `api/hospitals.py`                       | Full CRUD + patient/user count enrichment                 |
| **NEW** | `api/contributions.py`                   | Submit + admin-only review/approve workflow                |
| **NEW** | `api/fhir.py`                            | FHIR CRUD + `POST /generate/{patient_id}` auto-generation|
| **NEW** | `api/analytics.py`                       | Dashboard stats, disease/demographic/geographic/monthly charts |
| **NEW** | `api/audit.py`                           | Paginated audit trail + filter helpers                    |
| **NEW** | `api/users.py`                           | User list, profile, admin update controls                 |

### Services (`backend/services/`)

| Status  | File                                     | Description                                               |
| ------- | ---------------------------------------- | --------------------------------------------------------- |
| **NEW** | `services/__init__.py`                   | Package marker                                            |
| **NEW** | `services/analytics_service.py`          | SQL aggregation queries for dashboard stats, distributions, trends |
| **NEW** | `services/fhir_service.py`               | FHIR R4 resource generators (Patient, Condition, Observation) |
| **NEW** | `services/audit_service.py`              | Audit log creation with SHA-256 blockchain-style tx_hash  |

### Root-level changes

| Status      | File                 | Description                                               |
| ----------- | -------------------- | --------------------------------------------------------- |
| **MODIFIED** | `requirements.txt`  | Updated from placeholder comment to full backend dependencies |
| **MODIFIED** | `.env.example`      | Added all environment variables (DB, JWT, CORS, etc.)     |

---

**Total: 42 files created, 2 files modified.**
