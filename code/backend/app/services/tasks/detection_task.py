import logging
import cv2
from celery import shared_task
from ultralytics import YOLO
from app.services import capture_frames
from .process_alert_task import save_alert_and_notify
from ..save_image import save_image

@shared_task(queue="celery")
def start_yolo_detection_task(cctv_id, rtsp_url, location, institution_id):
    model = YOLO("app/yolo_model/best.pt")
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

    try:
        frame_count = FRAME_RESET

        for frame in capture_frames(rtsp_url):
            frame_count += 1
            if frame_count % FRAME_SKIP == 0:
                resized_frame = cv2.resize(frame, (640, 640))
                results = model(resized_frame, verbose=False)
                detections = results[0].boxes.data.numpy() if len(results[0].boxes) > 0 else []
                print(detections, flush=True)
                detected = False
                for detection in detections:
                    class_id = int(detection[5])
                    confidence = detection[4]
                    if class_id in DETECTION_CLASSES and confidence > THRESHOLD:
                        detected = True
                        weapon_type = DETECTION_CLASSES.get(class_id, "Unknown")
                        break

                if detected:
                    processed_frame = results[0].plot()
                    image_path = save_image(processed_frame, institution_id)
                    save_alert_and_notify.apply_async(
                        args=(cctv_id, location, weapon_type, image_path, institution_id)
                    )
                    frame_count = FRAME_RESET

        return {"status": "completed"}

    except Exception as e:
        logging.error(f"Error in detection for CCTV {cctv_id}: {str(e)}")
        return {"status": "error", "error": str(e)}
