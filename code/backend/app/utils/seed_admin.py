import os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from ..models import User, RoleEnum
from ..extensions import db

load_dotenv()

bcrypt = Bcrypt()
ADMIN_NAME = os.getenv("ADMIN_NAME")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_ROLE = RoleEnum.superAdmin

if not (ADMIN_NAME and ADMIN_EMAIL and ADMIN_PASSWORD and ADMIN_ROLE):
    print("[ERROR] Admin credentials are missing in the .env file.")
    exit()

def seed_admin_function():
    try: 
        existing_admin = User.query.filter_by(email=ADMIN_EMAIL).first()
        if existing_admin:
            print("[INFO] Admin user already exists. Skipping creation.")
            return

        hashed_password = bcrypt.generate_password_hash(ADMIN_PASSWORD).decode('utf-8')
        admin_user = User(
                name=ADMIN_NAME,
                email=ADMIN_EMAIL,
                password=hashed_password,
                role=ADMIN_ROLE
        )
        db.session.add(admin_user)
        db.session.commit()
        print("[SUCCESS] Admin user created successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] An error occurred while creating the admin user: {str(e)}") 
