"""
Diagnosis schemas - Request/response models for patient diagnoses.
"""

from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional


class DiagnosisCreate(BaseModel):
    patient_id: str
    disease_id: str
    diagnosed_date: Optional[date] = None
    status: str = Field(default="suspected")
    genetic_variant: Optional[str] = None
    genetic_test_type: Optional[str] = None
    notes: Optional[str] = None


class DiagnosisUpdate(BaseModel):
    diagnosed_date: Optional[date] = None
    status: Optional[str] = None
    genetic_variant: Optional[str] = None
    genetic_test_type: Optional[str] = None
    notes: Optional[str] = None


class DiagnosisResponse(BaseModel):
    id: str
    patient_id: str
    disease_id: str
    diagnosed_date: Optional[date] = None
    status: str
    genetic_variant: Optional[str] = None
    genetic_test_type: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    disease_name: Optional[str] = None

    model_config = {"from_attributes": True}


class DiagnosisListResponse(BaseModel):
    items: list[DiagnosisResponse]
    total: int
    page: int
    page_size: int
