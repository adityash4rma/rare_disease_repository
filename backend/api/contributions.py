"""
Contribution API routes - Data contribution management.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.dependencies import get_current_user, require_role
from backend.database import get_db
from backend.models.contribution import Contribution, ContributionStatus
from backend.models.hospital import Hospital
from backend.models.user import User, UserRole
from backend.schemas.contribution import (
    ContributionCreate, ContributionListResponse, ContributionResponse, ContributionReview,
)
from backend.services.audit_service import create_audit_log

router = APIRouter(prefix="/api/contributions", tags=["Contributions"])


@router.get("", response_model=ContributionListResponse)
async def list_contributions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    hospital_id: str = Query(None),
    status_filter: str = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List data contributions with pagination and filters."""
    stmt = (
        select(Contribution)
        .options(
            selectinload(Contribution.hospital),
            selectinload(Contribution.contributor),
        )
    )
    count_stmt = select(func.count(Contribution.id))

    if hospital_id:
        stmt = stmt.where(Contribution.hospital_id == hospital_id)
        count_stmt = count_stmt.where(Contribution.hospital_id == hospital_id)
    if status_filter:
        stmt = stmt.where(Contribution.status == status_filter)
        count_stmt = count_stmt.where(Contribution.status == status_filter)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(Contribution.submitted_at.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    contributions = result.scalars().all()

    items = [
        ContributionResponse(
            id=c.id,
            hospital_id=c.hospital_id,
            contributor_id=c.contributor_id,
            record_type=c.record_type.value,
            record_count=c.record_count,
            status=c.status.value,
            description=c.description,
            submitted_at=c.submitted_at,
            reviewed_at=c.reviewed_at,
            reviewer_notes=c.reviewer_notes,
            hospital_name=c.hospital.name if c.hospital else None,
            contributor_name=c.contributor.full_name if c.contributor else None,
        )
        for c in contributions
    ]

    return ContributionListResponse(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=ContributionResponse, status_code=status.HTTP_201_CREATED)
async def create_contribution(
    data: ContributionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a new data contribution."""
    # Verify hospital exists
    hospital_result = await db.execute(select(Hospital).where(Hospital.id == data.hospital_id))
    hospital = hospital_result.scalar_one_or_none()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    contribution = Contribution(
        hospital_id=data.hospital_id,
        contributor_id=current_user.id,
        record_type=data.record_type,
        record_count=data.record_count,
        description=data.description,
    )
    db.add(contribution)
    await db.flush()

    await create_audit_log(db, current_user.id, "create", "contribution", contribution.id)

    return ContributionResponse(
        id=contribution.id,
        hospital_id=contribution.hospital_id,
        contributor_id=contribution.contributor_id,
        record_type=contribution.record_type.value,
        record_count=contribution.record_count,
        status=contribution.status.value,
        description=contribution.description,
        submitted_at=contribution.submitted_at,
        reviewed_at=None,
        reviewer_notes=None,
        hospital_name=hospital.name,
        contributor_name=current_user.full_name,
    )


@router.put("/{contribution_id}/review", response_model=ContributionResponse)
async def review_contribution(
    contribution_id: str,
    data: ContributionReview,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """Approve or reject a data contribution (admin only)."""
    stmt = (
        select(Contribution)
        .options(selectinload(Contribution.hospital), selectinload(Contribution.contributor))
        .where(Contribution.id == contribution_id)
    )
    result = await db.execute(stmt)
    contribution = result.scalar_one_or_none()

    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")

    if data.status not in ("approved", "rejected"):
        raise HTTPException(status_code=422, detail="Status must be 'approved' or 'rejected'")

    contribution.status = ContributionStatus(data.status)
    contribution.reviewed_at = datetime.now(timezone.utc)
    contribution.reviewer_notes = data.reviewer_notes

    # Update hospital contribution count if approved
    if data.status == "approved" and contribution.hospital:
        contribution.hospital.total_contributions += 1

    await db.flush()
    await create_audit_log(
        db, current_user.id, "review", "contribution", contribution_id,
        details={"status": data.status, "notes": data.reviewer_notes},
    )

    return ContributionResponse(
        id=contribution.id,
        hospital_id=contribution.hospital_id,
        contributor_id=contribution.contributor_id,
        record_type=contribution.record_type.value,
        record_count=contribution.record_count,
        status=contribution.status.value,
        description=contribution.description,
        submitted_at=contribution.submitted_at,
        reviewed_at=contribution.reviewed_at,
        reviewer_notes=contribution.reviewer_notes,
        hospital_name=contribution.hospital.name if contribution.hospital else None,
        contributor_name=contribution.contributor.full_name if contribution.contributor else None,
    )
