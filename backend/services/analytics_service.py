"""
Analytics service - Aggregation queries for dashboard and charts.
"""

from sqlalchemy import func, select, case
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import (
    Patient, Disease, Diagnosis, Hospital, Contribution,
    FHIRResource, AuditLog, User, DiagnosisStatus, DataSharingStatus,
    ContributionStatus,
)
from backend.schemas.analytics import (
    DashboardStats, DiseaseDistribution, DemographicBreakdown,
    MonthlyContribution, GeographicDistribution, HospitalContributionSummary,
)


async def get_dashboard_stats(db: AsyncSession) -> DashboardStats:
    """Get aggregate counts for the dashboard."""
    total_patients = (await db.execute(select(func.count(Patient.id)))).scalar() or 0
    total_diseases = (await db.execute(select(func.count(Disease.id)))).scalar() or 0
    total_hospitals = (await db.execute(select(func.count(Hospital.id)))).scalar() or 0
    total_contributions = (await db.execute(select(func.count(Contribution.id)))).scalar() or 0

    active_hospitals = (await db.execute(
        select(func.count(Hospital.id)).where(Hospital.data_sharing_status == DataSharingStatus.ACTIVE)
    )).scalar() or 0

    pending_contributions = (await db.execute(
        select(func.count(Contribution.id)).where(Contribution.status == ContributionStatus.PENDING)
    )).scalar() or 0

    confirmed_diagnoses = (await db.execute(
        select(func.count(Diagnosis.id)).where(Diagnosis.status == DiagnosisStatus.CONFIRMED)
    )).scalar() or 0

    total_fhir = (await db.execute(select(func.count(FHIRResource.id)))).scalar() or 0

    return DashboardStats(
        total_patients=total_patients,
        total_diseases=total_diseases,
        total_hospitals=total_hospitals,
        total_contributions=total_contributions,
        active_hospitals=active_hospitals,
        pending_contributions=pending_contributions,
        confirmed_diagnoses=confirmed_diagnoses,
        total_fhir_resources=total_fhir,
    )


async def get_disease_distribution(db: AsyncSession, limit: int = 10) -> list[DiseaseDistribution]:
    """Get top diseases by patient count."""
    stmt = (
        select(
            Disease.name,
            func.count(Diagnosis.id).label("patient_count"),
        )
        .join(Diagnosis, Disease.id == Diagnosis.disease_id)
        .group_by(Disease.name)
        .order_by(func.count(Diagnosis.id).desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.all()

    total = sum(r.patient_count for r in rows) or 1
    return [
        DiseaseDistribution(
            disease_name=r.name,
            patient_count=r.patient_count,
            percentage=round(r.patient_count / total * 100, 1),
        )
        for r in rows
    ]


async def get_sex_demographics(db: AsyncSession) -> list[DemographicBreakdown]:
    """Get patient sex breakdown."""
    stmt = (
        select(Patient.sex, func.count(Patient.id).label("cnt"))
        .group_by(Patient.sex)
    )
    result = await db.execute(stmt)
    rows = result.all()
    total = sum(r.cnt for r in rows) or 1
    return [
        DemographicBreakdown(
            category=r.sex.value if hasattr(r.sex, 'value') else str(r.sex),
            count=r.cnt,
            percentage=round(r.cnt / total * 100, 1),
        )
        for r in rows
    ]


async def get_ethnicity_demographics(db: AsyncSession) -> list[DemographicBreakdown]:
    """Get patient ethnicity breakdown."""
    stmt = (
        select(
            func.coalesce(Patient.ethnicity, "Unknown").label("eth"),
            func.count(Patient.id).label("cnt"),
        )
        .group_by(Patient.ethnicity)
    )
    result = await db.execute(stmt)
    rows = result.all()
    total = sum(r.cnt for r in rows) or 1
    return [
        DemographicBreakdown(
            category=r.eth,
            count=r.cnt,
            percentage=round(r.cnt / total * 100, 1),
        )
        for r in rows
    ]


async def get_monthly_contributions(db: AsyncSession, months: int = 12) -> list[MonthlyContribution]:
    """Get contribution counts per month."""
    stmt = (
        select(
            func.strftime("%Y-%m", Contribution.submitted_at).label("month"),
            func.count(Contribution.id).label("cnt"),
            func.coalesce(func.sum(Contribution.record_count), 0).label("rec_cnt"),
        )
        .group_by(func.strftime("%Y-%m", Contribution.submitted_at))
        .order_by(func.strftime("%Y-%m", Contribution.submitted_at).desc())
        .limit(months)
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [
        MonthlyContribution(month=r.month, count=r.cnt, record_count=r.rec_cnt)
        for r in reversed(rows)
    ]


async def get_geographic_distribution(db: AsyncSession) -> list[GeographicDistribution]:
    """Get patient and hospital counts by country."""
    # Patient counts by country
    patient_stmt = (
        select(
            func.coalesce(Patient.address_country, "Unknown").label("country"),
            func.count(Patient.id).label("patient_count"),
        )
        .group_by(Patient.address_country)
    )
    patient_result = await db.execute(patient_stmt)
    patient_rows = {r.country: r.patient_count for r in patient_result.all()}

    # Hospital counts by country
    hospital_stmt = (
        select(
            func.coalesce(Hospital.country, "Unknown").label("country"),
            func.count(Hospital.id).label("hospital_count"),
        )
        .group_by(Hospital.country)
    )
    hospital_result = await db.execute(hospital_stmt)
    hospital_rows = {r.country: r.hospital_count for r in hospital_result.all()}

    countries = set(patient_rows.keys()) | set(hospital_rows.keys())
    return [
        GeographicDistribution(
            country=c,
            patient_count=patient_rows.get(c, 0),
            hospital_count=hospital_rows.get(c, 0),
        )
        for c in sorted(countries)
    ]


async def get_hospital_contribution_summary(db: AsyncSession) -> list[HospitalContributionSummary]:
    """Get contribution summary per hospital."""
    stmt = (
        select(
            Hospital.name,
            Hospital.code,
            Hospital.data_sharing_status,
            func.count(Contribution.id).label("total_contributions"),
            func.coalesce(func.sum(Contribution.record_count), 0).label("total_records"),
        )
        .outerjoin(Contribution, Hospital.id == Contribution.hospital_id)
        .group_by(Hospital.id)
        .order_by(func.count(Contribution.id).desc())
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [
        HospitalContributionSummary(
            hospital_name=r.name,
            hospital_code=r.code,
            total_contributions=r.total_contributions,
            total_records=r.total_records,
            status=r.data_sharing_status.value if hasattr(r.data_sharing_status, 'value') else str(r.data_sharing_status),
        )
        for r in rows
    ]
