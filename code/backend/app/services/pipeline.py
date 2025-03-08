import logging
import multiprocessing
import time
from .stream_handler import start_stream
from .yolo_handler import start_yolo_detection

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_pipeline(cctv_id, rtsp_url, location, institution_id):
    try:
        logging.info(f"Starting pipeline for CCTV {cctv_id} at {location}")

        stream_process = multiprocessing.Process(target=start_stream, args=(cctv_id, rtsp_url))
        yolo_process = multiprocessing.Process(target=start_yolo_detection, args=(cctv_id, rtsp_url, location, institution_id))

        stream_process.start()
        yolo_process.start()

        while True:
            if not stream_process.is_alive():
                logging.error(f"Stream process for CCTV {cctv_id} crashed. Restarting...")
                stream_process = multiprocessing.Process(target=start_stream, args=(cctv_id, rtsp_url))
                stream_process.start()

            if not yolo_process.is_alive():
                logging.error(f"YOLO detection process for CCTV {cctv_id} crashed. Restarting...")
                yolo_process = multiprocessing.Process(target=start_yolo_detection, args=(cctv_id, rtsp_url, location, institution_id))
                yolo_process.start()

            time.sleep(2)

    except Exception as e:
        logging.error(f"Error in run_pipeline for CCTV {cctv_id}: {str(e)}")

    finally:
        if stream_process.is_alive():
            stream_process.terminate()
            stream_process.join()
        if yolo_process.is_alive():
            yolo_process.terminate()
            yolo_process.join()
        logging.info(f"Exiting pipeline for CCTV {cctv_id}.")

