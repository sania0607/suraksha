from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..core.database import get_db
from ..core.security import get_current_active_user, get_admin_user
from ..models.models import User, EmergencyAlert, SOSRequest, EmergencyContact
from ..models.schemas import (
    EmergencyAlert as EmergencyAlertSchema,
    EmergencyAlertCreate,
    SOSRequest as SOSRequestSchema,
    SOSRequestCreate,
    EmergencyContact as EmergencyContactSchema,
    DataResponse,
    AlertSeverity,
    AlertType
)

router = APIRouter()


@router.get("/contacts/public")
def get_emergency_contacts_public(
    db: Session = Depends(get_db)
):
    """Get emergency contacts (public endpoint for testing)."""
    contacts = db.query(EmergencyContact).filter(EmergencyContact.is_active == True).order_by(
        EmergencyContact.priority.asc(),
        EmergencyContact.name.asc()
    ).limit(10).all()
    
    return [{
        "id": contact.id,
        "name": contact.name,
        "role": contact.role,
        "phone": contact.phone,
        "email": contact.email,
        "department": contact.department,
        "priority": contact.priority
    } for contact in contacts]


@router.get("/contacts", response_model=List[EmergencyContactSchema])
def get_emergency_contacts(
    active_only: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get emergency contacts."""
    query = db.query(EmergencyContact)
    
    if active_only:
        query = query.filter(EmergencyContact.is_active == True)
    
    contacts = query.order_by(
        EmergencyContact.priority.asc(),
        EmergencyContact.name.asc()
    ).offset(skip).limit(limit).all()
    
    return contacts


@router.get("/alerts", response_model=List[EmergencyAlertSchema])
def get_active_alerts(
    severity: Optional[AlertSeverity] = Query(None),
    alert_type: Optional[AlertType] = Query(None),
    active_only: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get emergency alerts."""
    query = db.query(EmergencyAlert)
    
    if active_only:
        query = query.filter(EmergencyAlert.is_active == True)
        # Also filter by expiration
        query = query.filter(
            (EmergencyAlert.expires_at == None) | 
            (EmergencyAlert.expires_at > datetime.utcnow())
        )
    
    if severity:
        query = query.filter(EmergencyAlert.severity == severity)
    
    if alert_type:
        query = query.filter(EmergencyAlert.alert_type == alert_type)
    
    alerts = query.order_by(
        EmergencyAlert.severity.desc(),
        EmergencyAlert.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return alerts


@router.post("/alerts", response_model=EmergencyAlertSchema)
def create_alert(
    alert_data: EmergencyAlertCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new emergency alert (Admin only)."""
    db_alert = EmergencyAlert(
        **alert_data.dict(),
        created_by=current_user.id
    )
    
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    # Add background task to send notifications
    background_tasks.add_task(send_alert_notifications, db_alert.id)
    
    return db_alert


@router.put("/alerts/{alert_id}/deactivate", response_model=DataResponse)
def deactivate_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Deactivate an emergency alert (Admin only)."""
    alert = db.query(EmergencyAlert).filter(EmergencyAlert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    alert.is_active = False
    db.commit()
    
    return {
        "success": True,
        "message": "Alert deactivated successfully",
        "data": {"alert_id": alert_id}
    }


@router.post("/sos", response_model=SOSRequestSchema)
def trigger_sos(
    sos_data: SOSRequestCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Trigger an SOS emergency request."""
    db_sos = SOSRequest(
        user_id=current_user.id,
        location=sos_data.location,
        latitude=sos_data.latitude,
        longitude=sos_data.longitude,
        notes=sos_data.notes,
        status="active"
    )
    
    db.add(db_sos)
    db.commit()
    db.refresh(db_sos)
    
    # Add background task to send emergency notifications
    background_tasks.add_task(send_sos_notifications, db_sos.id)
    
    return db_sos


@router.get("/sos", response_model=List[SOSRequestSchema])
def get_sos_requests(
    status: Optional[str] = Query(None, regex="^(active|resolved|cancelled)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get SOS requests."""
    query = db.query(SOSRequest)
    
    # Students can only see their own SOS requests
    if current_user.role.value == "student":
        query = query.filter(SOSRequest.user_id == current_user.id)
    
    if status:
        query = query.filter(SOSRequest.status == status)
    
    sos_requests = query.order_by(
        SOSRequest.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return sos_requests


@router.put("/sos/{sos_id}/resolve", response_model=DataResponse)
def resolve_sos_request(
    sos_id: int,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Resolve an SOS request (Admin only)."""
    sos_request = db.query(SOSRequest).filter(SOSRequest.id == sos_id).first()
    
    if not sos_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOS request not found"
        )
    
    sos_request.status = "resolved"
    sos_request.resolved_at = datetime.utcnow()
    sos_request.resolved_by = current_user.id
    if notes:
        sos_request.notes = f"{sos_request.notes or ''}\n\nResolution notes: {notes}"
    
    db.commit()
    
    return {
        "success": True,
        "message": "SOS request resolved successfully",
        "data": {"sos_id": sos_id}
    }


# Background tasks
async def send_alert_notifications(alert_id: int):
    """Send notifications for new emergency alert."""
    # This would integrate with email, SMS, push notification services
    # For now, we'll just log it
    print(f"Sending notifications for alert {alert_id}")
    # TODO: Implement actual notification logic


async def send_sos_notifications(sos_id: int):
    """Send emergency notifications for SOS request."""
    # This would immediately notify emergency services, security, etc.
    # For now, we'll just log it
    print(f"Sending emergency notifications for SOS {sos_id}")
    # TODO: Implement actual emergency notification logic