"""
Diagnosis model - Links patients to diseases with clinical details.
"""

import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from backend.database import Base


class DiagnosisStatus(str, enum.Enum):
    SUSPECTED = "suspected"
    CONFIRMED = "confirmed"
    RULED_OUT = "ruled_out"
    IN_REMISSION = "in_remission"


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True
    )
    disease_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("diseases.id"), nullable=False, index=True
    )
    diagnosed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[DiagnosisStatus] = mapped_column(
        Enum(DiagnosisStatus), nullable=False, default=DiagnosisStatus.SUSPECTED
    )
    genetic_variant: Mapped[str | None] = mapped_column(String(200), nullable=True)
    genetic_test_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    patient = relationship("Patient", back_populates="diagnoses")
    disease = relationship("Disease", back_populates="diagnoses")
