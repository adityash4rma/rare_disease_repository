"""
Disease schemas - Request/response models for disease catalog.
"""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class DiseaseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=300)
    orpha_code: Optional[str] = None
    icd10_code: Optional[str] = None
    category: Optional[str] = None
    prevalence: Optional[str] = None
    inheritance: Optional[str] = None
    age_of_onset: Optional[str] = None
    description: Optional[str] = None
    symptoms: Optional[dict] = None
    genes: Optional[dict] = None


class DiseaseUpdate(BaseModel):
    name: Optional[str] = None
    orpha_code: Optional[str] = None
    icd10_code: Optional[str] = None
    category: Optional[str] = None
    prevalence: Optional[str] = None
    inheritance: Optional[str] = None
    age_of_onset: Optional[str] = None
    description: Optional[str] = None
    symptoms: Optional[dict] = None
    genes: Optional[dict] = None


class DiseaseResponse(BaseModel):
    id: str
    name: str
    orpha_code: Optional[str] = None
    icd10_code: Optional[str] = None
    category: Optional[str] = None
    prevalence: Optional[str] = None
    inheritance: Optional[str] = None
    age_of_onset: Optional[str] = None
    description: Optional[str] = None
    symptoms: Optional[dict] = None
    genes: Optional[dict] = None
    created_at: datetime
    patient_count: int = 0

    model_config = {"from_attributes": True}


class DiseaseListResponse(BaseModel):
    items: list[DiseaseResponse]
    total: int
    page: int
    page_size: int
