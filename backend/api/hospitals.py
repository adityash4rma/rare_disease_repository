"""
Hospital API routes - Hospital registry management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.hospital import Hospital
from backend.models.patient import Patient
from backend.models.user import User
from backend.schemas.hospital import (
    HospitalCreate, HospitalListResponse, HospitalResponse, HospitalUpdate,
)
from backend.services.audit_service import create_audit_log

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])


@router.get("", response_model=HospitalListResponse)
async def list_hospitals(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    status_filter: str = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List hospitals with pagination and search."""
    stmt = select(Hospital)
    count_stmt = select(func.count(Hospital.id))

    if search:
        search_filter = or_(
            Hospital.name.ilike(f"%{search}%"),
            Hospital.code.ilike(f"%{search}%"),
            Hospital.city.ilike(f"%{search}%"),
        )
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    if status_filter:
        stmt = stmt.where(Hospital.data_sharing_status == status_filter)
        count_stmt = count_stmt.where(Hospital.data_sharing_status == status_filter)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(Hospital.name)
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    hospitals = result.scalars().all()

    items = []
    for h in hospitals:
        patient_count = (await db.execute(
            select(func.count(Patient.id)).where(Patient.hospital_id == h.id)
        )).scalar() or 0
        user_count = (await db.execute(
            select(func.count(User.id)).where(User.hospital_id == h.id)
        )).scalar() or 0

        resp = HospitalResponse.model_validate(h)
        resp.patient_count = patient_count
        resp.user_count = user_count
        items.append(resp)

    return HospitalListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{hospital_id}", response_model=HospitalResponse)
async def get_hospital(
    hospital_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single hospital."""
    result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital = result.scalar_one_or_none()

    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    patient_count = (await db.execute(
        select(func.count(Patient.id)).where(Patient.hospital_id == hospital.id)
    )).scalar() or 0
    user_count = (await db.execute(
        select(func.count(User.id)).where(User.hospital_id == hospital.id)
    )).scalar() or 0

    resp = HospitalResponse.model_validate(hospital)
    resp.patient_count = patient_count
    resp.user_count = user_count
    return resp


@router.post("", response_model=HospitalResponse, status_code=status.HTTP_201_CREATED)
async def create_hospital(
    data: HospitalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new hospital."""
    existing = await db.execute(select(Hospital).where(Hospital.code == data.code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Hospital code already exists")

    hospital = Hospital(**data.model_dump())
    db.add(hospital)
    await db.flush()

    await create_audit_log(db, current_user.id, "create", "hospital", hospital.id)

    resp = HospitalResponse.model_validate(hospital)
    resp.patient_count = 0
    resp.user_count = 0
    return resp


@router.put("/{hospital_id}", response_model=HospitalResponse)
async def update_hospital(
    hospital_id: str,
    data: HospitalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing hospital."""
    result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital = result.scalar_one_or_none()

    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hospital, field, value)

    await db.flush()
    await create_audit_log(db, current_user.id, "update", "hospital", hospital_id, details=update_data)

    return HospitalResponse.model_validate(hospital)


@router.delete("/{hospital_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hospital(
    hospital_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a hospital."""
    result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital = result.scalar_one_or_none()

    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    await create_audit_log(db, current_user.id, "delete", "hospital", hospital_id)
    await db.delete(hospital)
