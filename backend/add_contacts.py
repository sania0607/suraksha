from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import EmergencyContact
from app.core.config import settings

# Create engine and session
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def add_emergency_contacts():
    db = SessionLocal()
    
    try:
        # Check if contacts already exist
        existing_contacts = db.query(EmergencyContact).count()
        if existing_contacts > 0:
            print(f"✅ {existing_contacts} emergency contacts already exist in database")
            return
        
        # Create emergency contacts
        contacts = [
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
        
        for contact in contacts:
            db.add(contact)
        
        db.commit()
        print(f"✅ Successfully added {len(contacts)} emergency contacts to database")
        
        # List all contacts
        all_contacts = db.query(EmergencyContact).all()
        print(f"📞 Emergency Contacts in Database:")
        for contact in all_contacts:
            print(f"   - {contact.name} ({contact.role}): {contact.phone}")
            
    except Exception as e:
        print(f"❌ Error adding contacts: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_emergency_contacts()