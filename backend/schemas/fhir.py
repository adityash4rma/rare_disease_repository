"""
FHIR Resource schemas - Request/response models for FHIR endpoints.
"""

from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class FHIRResourceCreate(BaseModel):
    resource_type: str
    fhir_id: str
    patient_id: Optional[str] = None
    payload: dict


class FHIRResourceResponse(BaseModel):
    id: str
    resource_type: str
    fhir_id: str
    patient_id: Optional[str] = None
    payload: dict
    version: int
    last_updated: datetime

    model_config = {"from_attributes": True}


class FHIRResourceListResponse(BaseModel):
    items: list[FHIRResourceResponse]
    total: int
    page: int
    page_size: int


class FHIRResourceTypeSummary(BaseModel):
    resource_type: str
    count: int
