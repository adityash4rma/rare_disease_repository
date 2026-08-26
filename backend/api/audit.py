"""
Audit API routes - Audit trail queries.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.audit_log import AuditLog
from backend.models.user import User
from backend.schemas.audit import AuditLogListResponse, AuditLogResponse

router = APIRouter(prefix="/api/audit", tags=["Audit Trail"])


@router.get("", response_model=AuditLogListResponse)
async def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    action: str = Query(None),
    resource_type: str = Query(None),
    user_id: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List audit log entries with filtering and pagination."""
    stmt = select(AuditLog).options(selectinload(AuditLog.user))
    count_stmt = select(func.count(AuditLog.id))

    if action:
        stmt = stmt.where(AuditLog.action == action)
        count_stmt = count_stmt.where(AuditLog.action == action)
    if resource_type:
        stmt = stmt.where(AuditLog.resource_type == resource_type)
        count_stmt = count_stmt.where(AuditLog.resource_type == resource_type)
    if user_id:
        stmt = stmt.where(AuditLog.user_id == user_id)
        count_stmt = count_stmt.where(AuditLog.user_id == user_id)

    total = (await db.execute(count_stmt)).scalar() or 0
    stmt = stmt.order_by(AuditLog.timestamp.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    logs = result.scalars().all()

    items = [
        AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            action=log.action,
            resource_type=log.resource_type,
            resource_id=log.resource_id,
            details=log.details,
            ip_address=log.ip_address,
            tx_hash=log.tx_hash,
            timestamp=log.timestamp,
            user_name=log.user.full_name if log.user else None,
        )
        for log in logs
    ]

    return AuditLogListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/actions", response_model=list[str])
async def list_audit_actions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get distinct audit log actions for filtering."""
    result = await db.execute(
        select(AuditLog.action).distinct().order_by(AuditLog.action)
    )
    return [r[0] for r in result.all()]


@router.get("/resource-types", response_model=list[str])
async def list_audit_resource_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get distinct audit log resource types for filtering."""
    result = await db.execute(
        select(AuditLog.resource_type).distinct().order_by(AuditLog.resource_type)
    )
    return [r[0] for r in result.all()]
