import os
import uuid
import cv2
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def save_image(frame,institution_id):
    try:
        unique_id = str(uuid.uuid4())
        image_dir = f"./images/{institution_id}"
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)

        image_filename = f"{unique_id}.jpg"
        image_path = os.path.join(image_dir, image_filename)
        
        cv2.imwrite(image_path, frame)

        return image_path
    except Exception as e:
        logging.error(f"Error saving image: {e}")
        return None
