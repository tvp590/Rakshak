import os
from flask_mail import Message
from app.extensions import mail
from celery import shared_task

@shared_task(queue="celery")
def send_alert_email(camera_id, location, image_path, recipient=None, subject="Weapon Detected Alert"):
    try:
        recipient = recipient or os.getenv("SMTP_MAIL_DEFAULT_RECIPIENT")

        if not recipient:
            print("SMTP_MAIL_DEFAULT_RECIPIENT is not set in environment variables.")
            return
        
        body = f"""
        🚨 <strong>Weapon Detected Alert</strong>
        <br/>
        <br/>
    
        A weapon has been detected in the CCTV footage. Please take immediate action.
        
        <br/>
        <br/>

        <strong>Camera ID:</strong> {camera_id} <br/>
        <br/>
        <strong>Location:</strong> {location}

        <br/>
        <br/>

        Please review the situation and respond accordingly.
        
        <br/>
        <br/>

        Thank you,<br/>
        Your Security System <br/>
        """
        msg = Message(subject, recipients=[recipient])
        msg.body = body
        msg.html = body

        if os.path.exists(image_path):
            with open(image_path, 'rb') as img_file:
                img_data = img_file.read()
                msg.attach(f"{os.path.basename(image_path)}", "image/jpeg", img_data)

            mail.send(msg)
            return {"status": "email_sent"}
        else:
            return {"status": "error", "error": "Image file not found"}
    except Exception as e:
        print(f"Error sending email: {e}")
        return {"status": "error", "error": str(e)}