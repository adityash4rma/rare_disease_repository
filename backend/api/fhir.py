"""
FHIR API routes - FHIR R4 resource management.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.fhir_resource import FHIRResource
from backend.models.patient import Patient
from backend.models.diagnosis import Diagnosis
from backend.models.user import User
from backend.schemas.fhir import (
    FHIRResourceCreate, FHIRResourceListResponse, FHIRResourceResponse,
    FHIRResourceTypeSummary,
)
from backend.services.fhir_service import generate_fhir_patient, generate_fhir_condition
from backend.services.audit_service import create_audit_log

router = APIRouter(prefix="/api/fhir", tags=["FHIR"])


@router.get("/resources", response_model=FHIRResourceListResponse)
async def list_fhir_resources(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    resource_type: str = Query(None),
    patient_id: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List FHIR resources with filtering."""
    stmt = select(FHIRResource)
    count_stmt = select(func.count(FHIRResource.id))

    if resource_type:
        stmt = stmt.where(FHIRResource.resource_type == resource_type)
        count_stmt = count_stmt.where(FHIRResource.resource_type == resource_type)
    if patient_id:
        stmt = stmt.where(FHIRResource.patient_id == patient_id)
        count_stmt = count_stmt.where(FHIRResource.patient_id == patient_id)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(FHIRResource.last_updated.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    resources = result.scalars().all()

    return FHIRResourceListResponse(
        items=[FHIRResourceResponse.model_validate(r) for r in resources],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/resources/summary", response_model=list[FHIRResourceTypeSummary])
async def get_fhir_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get counts of FHIR resources grouped by type."""
    stmt = (
        select(FHIRResource.resource_type, func.count(FHIRResource.id).label("count"))
        .group_by(FHIRResource.resource_type)
        .order_by(func.count(FHIRResource.id).desc())
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [
        FHIRResourceTypeSummary(resource_type=r.resource_type, count=r.count)
        for r in rows
    ]


@router.get("/resources/{resource_id}", response_model=FHIRResourceResponse)
async def get_fhir_resource(
    resource_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single FHIR resource."""
    result = await db.execute(select(FHIRResource).where(FHIRResource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="FHIR Resource not found")

    await create_audit_log(db, current_user.id, "view", "fhir_resource", resource_id)
    return FHIRResourceResponse.model_validate(resource)


@router.post("/resources", response_model=FHIRResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_fhir_resource(
    data: FHIRResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new FHIR resource."""
    resource = FHIRResource(
        resource_type=data.resource_type,
        fhir_id=data.fhir_id,
        patient_id=data.patient_id,
        payload=data.payload,
    )
    db.add(resource)
    await db.flush()

    await create_audit_log(db, current_user.id, "create", "fhir_resource", resource.id)
    return FHIRResourceResponse.model_validate(resource)


@router.post("/generate/{patient_id}", response_model=list[FHIRResourceResponse])
async def generate_fhir_for_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate FHIR R4 resources (Patient + Conditions) from a patient's data."""
    stmt = (
        select(Patient)
        .options(selectinload(Patient.diagnoses).selectinload(Diagnosis.disease))
        .where(Patient.id == patient_id)
    )
    result = await db.execute(stmt)
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    created_resources = []

    # Generate FHIR Patient
    fhir_patient_payload = generate_fhir_patient(patient)
    fhir_patient = FHIRResource(
        resource_type="Patient",
        fhir_id=patient.id,
        patient_id=patient.id,
        payload=fhir_patient_payload,
    )
    db.add(fhir_patient)
    await db.flush()
    created_resources.append(fhir_patient)

    # Generate FHIR Conditions for each diagnosis
    for diagnosis in patient.diagnoses:
        disease_name = diagnosis.disease.name if diagnosis.disease else "Unknown"
        condition_payload = generate_fhir_condition(diagnosis, disease_name)
        fhir_condition = FHIRResource(
            resource_type="Condition",
            fhir_id=diagnosis.id,
            patient_id=patient.id,
            payload=condition_payload,
        )
        db.add(fhir_condition)
        await db.flush()
        created_resources.append(fhir_condition)

    await create_audit_log(
        db, current_user.id, "generate", "fhir_resource", patient_id,
        details={"resources_created": len(created_resources)},
    )

    return [FHIRResourceResponse.model_validate(r) for r in created_resources]
