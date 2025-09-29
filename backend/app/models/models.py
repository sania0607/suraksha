from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
import datetime
from ..core.database import Base


class UserRole(PyEnum):
    STUDENT = "student"
    ADMIN = "admin"


class AlertSeverity(PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(PyEnum):
    EARTHQUAKE = "earthquake"
    FIRE = "fire"
    FLOOD = "flood"
    CYCLONE = "cyclone"
    WEATHER = "weather"
    OTHER = "other"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    profile_image = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True)
    year_of_study = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    progress = relationship("StudentProgress", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    sos_requests = relationship("SOSRequest", foreign_keys="[SOSRequest.user_id]", back_populates="user")
    resolved_requests = relationship("SOSRequest", foreign_keys="[SOSRequest.resolved_by]", back_populates="resolver")


class DisasterModule(Base):
    __tablename__ = "disaster_modules"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)  # e.g., 'earthquake', 'fire'
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=False)
    color = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    phases = relationship("ModulePhase", back_populates="module")
    quiz_questions = relationship("QuizQuestion", back_populates="module")
    progress = relationship("StudentProgress", back_populates="module")


class ModulePhase(Base):
    __tablename__ = "module_phases"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("disaster_modules.id"), nullable=False)
    phase_type = Column(String, nullable=False)  # 'before', 'during', 'after'
    title = Column(String, nullable=False)
    content_focus = Column(Text, nullable=False)
    format = Column(String, nullable=False)
    
    # Relationships
    module = relationship("DisasterModule", back_populates="phases")
    checklists = relationship("PhaseChecklist", back_populates="phase")
    steps = relationship("PhaseStep", back_populates="phase")
    qa_items = relationship("PhaseQA", back_populates="phase")


class PhaseChecklist(Base):
    __tablename__ = "phase_checklists"
    
    id = Column(Integer, primary_key=True, index=True)
    phase_id = Column(Integer, ForeignKey("module_phases.id"), nullable=False)
    item = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    
    # Relationships
    phase = relationship("ModulePhase", back_populates="checklists")


class PhaseStep(Base):
    __tablename__ = "phase_steps"
    
    id = Column(Integer, primary_key=True, index=True)
    phase_id = Column(Integer, ForeignKey("module_phases.id"), nullable=False)
    step = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    animation = Column(String, nullable=True)
    location = Column(String, nullable=True)
    order_index = Column(Integer, nullable=False)
    
    # Relationships
    phase = relationship("ModulePhase", back_populates="steps")


class PhaseQA(Base):
    __tablename__ = "phase_qa"
    
    id = Column(Integer, primary_key=True, index=True)
    phase_id = Column(Integer, ForeignKey("module_phases.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    
    # Relationships
    phase = relationship("ModulePhase", back_populates="qa_items")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("disaster_modules.id"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON string of options
    correct_answer = Column(Integer, nullable=False)
    phase = Column(String, nullable=False)  # 'before', 'during', 'after'
    
    # Relationships
    module = relationship("DisasterModule", back_populates="quiz_questions")


class StudentProgress(Base):
    __tablename__ = "student_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("disaster_modules.id"), nullable=False)
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    time_spent = Column(Integer, default=0)  # in minutes
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    module = relationship("DisasterModule", back_populates="progress")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("disaster_modules.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    answers = Column(Text, nullable=False)  # JSON string of answers
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")


class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(Enum(AlertType), nullable=False)
    severity = Column(Enum(AlertSeverity), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    source = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)


class SOSRequest(Base):
    __tablename__ = "sos_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String, default="active")  # active, resolved, cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships with explicit foreign_keys
    user = relationship("User", foreign_keys=[user_id], back_populates="sos_requests")
    resolver = relationship("User", foreign_keys=[resolved_by], back_populates="resolved_requests")


class CampusLocation(Base):
    __tablename__ = "campus_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    floor_plan = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    safety_features = relationship("SafetyFeature", back_populates="location")


class SafetyFeature(Base):
    __tablename__ = "safety_features"
    
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("campus_locations.id"), nullable=False)
    feature_type = Column(String, nullable=False)  # 'exit', 'assembly', 'extinguisher', 'firstaid'
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    position_x = Column(Float, nullable=False)  # Percentage position on map
    position_y = Column(Float, nullable=False)  # Percentage position on map
    is_active = Column(Boolean, default=True)
    
    # Relationships
    location = relationship("CampusLocation", back_populates="safety_features")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    department = Column(String, nullable=True)
    priority = Column(Integer, default=1)  # 1 = highest priority
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DrillSession(Base):
    __tablename__ = "drill_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    drill_type = Column(String, nullable=False)  # 'fire', 'earthquake', etc.
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WeatherAlert(Base):
    __tablename__ = "weather_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, nullable=False)  # ID from weather service
    alert_type = Column(String, nullable=False)  # 'weather_alert', 'air_quality', etc.
    severity = Column(Enum(AlertSeverity), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    recommendations = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())