import cv2
from ultralytics import YOLO
import logging
import base64
import time
from ..redis_service import publish_message
from .frame_capture import capture_frames
from ..socketio_events import socketio
from ..utils import send_alert_email
from flask_socketio import SocketIO


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
FRAME_SKIP = 3
FRAME_RESET = 1 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

model = YOLO(YOLO_MODEL)

socketio = SocketIO(message_queue='redis://redis_container:6379/0')

def encode_frame_to_base64(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    frame_bytes = buffer.tobytes()
    return base64.b64encode(frame_bytes).decode('utf-8')

def start_yolo_detection(cctv_id, rtsp_url, location, institution_id):
    try:
        # print("detect_objects function started!", flush=True)
        frame_count = FRAME_RESET

        for frame in capture_frames(rtsp_url):
            frame_count += 1

            if frame_count % FRAME_SKIP == 0:
                resized_frame = cv2.resize(frame, (640, 640))
                # start_inference_time = time.time() 
                results = model(resized_frame, verbose=False)
                # inference_time = time.time() - start_inference_time
                # print(f"Inference Time: {inference_time:.4f} seconds", flush=True)


                detections = results[0].boxes.data.numpy() if len(results[0].boxes) > 0 else []

                detected = False
                weapon_type = "Unknown"

                for detection in detections:
                    class_id = int(detection[5])
                    confidence = detection[4]

                    if class_id in DETECTION_CLASSES and confidence > THRESHOLD:
                        detected = True
                        weapon_type = DETECTION_CLASSES.get(class_id, "Unknown")
                        break 

                if detected:
                    processed_frame = results[0].plot()
                    # processed_frame_base64 = encode_frame_to_base64(processed_frame)
                    alert_message = {
                        'message': 'Weapon detected!',
                        'camera_id': cctv_id,
                        'location': location,
                        # 'processed_frame': processed_frame_base64,
                        'weapon_type': weapon_type,
                        'institution_id': institution_id
                    }
                    print('detection published on Redis channel', flush=True)
                    # publish_message('weapon_alerts', alert_message)
                    socketio.emit("weapon_alert", alert_message)
                    send_alert_email(cctv_id,location)

                    frame_count = FRAME_RESET

    except Exception as e:
        logging.error(f"Error in Weapon detection: {str(e)}")

