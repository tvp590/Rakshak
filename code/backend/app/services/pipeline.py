import logging
from ..extensions import redis_client
from celery.result import AsyncResult
from .tasks.stream_task import start_stream_task
from .tasks.detection_task import start_yolo_detection_task


def start_all_streams(cctv_details, institution_id):
    try:
        for cctv in cctv_details:
            task_ids = redis_client.hgetall(f"tasks:{cctv['cctv_id']}")
            if task_ids:
                logging.info(f"Stream for CCTV {cctv['cctv_id']} is already running.")
                continue

            try:
                stream_task = start_stream_task.apply_async(args=(cctv['cctv_id'], cctv['rtsp_url']))
                yolo_task = start_yolo_detection_task.apply_async(args=(cctv['cctv_id'], cctv['rtsp_url'], cctv['location'], institution_id))
                    
                redis_client.hset(f"tasks:{cctv['cctv_id']}", "stream_task_id", stream_task.id)
                redis_client.hset(f"tasks:{cctv['cctv_id']}", "yolo_task_id", yolo_task.id)
                logging.info(f"Started tasks for CCTV {cctv['cctv_id']} with task IDs: {stream_task.id}, {yolo_task.id}")

            except Exception as e:
                logging.error(f"Error starting tasks for CCTV {cctv['cctv_id']}: {str(e)}")

    except Exception as e:
        logging.error(f"Error in start_all_streams: {str(e)}")        


def stop_all_streams(cctv_ids):
    try:
        for cctv_id in cctv_ids:
            task_ids = redis_client.hgetall(f"tasks:{cctv_id}")
            if task_ids:
                stream_task_id = task_ids.get(b"stream_task_id")
                yolo_task_id = task_ids.get(b"yolo_task_id")
                
                stream_task = AsyncResult(stream_task_id)
                yolo_task = AsyncResult(yolo_task_id)

                if stream_task.state != 'SUCCESS':
                    stream_task.revoke(terminate=True)
                if yolo_task.state != 'SUCCESS':
                    yolo_task.revoke(terminate=True)

                redis_client.hdel(f"tasks:{cctv_id}", "stream_task_id", "yolo_task_id")
                logging.info(f"Stopped tasks for CCTV {cctv_id}")
                
    except Exception as e:
        logging.error(f"Error stopping all streams: {str(e)}")


def start_individual_stream(cctv_id, rtsp_url, location, institution_id):
    try:
        task_ids = redis_client.hgetall(f"tasks:{cctv_id}")
        if task_ids:
            logging.info(f"Stream for CCTV {cctv_id} is already running.")
            return
        
        try:
            stream_task = start_stream_task.apply_async(args=(cctv_id, rtsp_url))
            yolo_task = start_yolo_detection_task.apply_async(args=(cctv_id, rtsp_url, location, institution_id))

            redis_client.hset(f"tasks:{cctv_id}", "stream_task_id", stream_task.id)
            redis_client.hset(f"tasks:{cctv_id}", "yolo_task_id", yolo_task.id)

            logging.info(f"Started tasks for CCTV {cctv_id} with task IDs: {stream_task.id}, {yolo_task.id}")

        except Exception as e:
            logging.error(f"Error starting tasks for CCTV {cctv_id}: {str(e)}")

    except Exception as e:
        logging.error(f"Error in start_individual_stream: {str(e)}")


def stop_individual_stream(cctv_id):
    try:
        task_ids = redis_client.hgetall(f"tasks:{cctv_id}")
        if not task_ids:
            logging.info(f"No tasks found for CCTV {cctv_id}")
            return
        
        stream_task_id = task_ids.get(b"stream_task_id")
        yolo_task_id = task_ids.get(b"yolo_task_id")

        stream_task = AsyncResult(stream_task_id)
        yolo_task = AsyncResult(yolo_task_id)

        if stream_task.state != 'SUCCESS':
            stream_task.revoke(terminate=True)
        if yolo_task.state != 'SUCCESS':
            yolo_task.revoke(terminate=True)

        redis_client.hdel(f"tasks:{cctv_id}", "stream_task_id", "yolo_task_id")

        logging.info(f"Stopped tasks for CCTV {cctv_id}")
    
    except Exception as e:
        logging.error(f"Error stopping tasks for CCTV {cctv_id}: {str(e)}")
