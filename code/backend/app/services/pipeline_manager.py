import multiprocessing
import logging
from .pipeline import run_pipeline

active_streams = {}

def start_all_streams(cctv_details, institution_id):
    global active_streams
    try:
        for cctv in cctv_details:
            if cctv['cctv_id'] in active_streams:
                logging.info(f"Stream for CCTV {cctv['cctv_id']} is already running.")
                continue

            try:
                p = multiprocessing.Process(
                    target=run_pipeline, 
                    args=(cctv['cctv_id'], cctv['rtsp_url'], cctv['location'], institution_id)
                )
                active_streams[cctv['cctv_id']] = p 
                p.start()
                logging.info(f"Started stream for CCTV {cctv['cctv_id']} (PID: {p.pid})")

            except Exception as e:
                logging.error(f"Error starting stream for {cctv['rtsp_url']}: {str(e)}")

    except Exception as e:
        logging.error(f"Error in start_all_streams: {str(e)}")

def stop_all_streams(active_streams):
    try:
        for cctv_id, p in active_streams.items():
            if p.is_alive():
                logging.info(f"Stopping stream for CCTV {cctv_id} (PID: {p.pid})")
                p.terminate()
                p.join() 
                logging.info(f"Stream for CCTV {cctv_id} stopped successfully.")
        
        active_streams.clear()
        logging.info("All streams stopped.")

    except Exception as e:
        logging.error(f"Error stopping all streams: {str(e)}")
