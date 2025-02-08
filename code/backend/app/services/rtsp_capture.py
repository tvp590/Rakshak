import cv2
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def capture_rtsp_feed(rtsp_url):
    try:
        cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
        if not cap.isOpened():
            logging.error(f"Error: Unable to open RTSP stream from {rtsp_url}")
            return

        stream_fps = 30
        frame_delay = 1 / stream_fps
        cap.set(cv2.CAP_PROP_FPS, 30)  

        while True:
            ret, frame = cap.read()
            if not ret:
                logging.warning(f"⚠️ Warning: Failed to grab frame from {rtsp_url}")
                break
            yield frame, frame_delay

    except Exception as e:
        logging.error(f"Exception in capture_rtsp_feed: {str(e)}")

    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()
            logging.info(f"RTSP stream {rtsp_url} released successfully.")
