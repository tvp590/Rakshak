import os
import time

def wait_for_hls_ready(cctv_id, timeout=10):
    output_dir = f"./streams/{cctv_id}"
    playlist_path = os.path.join(output_dir, "playlist.m3u8")
    start_time = time.time()

    while time.time() - start_time < timeout:
        if os.path.exists(playlist_path):
            ts_files = [f for f in os.listdir(output_dir) if f.endswith(".ts")]
            if ts_files:
                return True

    return False
