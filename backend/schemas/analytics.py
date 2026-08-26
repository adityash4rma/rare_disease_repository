"""
Analytics schemas - Response models for dashboard and analytics.
"""

from pydantic import BaseModel
from typing import Optional


class DashboardStats(BaseModel):
    total_patients: int
    total_diseases: int
    total_hospitals: int
    total_contributions: int
    active_hospitals: int
    pending_contributions: int
    confirmed_diagnoses: int
    total_fhir_resources: int


class DiseaseDistribution(BaseModel):
    disease_name: str
    patient_count: int
    percentage: float


class DemographicBreakdown(BaseModel):
    category: str
    count: int
    percentage: float


class MonthlyContribution(BaseModel):
    month: str
    count: int
    record_count: int


class GeographicDistribution(BaseModel):
    country: str
    patient_count: int
    hospital_count: int


class HospitalContributionSummary(BaseModel):
    hospital_name: str
    hospital_code: str
    total_contributions: int
    total_records: int
    status: str


class AnalyticsResponse(BaseModel):
    dashboard: DashboardStats
    disease_distribution: list[DiseaseDistribution]
    sex_demographics: list[DemographicBreakdown]
    ethnicity_demographics: list[DemographicBreakdown]
    monthly_contributions: list[MonthlyContribution]
    geographic_distribution: list[GeographicDistribution]
    hospital_contributions: list[HospitalContributionSummary]
