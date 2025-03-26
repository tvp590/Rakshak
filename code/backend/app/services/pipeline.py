import logging
import os
import signal
from celery.result import AsyncResult
from ..extensions import redis_client
from .tasks.stream_task import start_stream_task
from .tasks.detection_task import start_yolo_detection_task


def _is_stream_running(cctv_id):
    redis_key = f"tasks:{cctv_id}"
    return redis_client.exists(redis_key)


def _save_task_to_redis(cctv_id, stream_task_id, yolo_task_id):
    redis_key = f"tasks:{cctv_id}"
    redis_client.hset(redis_key, mapping={
        "stream_task_id": stream_task_id,
        "yolo_task_id": yolo_task_id
    })


def _revoke_celery_task(task_id):
    task = AsyncResult(task_id)
    if task.state not in ("SUCCESS", "FAILURE", "REVOKED"):
        task.revoke(terminate=True, signal="SIGTERM")
        logging.info(f"Revoked task {task_id}")


def start_individual_stream(cctv_id, rtsp_url, location, institution_id):
    if _is_stream_running(cctv_id):
        logging.info(f"Stream for CCTV {cctv_id} is already running.")
        return

    try:
        stream_task = start_stream_task.apply_async(args=(cctv_id, rtsp_url))
        yolo_task = start_yolo_detection_task.apply_async(
            args=(cctv_id, rtsp_url, location, institution_id)
        )

        _save_task_to_redis(cctv_id, stream_task.id, yolo_task.id)

        logging.info(f"Started tasks for CCTV {cctv_id}: {stream_task.id}, {yolo_task.id}")
    except Exception as e:
        logging.error(f"Error starting stream for CCTV {cctv_id}: {str(e)}")


def stop_individual_stream(cctv_id):
    redis_key = f"tasks:{cctv_id}"
    task_data = redis_client.hgetall(redis_key)

    if not task_data:
        logging.info(f"No tasks found for CCTV {cctv_id}")
        return

    try:
        if b"ffmpeg_pid" in task_data:
            pid = int(task_data[b"ffmpeg_pid"])
            try:
                os.killpg(pid, signal.SIGKILL)
                logging.info(f"Killed FFmpeg for CCTV {cctv_id}")
            except Exception as e:
                logging.error(f"Error killing FFmpeg: {str(e)}")

        for task_key in [b"stream_task_id", b"yolo_task_id"]:
            if task_key in task_data:
                _revoke_celery_task(task_data[task_key].decode())

        redis_client.delete(redis_key)
        logging.info(f"Cleaned up Redis for CCTV {cctv_id}")
    except Exception as e:
        logging.error(f"Error stopping stream for CCTV {cctv_id}: {str(e)}")


def start_all_streams(cctv_details, institution_id):
    for cctv in cctv_details:
        start_individual_stream(
            cctv_id=cctv["cctv_id"],
            rtsp_url=cctv["rtsp_url"],
            location=cctv["location"],
            institution_id=institution_id
        )


def stop_all_streams(cctv_ids):
    for cctv_id in cctv_ids:
        stop_individual_stream(cctv_id)
