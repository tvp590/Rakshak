from celery import shared_task
from ...models import Alert
from ...extensions import db
from sqlalchemy import and_
from datetime import datetime, timezone, timedelta

DUPLICATE_TIME_WINDOW = 1 

@shared_task(queue="celery")
def save_alert(cctv_id, location, weapon_type, image_path, institution_id):
    try:
        now_utc = datetime.now(timezone.utc)
        time_threshold = now_utc - timedelta(minutes=DUPLICATE_TIME_WINDOW)

        existing_alert = Alert.query.filter(
            and_(
                Alert.cctv_id == cctv_id,
                Alert.weapon_type == weapon_type,
                Alert.location == location,
                Alert.created_at >= time_threshold
            )
        ).first()

        if existing_alert:
            print("⚠️ Duplicate Alert Detected! Not inserting into DB.")
            return {"status": "duplicate", "alert_id": existing_alert.id}
        
        new_alert = Alert(
            cctv_id=cctv_id,
            institution_id=institution_id,
            weapon_type=weapon_type,
            image_path=image_path,
            location=location,
            status="Pending",
            is_active=True,
            created_at=now_utc
        )

        db.session.add(new_alert)
        db.session.commit()
        return {"status": "success", "alert_id": new_alert.id}
    
    except Exception as e:
        db.session.rollback()
        print(f"Error saving alert to database: {e}")
        return {"status": "error", "error": str(e)}
