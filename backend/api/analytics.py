"""
Analytics API routes - Dashboard statistics and charts data.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.dependencies import get_current_user, get_optional_user
from backend.database import get_db
from backend.models.user import User
from backend.schemas.analytics import (
    AnalyticsResponse, DashboardStats, DiseaseDistribution,
    DemographicBreakdown, MonthlyContribution, GeographicDistribution,
    HospitalContributionSummary,
)
from backend.services.analytics_service import (
    get_dashboard_stats, get_disease_distribution, get_sex_demographics,
    get_ethnicity_demographics, get_monthly_contributions,
    get_geographic_distribution, get_hospital_contribution_summary,
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardStats)
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """Get dashboard summary statistics."""
    return await get_dashboard_stats(db)


@router.get("/diseases", response_model=list[DiseaseDistribution])
async def disease_distribution(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """Get disease distribution data for charts."""
    return await get_disease_distribution(db, limit)


@router.get("/demographics/sex", response_model=list[DemographicBreakdown])
async def sex_demographics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get patient sex demographics breakdown."""
    return await get_sex_demographics(db)


@router.get("/demographics/ethnicity", response_model=list[DemographicBreakdown])
async def ethnicity_demographics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get patient ethnicity demographics breakdown."""
    return await get_ethnicity_demographics(db)


@router.get("/contributions/monthly", response_model=list[MonthlyContribution])
async def monthly_contributions(
    months: int = Query(12, ge=1, le=36),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get monthly contribution trends."""
    return await get_monthly_contributions(db, months)


@router.get("/geographic", response_model=list[GeographicDistribution])
async def geographic_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get geographic distribution of patients and hospitals."""
    return await get_geographic_distribution(db)


@router.get("/hospitals", response_model=list[HospitalContributionSummary])
async def hospital_contributions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get contribution summary per hospital."""
    return await get_hospital_contribution_summary(db)


@router.get("/all", response_model=AnalyticsResponse)
async def full_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all analytics data in a single request."""
    return AnalyticsResponse(
        dashboard=await get_dashboard_stats(db),
        disease_distribution=await get_disease_distribution(db),
        sex_demographics=await get_sex_demographics(db),
        ethnicity_demographics=await get_ethnicity_demographics(db),
        monthly_contributions=await get_monthly_contributions(db),
        geographic_distribution=await get_geographic_distribution(db),
        hospital_contributions=await get_hospital_contribution_summary(db),
    )
