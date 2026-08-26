"""
Contribution schemas - Request/response models for data contributions.
"""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class ContributionCreate(BaseModel):
    hospital_id: str
    record_type: str
    record_count: int = Field(..., ge=1)
    description: Optional[str] = None


class ContributionReview(BaseModel):
    status: str  # "approved" or "rejected"
    reviewer_notes: Optional[str] = None


class ContributionResponse(BaseModel):
    id: str
    hospital_id: str
    contributor_id: str
    record_type: str
    record_count: int
    status: str
    description: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_notes: Optional[str] = None
    hospital_name: Optional[str] = None
    contributor_name: Optional[str] = None

    model_config = {"from_attributes": True}


class ContributionListResponse(BaseModel):
    items: list[ContributionResponse]
    total: int
    page: int
    page_size: int
