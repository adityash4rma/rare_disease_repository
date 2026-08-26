"""
Patient schemas - Request/response models for patient management.
"""

from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional


class PatientCreate(BaseModel):
    mrn: str = Field(..., min_length=1, max_length=50)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    date_of_birth: date
    sex: str = Field(default="unknown")
    ethnicity: Optional[str] = None
    address_city: Optional[str] = None
    address_country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    hospital_id: Optional[str] = None


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    sex: Optional[str] = None
    ethnicity: Optional[str] = None
    address_city: Optional[str] = None
    address_country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    hospital_id: Optional[str] = None


class PatientResponse(BaseModel):
    id: str
    mrn: str
    first_name: str
    last_name: str
    date_of_birth: date
    sex: str
    ethnicity: Optional[str] = None
    address_city: Optional[str] = None
    address_country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    hospital_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PatientDetailResponse(PatientResponse):
    diagnoses: list["DiagnosisResponse"] = []
    hospital_name: Optional[str] = None


class PatientListResponse(BaseModel):
    items: list[PatientResponse]
    total: int
    page: int
    page_size: int


# Forward reference resolved after DiagnosisResponse is imported
from backend.schemas.diagnosis import DiagnosisResponse
PatientDetailResponse.model_rebuild()
