from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, List, Any
from datetime import datetime, timedelta

from ..models.models import (
    User, DisasterModule, StudentProgress, QuizAttempt, 
    EmergencyAlert, SOSRequest, UserRole
)


class AnalyticsService:
    """Service for generating analytics and reports."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_analytics(self) -> Dict[str, Any]:
        """Get user-related analytics."""
        total_users = self.db.query(User).count()
        active_users = self.db.query(User).filter(User.is_active == True).count()
        students = self.db.query(User).filter(User.role == UserRole.STUDENT).count()
        admins = self.db.query(User).filter(User.role == UserRole.ADMIN).count()
        
        # Calculate completion rate
        total_modules = self.db.query(DisasterModule).filter(DisasterModule.is_active == True).count()
        if total_modules > 0:
            completed_progress = self.db.query(StudentProgress).filter(
                StudentProgress.completed == True
            ).count()
            completion_rate = (completed_progress / (students * total_modules)) * 100 if students > 0 else 0
        else:
            completion_rate = 0
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "students": students,
            "admins": admins,
            "completion_rate": round(completion_rate, 2)
        }
    
    def get_module_analytics(self) -> List[Dict[str, Any]]:
        """Get module-specific analytics."""
        modules = self.db.query(DisasterModule).filter(DisasterModule.is_active == True).all()
        analytics = []
        
        for module in modules:
            # Get completion stats
            total_students = self.db.query(User).filter(User.role == UserRole.STUDENT).count()
            completed_count = self.db.query(StudentProgress).filter(
                StudentProgress.module_id == module.id,
                StudentProgress.completed == True
            ).count()
            
            completion_rate = (completed_count / total_students * 100) if total_students > 0 else 0
            
            # Get average score
            avg_score = self.db.query(func.avg(StudentProgress.score)).filter(
                StudentProgress.module_id == module.id,
                StudentProgress.completed == True
            ).scalar()
            
            # Get total attempts
            total_attempts = self.db.query(QuizAttempt).filter(
                QuizAttempt.module_id == module.id
            ).count()
            
            analytics.append({
                "module_id": module.id,
                "module_title": module.title,
                "completion_rate": round(completion_rate, 2),
                "average_score": round(avg_score or 0, 2),
                "total_attempts": total_attempts
            })
        
        return analytics
    
    def get_recent_activities(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent user activities."""
        activities = []
        
        # Recent completions
        recent_completions = self.db.query(StudentProgress).filter(
            StudentProgress.completed == True,
            StudentProgress.completed_at != None
        ).order_by(StudentProgress.completed_at.desc()).limit(limit).all()
        
        for completion in recent_completions:
            user = self.db.query(User).filter(User.id == completion.user_id).first()
            module = self.db.query(DisasterModule).filter(DisasterModule.id == completion.module_id).first()
            
            activities.append({
                "type": "module_completion",
                "user_name": user.name if user else "Unknown",
                "module_title": module.title if module else "Unknown",
                "score": completion.score,
                "timestamp": completion.completed_at
            })
        
        # Recent SOS requests
        recent_sos = self.db.query(SOSRequest).order_by(
            SOSRequest.created_at.desc()
        ).limit(5).all()
        
        for sos in recent_sos:
            user = self.db.query(User).filter(User.id == sos.user_id).first()
            
            activities.append({
                "type": "sos_request",
                "user_name": user.name if user else "Unknown",
                "status": sos.status,
                "location": sos.location,
                "timestamp": sos.created_at
            })
        
        # Sort by timestamp and limit
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        return activities[:limit]
    
    def get_alert_summary(self) -> Dict[str, Any]:
        """Get emergency alerts summary."""
        now = datetime.utcnow()
        
        # Active alerts
        active_alerts = self.db.query(EmergencyAlert).filter(
            EmergencyAlert.is_active == True,
            (EmergencyAlert.expires_at == None) | (EmergencyAlert.expires_at > now)
        ).count()
        
        # Critical alerts
        critical_alerts = self.db.query(EmergencyAlert).filter(
            EmergencyAlert.is_active == True,
            EmergencyAlert.severity == "critical",
            (EmergencyAlert.expires_at == None) | (EmergencyAlert.expires_at > now)
        ).count()
        
        # Active SOS requests
        active_sos = self.db.query(SOSRequest).filter(
            SOSRequest.status == "active"
        ).count()
        
        # Recent alerts (last 24 hours)
        last_24h = now - timedelta(hours=24)
        recent_alerts = self.db.query(EmergencyAlert).filter(
            EmergencyAlert.created_at >= last_24h
        ).count()
        
        return {
            "active_alerts": active_alerts,
            "critical_alerts": critical_alerts,
            "active_sos_requests": active_sos,
            "recent_alerts_24h": recent_alerts
        }
    
    def get_dashboard_analytics(self) -> Dict[str, Any]:
        """Get comprehensive dashboard analytics."""
        return {
            "user_analytics": self.get_user_analytics(),
            "module_analytics": self.get_module_analytics(),
            "recent_activities": self.get_recent_activities(),
            "alert_summary": self.get_alert_summary()
        }