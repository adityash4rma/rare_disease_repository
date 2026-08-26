"""
Audit Log schemas - Request/response models for audit trail.
"""

from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[dict] = None
    ip_address: Optional[str] = None
    tx_hash: Optional[str] = None
    timestamp: datetime
    user_name: Optional[str] = None

    model_config = {"from_attributes": True}


class AuditLogListResponse(BaseModel):
    items: list[AuditLogResponse]
    total: int
    page: int
    page_size: int
