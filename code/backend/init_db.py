from app import create_app
from app.extensions import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import inspect
from app.utils import seed_admin_function, seed_data

app = create_app()

with app.app_context():
    try:
        inspector = inspect(db.engine)

        if not inspector.has_table("users"):
            db.create_all()
            print("[INFO] Database tables created successfully.")
            seed_admin_function()
            seed_data()
        else:
            print("[INFO] Database already exists. Skipping table creation and seeding.")

    except SQLAlchemyError as e:
        print(f"[ERROR] Failed to create tables: {e}")
