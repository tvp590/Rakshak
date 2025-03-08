import subprocess
import logging
import os

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def start_stream(stream_id, rtsp_url):
    output_dir = f"./streams/{stream_id}"
    output_path = os.path.join(output_dir, "playlist.m3u8")

    os.makedirs(output_dir, exist_ok=True)

    is_local_file = rtsp_url.endswith((".mp4", ".avi", ".mkv", ".mov"))

    command = [
        "ffmpeg",
        "-loglevel", "info",
        "-rtsp_transport", "tcp",
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
