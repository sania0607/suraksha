"""
Database seeder script for Suraksha platform
Run this script to populate the database with initial data
"""

import asyncio
import hashlib
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import (
    User, UserRole, DisasterModule, ModulePhase, PhaseStep,
    EmergencyContact, EmergencyAlert
)
from app.core.security import get_password_hash

async def create_sample_data():
    """Create sample data for development and testing"""
    
    db = SessionLocal()
    
    try:
        # Create admin user
        admin_user = User(
            email="admin@suraksha.edu",
            hashed_password=get_password_hash("admin123"),
            name="System Administrator",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin_user)
        
        # Create student user
        student_user = User(
            email="student@suraksha.edu",
            hashed_password=get_password_hash("demo123"),
            name="Demo Student",
            role=UserRole.STUDENT,
            is_active=True,
            student_id="STU2025001",
            department="Computer Science",
            year_of_study="3rd Year"
        )
        db.add(student_user)
        
        # Create disaster modules
        earthquake_module = DisasterModule(
            title="Earthquake Preparedness",
            description="Learn essential earthquake safety measures, evacuation procedures, and post-earthquake response protocols.",
            disaster_type="earthquake",
            difficulty_level="beginner",
            estimated_duration=45,
            slug="earthquake-preparedness",
            is_active=True,
            order_index=1
        )
        db.add(earthquake_module)
        
        fire_module = DisasterModule(
            title="Fire Safety & Evacuation",
            description="Comprehensive fire safety training including prevention, detection, and emergency evacuation procedures.",
            disaster_type="fire",
            difficulty_level="beginner",
            estimated_duration=35,
            slug="fire-safety-evacuation",
            is_active=True,
            order_index=2
        )
        db.add(fire_module)
        
        flood_module = DisasterModule(
            title="Flood Response & Safety",
            description="Understanding flood risks, safety measures, and emergency response protocols during flooding events.",
            disaster_type="flood",
            difficulty_level="intermediate",
            estimated_duration=40,
            slug="flood-response-safety",
            is_active=True,
            order_index=3
        )
        db.add(flood_module)
        
        # Commit to get IDs
        db.commit()
        
        # Create phases for earthquake module
        earthquake_phases = [
            ModulePhase(
                module_id=earthquake_module.id,
                title="Understanding Earthquakes",
                description="Learn about earthquake causes, types, and risk factors",
                phase_type="education",
                order_index=1,
                estimated_minutes=15,
                is_required=True,
                content={
                    "type": "educational",
                    "sections": [
                        {
                            "title": "What Causes Earthquakes?",
                            "content": "Earthquakes are caused by the sudden release of energy stored in rocks beneath the Earth's surface..."
                        },
                        {
                            "title": "Types of Earthquakes",
                            "content": "There are several types of earthquakes: tectonic, volcanic, collapse, and explosion earthquakes..."
                        }
                    ]
                }
            ),
            ModulePhase(
                module_id=earthquake_module.id,
                title="Before an Earthquake",
                description="Preparation and safety measures to take before earthquakes occur",
                phase_type="preparation",
                order_index=2,
                estimated_minutes=20,
                is_required=True,
                content={
                    "type": "checklist",
                    "items": [
                        "Create an emergency kit with water, food, and supplies",
                        "Secure heavy furniture and appliances",
                        "Identify safe spots in each room (under sturdy tables)",
                        "Practice Drop, Cover, and Hold On",
                        "Create a family emergency plan"
                    ]
                }
            ),
            ModulePhase(
                module_id=earthquake_module.id,
                title="During an Earthquake",
                description="Immediate actions to take when an earthquake strikes",
                phase_type="response",
                order_index=3,
                estimated_minutes=10,
                is_required=True,
                content={
                    "type": "action_guide",
                    "steps": [
                        {
                            "action": "DROP",
                            "description": "Drop to your hands and knees immediately"
                        },
                        {
                            "action": "COVER",
                            "description": "Take cover under a sturdy desk or table"
                        },
                        {
                            "action": "HOLD ON",
                            "description": "Hold on to your shelter and protect your head and neck"
                        }
                    ]
                }
            )
        ]
        
        for phase in earthquake_phases:
            db.add(phase)
        
        # Create emergency contacts
        emergency_contacts = [
            EmergencyContact(
                name="Campus Security",
                role="Security Officer",
                phone="911",
                email="security@university.edu",
                department="University Security Office",
                priority=1,
                is_active=True
            ),
            EmergencyContact(
                name="Fire Department",
                role="Fire Chief",
                phone="911",
                department="City Fire Department",
                priority=1,
                is_active=True
            ),
            EmergencyContact(
                name="Medical Emergency",
                role="Emergency Medical Technician",
                phone="911",
                email="health@university.edu",
                department="Campus Health Services",
                priority=1,
                is_active=True
            ),
            EmergencyContact(
                name="Campus Emergency Coordinator",
                role="Emergency Manager",
                phone="+1-555-CAMPUS",
                email="emergency@university.edu",
                department="University Emergency Management",
                priority=2,
                is_active=True
            )
        ]
        
        for contact in emergency_contacts:
            db.add(contact)
        
        # Create a sample emergency alert
        sample_alert = EmergencyAlert(
            title="Weather Advisory",
            message="Severe thunderstorm warning in effect. Seek shelter indoors and avoid windows.",
            alert_type="weather",
            severity="MEDIUM",
            location="Campus-wide",
            is_active=True,
            created_by_id=admin_user.id,
            expires_at=datetime.utcnow() + timedelta(hours=6)
        )
        db.add(sample_alert)
        
        # Commit all changes
        db.commit()
        
        print("✅ Sample data created successfully!")
        print(f"✅ Admin user: admin@suraksha.edu (password: admin123)")
        print(f"✅ Student user: student@suraksha.edu (password: demo123)")
        print(f"✅ Created {len([earthquake_module, fire_module, flood_module])} disaster modules")
        print(f"✅ Created {len(emergency_contacts)} emergency contacts")
        print(f"✅ Created sample emergency alert")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(create_sample_data())