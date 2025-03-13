import subprocess
import logging
import os
from celery import shared_task
from ..redis_service import publish_message
from .frame_capture import capture_frames
from ..socketio_events import socketio
from ..utils import send_alert_email
from flask_socketio import SocketIO
import cv2
from ultralytics import YOLO
import base64
# from celery.contrib.abortable import AbortableTask

@shared_task()
def start_stream_task(stream_id, rtsp_url):
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    output_dir = f"./streams/{stream_id}"
    output_path = os.path.join(output_dir, "playlist.m3u8")

    os.makedirs(output_dir, exist_ok=True)
    is_local_file = rtsp_url.endswith((".mp4", ".avi", ".mkv", ".mov"))

    command = [
        "ffmpeg",
        "-loglevel", "info",
        "-re" if is_local_file else "",
        "-i", rtsp_url,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-f", "hls",
        "-hls_time", "2",
        "-hls_list_size", "5",
        "-hls_flags", "delete_segments",
        output_path
    ]
    #  "-rtsp_transport", "tcp",
    command = [arg for arg in command if arg]

    try:
        logging.info(f"Starting FFMPEG stream for {stream_id}...")
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        if process.returncode != 0:
            logging.error(f"Error in stream process: {stderr.decode()}")
        return process
    except Exception as e:
        logging.error(f"Failed to start stream {stream_id}: {str(e)}")



@shared_task()
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
    FRAME_SKIP = 4
    FRAME_RESET = 1

    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    model = YOLO(YOLO_MODEL)

    socketio = SocketIO(message_queue='redis://redis_container:6379/0')

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
                    socketio.emit("weapon_alert", alert_message)
                    # send_alert_email(cctv_id, location)

                    frame_count = FRAME_RESET

    except Exception as e:
        logging.error(f"Error in Weapon detection: {str(e)}")