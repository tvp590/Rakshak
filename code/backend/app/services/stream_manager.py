import multiprocessing
import logging
from .stream_pipeline import run_stream_pipeline
from ..models import get_cctv_details

def start_all_streams(institution_id):
    try:
        cctv_details = get_cctv_details(institution_id)

        if not cctv_details:
            logging.warning("No CCTV and RTSP URLs found. Aborting streaming.")
            return
        
        processes = []

        for cctv_id, rtsp_url in cctv_details:
            try:
                p = multiprocessing.Process(target=run_stream_pipeline, args=(cctv_id, rtsp_url))
                processes.append(p)
                p.start()
            except Exception as e:
                logging.error(f"Error starting stream for {rtsp_url}: {str(e)}")

        for p in processes:
            p.join()

        logging.info("All streams have started successfully.")

    except Exception as e:
        logging.error(f"Error in start_all_streams: {str(e)}")
