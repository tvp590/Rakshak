import cv2
import os
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def capture_frames(rtsp_url):
    try:
        os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "timeout;60000" 
        cap = cv2.VideoCapture(rtsp_url, cv2.CAP_ANY)
        if not cap.isOpened():
            logging.error(f"Error: Unable to open RTSP stream from {rtsp_url}")
            return

        while True:
            ret, frame = cap.read()
            if not ret:
                logging.warning(f"⚠️ Warning: Failed to grab frame from {rtsp_url}")
                break
            yield frame

    except Exception as e:
        logging.error(f"Exception in capture_rtsp_feed: {str(e)}")

    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()
            logging.info(f"RTSP stream {rtsp_url} released successfully.")
