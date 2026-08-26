"""
Patient API routes - CRUD and search for patient records.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.patient import Patient
from backend.models.diagnosis import Diagnosis
from backend.models.disease import Disease
from backend.models.hospital import Hospital
from backend.models.user import User
from backend.schemas.patient import (
    PatientCreate, PatientDetailResponse, PatientListResponse,
    PatientResponse, PatientUpdate,
)
from backend.schemas.diagnosis import DiagnosisResponse
from backend.services.audit_service import create_audit_log

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.get("", response_model=PatientListResponse)
async def list_patients(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    sex: str = Query(None),
    hospital_id: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List patients with pagination and search."""
    stmt = select(Patient)
    count_stmt = select(func.count(Patient.id))

    if search:
        search_filter = or_(
            Patient.first_name.ilike(f"%{search}%"),
            Patient.last_name.ilike(f"%{search}%"),
            Patient.mrn.ilike(f"%{search}%"),
        )
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    if sex:
        stmt = stmt.where(Patient.sex == sex)
        count_stmt = count_stmt.where(Patient.sex == sex)

    if hospital_id:
        stmt = stmt.where(Patient.hospital_id == hospital_id)
        count_stmt = count_stmt.where(Patient.hospital_id == hospital_id)

    total = (await db.execute(count_stmt)).scalar() or 0

    stmt = stmt.order_by(Patient.created_at.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    patients = result.scalars().all()

    return PatientListResponse(
        items=[PatientResponse.model_validate(p) for p in patients],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{patient_id}", response_model=PatientDetailResponse)
async def get_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single patient with their diagnoses."""
    stmt = (
        select(Patient)
        .options(selectinload(Patient.diagnoses).selectinload(Diagnosis.disease))
        .where(Patient.id == patient_id)
    )
    result = await db.execute(stmt)
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Get hospital name
    hospital_name = None
    if patient.hospital_id:
        h_result = await db.execute(select(Hospital.name).where(Hospital.id == patient.hospital_id))
        hospital_name = h_result.scalar_one_or_none()

    await create_audit_log(db, current_user.id, "view", "patient", patient_id)

    diagnoses = [
        DiagnosisResponse(
            id=d.id,
            patient_id=d.patient_id,
            disease_id=d.disease_id,
            diagnosed_date=d.diagnosed_date,
            status=d.status.value,
            genetic_variant=d.genetic_variant,
            genetic_test_type=d.genetic_test_type,
            notes=d.notes,
            created_at=d.created_at,
            disease_name=d.disease.name if d.disease else None,
        )
        for d in patient.diagnoses
    ]

    return PatientDetailResponse(
        **PatientResponse.model_validate(patient).model_dump(),
        diagnoses=diagnoses,
        hospital_name=hospital_name,
    )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    data: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new patient record."""
    # Check MRN uniqueness
    existing = await db.execute(select(Patient).where(Patient.mrn == data.mrn))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="MRN already exists")

    patient = Patient(**data.model_dump())
    db.add(patient)
    await db.flush()

    await create_audit_log(db, current_user.id, "create", "patient", patient.id)

    return PatientResponse.model_validate(patient)


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: str,
    data: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing patient record."""
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    await db.flush()
    await create_audit_log(db, current_user.id, "update", "patient", patient_id, details=update_data)

    return PatientResponse.model_validate(patient)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a patient record."""
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    await create_audit_log(db, current_user.id, "delete", "patient", patient_id)
    await db.delete(patient)
