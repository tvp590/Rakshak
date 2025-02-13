import time
import glob
import multiprocessing
from queue import Queue
from .rtsp_capture import capture_rtsp_feed
from .stream_preparation import write_to_mp4, convert_mp4_to_hls
from .processing import detect_objects
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_stream_pipeline(stream_id,rtsp_url):
    writer = None
    frame_count = 0
    frame_queue = multiprocessing.Queue()
    yolo_process = multiprocessing.Process(target=detect_objects, args=(frame_queue,))
    yolo_process.start()

    try:
        while True:
            for frame_idx, (frame, frame_delay) in enumerate(capture_rtsp_feed(rtsp_url)):
                if frame_idx % 3 == 0:
                    frame_queue.put((frame_idx, frame, stream_id))
                
                stream_id= str(stream_id)
                writer, frame_count = write_to_mp4(frame, stream_id, writer, frame_count)
                mp4_files = sorted(glob.glob(f"/app/streams/{stream_id}/*.mp4"))
                if len(mp4_files) > 1:  
                    convert_mp4_to_hls(mp4_files[0], stream_id) 

                time.sleep(frame_delay)

    except Exception as e:
            logging.error(f"Error during frame processing: {str(e)}")
    finally:
        frame_queue.put(None) 
        yolo_process.join()  

        if writer:
            writer.release()
