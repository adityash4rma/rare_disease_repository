"""
Disease model - Rare disease catalog with ORPHA/ICD-10 codes.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, String, Text
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class Disease(Base):
    __tablename__ = "diseases"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    orpha_code: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True, index=True)
    icd10_code: Mapped[str | None] = mapped_column(String(20), nullable=True, index=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    prevalence: Mapped[str | None] = mapped_column(String(100), nullable=True)
    inheritance: Mapped[str | None] = mapped_column(String(200), nullable=True)
    age_of_onset: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    symptoms: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    genes: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    diagnoses = relationship("Diagnosis", back_populates="disease")
