"""
Contribution model - Data contributions from hospitals.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from backend.database import Base


class ContributionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PROCESSING = "processing"


class RecordType(str, enum.Enum):
    PATIENT = "patient"
    DIAGNOSIS = "diagnosis"
    GENETIC = "genetic"
    LAB_RESULT = "lab_result"
    IMAGING = "imaging"
    CLINICAL_NOTE = "clinical_note"


class Contribution(Base):
    __tablename__ = "contributions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    hospital_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("hospitals.id"), nullable=False, index=True
    )
    contributor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    record_type: Mapped[RecordType] = mapped_column(
        Enum(RecordType), nullable=False
    )
    record_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[ContributionStatus] = mapped_column(
        Enum(ContributionStatus), nullable=False, default=ContributionStatus.PENDING
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    reviewer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    hospital = relationship("Hospital", back_populates="contributions")
    contributor = relationship("User", back_populates="contributions")
