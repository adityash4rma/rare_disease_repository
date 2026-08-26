"""
Models package - Import all models for Alembic auto-discovery.
"""

from backend.models.user import User, UserRole
from backend.models.patient import Patient, Sex
from backend.models.disease import Disease
from backend.models.diagnosis import Diagnosis, DiagnosisStatus
from backend.models.hospital import Hospital, DataSharingStatus
from backend.models.contribution import Contribution, ContributionStatus, RecordType
from backend.models.audit_log import AuditLog
from backend.models.fhir_resource import FHIRResource

__all__ = [
    "User", "UserRole",
    "Patient", "Sex",
    "Disease",
    "Diagnosis", "DiagnosisStatus",
    "Hospital", "DataSharingStatus",
    "Contribution", "ContributionStatus", "RecordType",
    "AuditLog",
    "FHIRResource",
]
