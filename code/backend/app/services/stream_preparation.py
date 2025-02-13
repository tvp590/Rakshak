import cv2
import os
from datetime import datetime
import subprocess
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


HLS_OUTPUT_DIR = "/app/streams"
FPS = 30
VIDEO_DURATION = 10  

def write_to_mp4(frame, stream_id, writer, frame_count):
    try:
        stream_dir = os.path.join(HLS_OUTPUT_DIR, stream_id)
        os.makedirs(stream_dir, exist_ok=True)

        if writer is None or frame_count >= FPS * VIDEO_DURATION:
            # Create a new .mp4 file every 10 seconds
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            mp4_filename = f"segment_{timestamp}.mp4"
            mp4_path = os.path.join(stream_dir, mp4_filename)

            writer = cv2.VideoWriter(mp4_path, cv2.VideoWriter_fourcc(*"mp4v"), FPS, (frame.shape[1], frame.shape[0]))
            frame_count = 0
            print(f"Started new segment: {mp4_filename}")

        writer.write(frame)
        frame_count += 1
        return writer, frame_count
    
    except Exception as e:
        logging.error(f"Error in write_to_mp4: {str(e)}")
        return writer, frame_count

def convert_mp4_to_hls(mp4_path, stream_id):
    """ Converts an MP4 file to HLS format using FFmpeg """
    try:
        stream_dir = os.path.join(HLS_OUTPUT_DIR, stream_id)
        os.makedirs(stream_dir, exist_ok=True)

        playlist_path = os.path.join(stream_dir, "playlist.m3u8")

        cmd = [
            "ffmpeg", "-y",
            "-i", mp4_path,  # Input .mp4 file
            "-c:v", "libx264", "-preset", "ultrafast",  # Fast encoding
            "-crf", "23",  # Quality factor
            "-hls_time", "2",  # 2-second segments
            "-hls_list_size", "5",  # Keep last 5 segments
            "-hls_flags", "append_list",  
            "-f", "hls",
            playlist_path  # Output HLS playlist
        ]

        subprocess.run(cmd, check=True)
        print(f"✅ Converted {mp4_path} to HLS format!")

        os.remove(mp4_path)

    except subprocess.CalledProcessError as e:
        logging.error(f"FFmpeg error while converting {mp4_path} to HLS: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error in convert_mp4_to_hls: {str(e)}")