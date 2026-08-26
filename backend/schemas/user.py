"""
User schemas - Request/response models for auth and user management.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# ---------- Auth ----------

class UserRegister(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)
    full_name: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(default="researcher")
    hospital_id: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


# ---------- User CRUD ----------

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    hospital_id: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    hospital_id: Optional[str] = None
    is_active: Optional[bool] = None


class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
