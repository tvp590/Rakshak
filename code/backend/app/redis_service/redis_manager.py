import logging
from ..extensions import redis_client, socketio
import threading
import json

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def publish_message(channel, data):
    try:
        redis_client.publish(channel, json.dumps(data))
    except Exception as e:
        logging.error(f"Error publishing message to Redis: {str(e)}")


def subscriber():
    try:
        pubsub = redis_client.pubsub()
        pubsub.subscribe("weapon_alerts") 

        for message in pubsub.listen():
            if message and message["type"] == "message":
                try:
                    data = json.loads(message["data"])  
                    print(f"Received weapon alert: {data}", flush=True)

                    socketio.emit("weapon_alert", data)
                    print("Emitted weapon alert to WebSocket clients", flush=True)
                except json.JSONDecodeError as e:
                    print(f"Error decoding message: {e}")
    except Exception as e:
        logging.error(f"Error in subscriber thread: {str(e)}")

def start_redis_listener(channel='weapon_alerts'):
    try:
        print("✅ Starting Redis listener...", flush=True)
        listener_thread = threading.Thread(target=subscriber, daemon=True)
        listener_thread.start()
        print("✅ Redis listener started!", flush=True)
    except Exception as e:
        logging.error(f"Error starting Redis listener: {str(e)}")