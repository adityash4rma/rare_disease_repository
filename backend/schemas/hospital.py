"""
Hospital schemas - Request/response models for hospital management.
"""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class HospitalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=300)
    code: str = Field(..., min_length=1, max_length=20)
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    data_sharing_status: str = Field(default="pending")
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None


class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    data_sharing_status: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None


class HospitalResponse(BaseModel):
    id: str
    name: str
    code: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    data_sharing_status: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    total_contributions: int
    description: Optional[str] = None
    created_at: datetime
    patient_count: int = 0
    user_count: int = 0

    model_config = {"from_attributes": True}


class HospitalListResponse(BaseModel):
    items: list[HospitalResponse]
    total: int
    page: int
    page_size: int
