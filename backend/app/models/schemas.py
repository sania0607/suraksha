from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"


class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(str, Enum):
    EARTHQUAKE = "earthquake"
    FIRE = "fire"
    FLOOD = "flood"
    CYCLONE = "cyclone"
    WEATHER = "weather"
    OTHER = "other"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.STUDENT
    phone: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[str] = None
    profile_image: Optional[str] = None


class User(UserBase):
    id: int
    is_active: bool
    profile_image: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Authentication Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Module Schemas
class DisasterModuleBase(BaseModel):
    slug: str
    title: str
    description: str
    icon: str
    color: str
    is_active: bool = True


class DisasterModuleCreate(DisasterModuleBase):
    pass


class DisasterModule(DisasterModuleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Progress Schemas
class StudentProgressBase(BaseModel):
    module_id: int
    completed: bool = False
    score: int = 0
    time_spent: int = 0


class StudentProgressCreate(StudentProgressBase):
    user_id: int


class StudentProgressUpdate(BaseModel):
    completed: Optional[bool] = None
    score: Optional[int] = None
    time_spent: Optional[int] = None


class StudentProgress(StudentProgressBase):
    id: int
    user_id: int
    last_accessed: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Quiz Schemas
class QuizQuestionBase(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    phase: str


class QuizQuestion(QuizQuestionBase):
    id: int
    module_id: int

    class Config:
        from_attributes = True


class QuizAttemptBase(BaseModel):
    module_id: int
    answers: List[int]


class QuizAttemptCreate(QuizAttemptBase):
    user_id: int
    score: int
    total_questions: int


class QuizAttempt(BaseModel):
    id: int
    user_id: int
    module_id: int
    score: int
    total_questions: int
    answers: List[int]
    completed_at: datetime

    class Config:
        from_attributes = True


# Emergency Alert Schemas
class EmergencyAlertBase(BaseModel):
    alert_type: AlertType
    severity: AlertSeverity
    title: str
    message: str
    location: str
    source: str


class EmergencyAlertCreate(EmergencyAlertBase):
    expires_at: Optional[datetime] = None


class EmergencyAlert(EmergencyAlertBase):
    id: int
    is_active: bool
    created_by: Optional[int] = None
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# SOS Schemas
class SOSRequestBase(BaseModel):
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None


class SOSRequestCreate(SOSRequestBase):
    user_id: int


class SOSRequest(SOSRequestBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[int] = None

    class Config:
        from_attributes = True


# Campus Schemas
class SafetyFeatureBase(BaseModel):
    feature_type: str
    name: str
    description: Optional[str] = None
    position_x: float
    position_y: float
    is_active: bool = True


class SafetyFeature(SafetyFeatureBase):
    id: int
    location_id: int

    class Config:
        from_attributes = True


class CampusLocationBase(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    floor_plan: Optional[str] = None
    is_active: bool = True


class CampusLocation(CampusLocationBase):
    id: int
    safety_features: List[SafetyFeature] = []
    created_at: datetime

    class Config:
        from_attributes = True


# Weather Schemas
class WeatherAlertBase(BaseModel):
    external_id: str
    alert_type: str
    severity: AlertSeverity
    title: str
    message: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    recommendations: Optional[List[str]] = None


class WeatherAlert(WeatherAlertBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Emergency Contact Schemas
class EmergencyContactBase(BaseModel):
    name: str
    role: str
    phone: str
    email: Optional[str] = None
    department: Optional[str] = None
    priority: int = 1
    is_active: bool = True


class EmergencyContact(EmergencyContactBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Analytics Schemas
class UserAnalytics(BaseModel):
    total_users: int
    active_users: int
    students: int
    admins: int
    completion_rate: float


class ModuleAnalytics(BaseModel):
    module_id: int
    module_title: str
    completion_rate: float
    average_score: float
    total_attempts: int


class DashboardAnalytics(BaseModel):
    user_analytics: UserAnalytics
    module_analytics: List[ModuleAnalytics]
    recent_activities: List[dict]
    alert_summary: dict


# Response Schemas
class ResponseBase(BaseModel):
    success: bool
    message: str


class DataResponse(ResponseBase):
    data: Optional[dict] = None


class ListResponse(ResponseBase):
    data: List[dict]
    total: int
    page: int = 1
    per_page: int = 10