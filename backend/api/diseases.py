"""
Disease API routes - CRUD and search for disease catalog.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.dependencies import get_current_user, get_optional_user
from backend.database import get_db
from backend.models.disease import Disease
from backend.models.diagnosis import Diagnosis
from backend.models.user import User
from backend.schemas.disease import (
    DiseaseCreate, DiseaseListResponse, DiseaseResponse, DiseaseUpdate,
)
from backend.services.audit_service import create_audit_log

router = APIRouter(prefix="/api/diseases", tags=["Diseases"])


@router.get("", response_model=DiseaseListResponse)
async def list_diseases(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    category: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """List diseases with pagination and search."""
    stmt = select(Disease)
    count_stmt = select(func.count(Disease.id))

    if search:
        search_filter = or_(
            Disease.name.ilike(f"%{search}%"),
            Disease.orpha_code.ilike(f"%{search}%"),
            Disease.icd10_code.ilike(f"%{search}%"),
            Disease.category.ilike(f"%{search}%"),
            Disease.description.ilike(f"%{search}%"),
        )
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    if category and category.lower() != "all":
        category_filter = Disease.category.ilike(f"%{category}%")
        stmt = stmt.where(category_filter)
        count_stmt = count_stmt.where(category_filter)

    total = (await db.execute(count_stmt)).scalar() or 0

    stmt = stmt.order_by(Disease.name)
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    diseases = result.scalars().all()

    # Enrich with patient counts
    enriched = []
    for d in diseases:
        patient_count_result = await db.execute(
            select(func.count(Diagnosis.id)).where(Diagnosis.disease_id == d.id)
        )
        patient_count = patient_count_result.scalar() or 0
        resp = DiseaseResponse.model_validate(d)
        resp.patient_count = patient_count
        enriched.append(resp)

    return DiseaseListResponse(
        items=enriched,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{disease_id}", response_model=DiseaseResponse)
async def get_disease(
    disease_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """Get a single disease."""
    result = await db.execute(select(Disease).where(Disease.id == disease_id))
    disease = result.scalar_one_or_none()

    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    patient_count_result = await db.execute(
        select(func.count(Diagnosis.id)).where(Diagnosis.disease_id == disease.id)
    )
    patient_count = patient_count_result.scalar() or 0

    response = DiseaseResponse.model_validate(disease)
    response.patient_count = patient_count
    return response


@router.post("", response_model=DiseaseResponse, status_code=status.HTTP_201_CREATED)
async def create_disease(
    data: DiseaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new disease entry."""
    if data.orpha_code:
        existing = await db.execute(select(Disease).where(Disease.orpha_code == data.orpha_code))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="ORPHA code already exists")

    disease = Disease(**data.model_dump())
    db.add(disease)
    await db.flush()

    await create_audit_log(db, current_user.id, "create", "disease", disease.id)

    response = DiseaseResponse.model_validate(disease)
    response.patient_count = 0
    return response


@router.put("/{disease_id}", response_model=DiseaseResponse)
async def update_disease(
    disease_id: str,
    data: DiseaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing disease entry."""
    result = await db.execute(select(Disease).where(Disease.id == disease_id))
    disease = result.scalar_one_or_none()

    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(disease, field, value)

    await db.flush()
    await create_audit_log(db, current_user.id, "update", "disease", disease_id, details=update_data)

    response = DiseaseResponse.model_validate(disease)
    return response


@router.delete("/{disease_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_disease(
    disease_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a disease entry."""
    result = await db.execute(select(Disease).where(Disease.id == disease_id))
    disease = result.scalar_one_or_none()

    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    await create_audit_log(db, current_user.id, "delete", "disease", disease_id)
    await db.delete(disease)
