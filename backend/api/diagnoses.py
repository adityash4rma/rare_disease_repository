"""
Diagnosis API routes - Link patients to diseases.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.diagnosis import Diagnosis
from backend.models.disease import Disease
from backend.models.patient import Patient
from backend.models.user import User
from backend.schemas.diagnosis import (
    DiagnosisCreate, DiagnosisListResponse, DiagnosisResponse, DiagnosisUpdate,
)
from backend.services.audit_service import create_audit_log

router = APIRouter(prefix="/api/diagnoses", tags=["Diagnoses"])


@router.get("", response_model=DiagnosisListResponse)
async def list_diagnoses(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    patient_id: str = Query(None),
    disease_id: str = Query(None),
    status_filter: str = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List diagnoses with pagination and filters."""
    stmt = select(Diagnosis).options(selectinload(Diagnosis.disease))
    count_stmt = select(func.count(Diagnosis.id))

    if patient_id:
        stmt = stmt.where(Diagnosis.patient_id == patient_id)
        count_stmt = count_stmt.where(Diagnosis.patient_id == patient_id)
    if disease_id:
        stmt = stmt.where(Diagnosis.disease_id == disease_id)
        count_stmt = count_stmt.where(Diagnosis.disease_id == disease_id)
    if status_filter:
        stmt = stmt.where(Diagnosis.status == status_filter)
        count_stmt = count_stmt.where(Diagnosis.status == status_filter)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(Diagnosis.created_at.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    diagnoses = result.scalars().all()

    items = [
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
        for d in diagnoses
    ]

    return DiagnosisListResponse(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=DiagnosisResponse, status_code=status.HTTP_201_CREATED)
async def create_diagnosis(
    data: DiagnosisCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new diagnosis linking a patient to a disease."""
    # Verify patient exists
    patient = await db.execute(select(Patient).where(Patient.id == data.patient_id))
    if not patient.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Patient not found")

    # Verify disease exists
    disease_result = await db.execute(select(Disease).where(Disease.id == data.disease_id))
    disease = disease_result.scalar_one_or_none()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    diagnosis = Diagnosis(**data.model_dump())
    db.add(diagnosis)
    await db.flush()

    await create_audit_log(db, current_user.id, "create", "diagnosis", diagnosis.id)

    return DiagnosisResponse(
        id=diagnosis.id,
        patient_id=diagnosis.patient_id,
        disease_id=diagnosis.disease_id,
        diagnosed_date=diagnosis.diagnosed_date,
        status=diagnosis.status.value,
        genetic_variant=diagnosis.genetic_variant,
        genetic_test_type=diagnosis.genetic_test_type,
        notes=diagnosis.notes,
        created_at=diagnosis.created_at,
        disease_name=disease.name,
    )


@router.put("/{diagnosis_id}", response_model=DiagnosisResponse)
async def update_diagnosis(
    diagnosis_id: str,
    data: DiagnosisUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a diagnosis."""
    stmt = select(Diagnosis).options(selectinload(Diagnosis.disease)).where(Diagnosis.id == diagnosis_id)
    result = await db.execute(stmt)
    diagnosis = result.scalar_one_or_none()

    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(diagnosis, field, value)

    await db.flush()
    await create_audit_log(db, current_user.id, "update", "diagnosis", diagnosis_id, details=update_data)

    return DiagnosisResponse(
        id=diagnosis.id,
        patient_id=diagnosis.patient_id,
        disease_id=diagnosis.disease_id,
        diagnosed_date=diagnosis.diagnosed_date,
        status=diagnosis.status.value,
        genetic_variant=diagnosis.genetic_variant,
        genetic_test_type=diagnosis.genetic_test_type,
        notes=diagnosis.notes,
        created_at=diagnosis.created_at,
        disease_name=diagnosis.disease.name if diagnosis.disease else None,
    )


@router.delete("/{diagnosis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diagnosis(
    diagnosis_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a diagnosis."""
    result = await db.execute(select(Diagnosis).where(Diagnosis.id == diagnosis_id))
    diagnosis = result.scalar_one_or_none()

    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis not found")

    await create_audit_log(db, current_user.id, "delete", "diagnosis", diagnosis_id)
    await db.delete(diagnosis)
