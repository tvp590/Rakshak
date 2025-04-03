from ..extensions import db
from ..models import User, RoleEnum, CCTV, Institution, Alert
import os

def seed_data():
    try:
        # Check if data already exists
        if db.session.query(User).count() > 1:
            print("[INFO] Database already seeded. Skipping...")
            return

        print("[INFO] Seeding database...")

        # Seed Institutions
        institution1 = Institution(name="Regina University", email="contact@uregina.ca", phone="1234567890", address="Regina, SK")
        institution1.set_institution_password("password123")
        
        institution2 = Institution(name="Sask Polytechnic", email="admin@saskpoly.ca", phone="9876543210", address="Saskatoon, SK")
        institution2.set_institution_password("password456")

        db.session.add_all([institution1, institution2])
        db.session.commit()

        # Seed Users
        user1 = User(name="Patel T", email="Patel.T@uregina.ca", role=RoleEnum.siteAdmin, institution_id=institution1.id)
        user1.set_password("secure123")
        
        user2 = User(name="Tirth P", email="Tirth.P@saskpoly.ca", role=RoleEnum.user, institution_id=institution2.id)
        user2.set_password("secure456")

        db.session.add_all([user1, user2])
        db.session.commit()

        # Seed CCTVs
        cctv1 = CCTV(name="Main Entrance", location="Main Entrance", ip_address=os.getenv('CCTV_IP'), username=os.getenv('CCTV_USERNAME'), password=os.getenv('CCTV_PASSWORD'), institution_id=institution1.id)

        cctv2 = CCTV(name="Library", location="Classroom Building", ip_address=os.getenv('CCTV_IP_2'), username=os.getenv('CCTV_USERNAME_2'), password=os.getenv('CCTV_PASSWORD_2'), institution_id=institution1.id)

        cctv3 = CCTV(name="Back Entrance", location="Main Floor", ip_address="192.168.1.111", username="admin", password="cctv123", institution_id=institution2.id)

        db.session.add_all([cctv1, cctv2, cctv3])
        db.session.commit()

        # Seed Alerts
        alert1 = Alert(weapon_type="Pistol", status="Pending", is_active=True, cctv_id=cctv1.id, institution_id=institution1.id)
        alert2 = Alert(weapon_type="Gun", status="Resolved", is_active=False, cctv_id=cctv2.id, institution_id=institution1.id)

        db.session.add_all([alert1, alert2])
        db.session.commit()

        print("[INFO] Seeding completed successfully!")

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Seeding failed: {e}")

# Run seeding if script is executed directly
if __name__ == "__main__":
    seed_data()
