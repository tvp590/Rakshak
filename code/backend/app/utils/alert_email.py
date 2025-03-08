import os
from flask_mail import Message
from ..extensions import mail
from dotenv import load_dotenv

def send_alert_email(camera_id, location, recipient=os.getenv("SMTP_MAIL_DEFAULT_RECIPIENT"), subject="Weapon Detected Alert"):
    try:
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
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")