import cv2
from ultralytics import YOLO
import logging
from ..models import get_cctv_by_id
import base64
from ..extensions import socketio


YOLO_MODEL = "app/yolo_model/best.pt"
DETECTION_CLASSES = {0, 3, 4, 5, 6, 7} 
THRESHOLD = 0.5 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

model = YOLO(YOLO_MODEL)

def detect_objects(frame_queue):
    try:
        while True:
            frame_id, frame, cctv_id = frame_queue.get()
            if frame is None:
                break

            resized_frame = cv2.resize(frame, (640, 640)) 
            results = model(resized_frame, verbose=False)
            
            detections = results[0].boxes.data.numpy() if len(results[0].boxes) > 0 else []
            
            detected = any(
                int(detection[5]) in DETECTION_CLASSES and detection[4] > THRESHOLD
                for detection in detections
            )
        
            if detected:
                processed_frame = results[0].plot()
                processed_frame_base64 = encode_frame_to_base64(processed_frame)

                cctv = get_cctv_by_id(cctv_id)
                if cctv:
                    location = cctv.location
                else:
                    location = "Unknown"

                print("Weapon detected!")
                socketio.emit('weapon_alert', {
                    'message': 'Weapon detected!',
                    'camera_id': cctv_id,
                    'location': location,
                    'processed_frame': processed_frame_base64
                })
    
    except Exception as e:
        logging.error(f"Error in detect_objects: {str(e)}")

def encode_frame_to_base64(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    frame_bytes = buffer.tobytes()
    return base64.b64encode(frame_bytes).decode('utf-8')