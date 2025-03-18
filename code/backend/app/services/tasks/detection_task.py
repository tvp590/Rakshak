import logging
from celery import shared_task
from app.redis_service import publish_message
from app.services import capture_frames
from app.socketio_events import socketio
from app.services.tasks.email_task import send_alert_email
import cv2
from ultralytics import YOLO
import base64

@shared_task(queue="celery")
def start_yolo_detection_task(cctv_id, rtsp_url, location, institution_id):
    YOLO_MODEL = "app/yolo_model/best.pt"
    DETECTION_CLASSES = {
        0: 'automatic-rifle',
        3: 'pistol',
        4: 'revolver',
        5: 'shotgun',
        6: 'sniper-rifle',
        7: 'submachine-gun',
    }
    THRESHOLD = 0.4
    FRAME_SKIP = 5
    FRAME_RESET = 1

    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    model = YOLO(YOLO_MODEL)

    def encode_frame_to_base64(frame):
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        return base64.b64encode(frame_bytes).decode('utf-8')

    try:
        frame_count = FRAME_RESET

        for frame in capture_frames(rtsp_url):
            frame_count += 1

            if frame_count % FRAME_SKIP == 0:
                resized_frame = cv2.resize(frame, (640, 640))
                results = model(resized_frame, verbose=False)
                detections = results[0].boxes.data.numpy() if len(results[0].boxes) > 0 else []

                detected = False
                weapon_type = "Unknown"
                print(detections, flush=True)
                for detection in detections:
                    class_id = int(detection[5])
                    confidence = detection[4]

                    if class_id in DETECTION_CLASSES and confidence > THRESHOLD:
                        detected = True
                        weapon_type = DETECTION_CLASSES.get(class_id, "Unknown")
                        break 

                if detected:
                    processed_frame = results[0].plot()
                    alert_message = {
                        'message': 'Weapon detected!',
                        'camera_id': cctv_id,
                        'location': location,
                        'weapon_type': weapon_type,
                        'institution_id': institution_id
                    }
                    publish_message("weapon_alerts",alert_message)
                    send_alert_email.apply_async(args=(cctv_id, location))

                    frame_count = FRAME_RESET
        return {"status": "completed"}

    except Exception as e:
        logging.error(f"Error in Weapon detection: {str(e)}")
        return {"status": "error", "error": str(e)}