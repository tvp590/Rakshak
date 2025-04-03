from celery import shared_task, chain
from app.services.tasks.email_task import send_alert_email
from app.redis_service import publish_message
from .save_alert_task import save_alert

@shared_task(queue="celery")
def save_alert_and_notify(cctv_id, location, weapon_type, image_path , institution_id):
    try:
        result = chain(
            save_alert.s(cctv_id, location, weapon_type, image_path, institution_id),
            process_alert_result.s(location, weapon_type, cctv_id, image_path)
        ).apply_async()

        return {"status": "processing"} 
        
    except Exception as e:
        print(f"Error saving frame and sending alert: {e}")
        return {"status": "error", "error": str(e)}
    

@shared_task(queue="celery")
def process_alert_result(alert_result, location, weapon_type, cctv_id, image_path):
    try:
        db_status = alert_result.get("status", "db_error")

        alert_message = {
            'location': location,
            'weapon_type': weapon_type,
            'cctv_id' : cctv_id
        }
        publish_message("weapon_alerts", alert_message)

        send_alert_email.apply_async(args=(cctv_id, location, image_path))

        return {"status": "completed" if db_status in ["success", "duplicate"] else "db_error"}
    
    except Exception as e:
        print(f"Error processing alert result: {e}")
        return {"status": "error", "error": str(e)}