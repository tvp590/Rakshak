import subprocess
import logging
import os
import signal
from celery import shared_task
from ...extensions import redis_client

@shared_task(queue="celery")
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
        process = subprocess.Popen(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            preexec_fn=os.setsid
        )

        redis_client.hset(f"tasks:{stream_id}", "ffmpeg_pid", process.pid)

        return {"status": "started", "stream_id": stream_id, "pid": process.pid}
    except Exception as e:
        logging.error(f"Failed to start FFmpeg for {stream_id}: {str(e)}")
        return {"status": "error", "stream_id": stream_id, "error": str(e)}
