import logging
from flask_socketio import emit
from ..extensions import socketio

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


@socketio.on("connect")
def handle_connect():
    logging.info("Client connected")
    emit("server_message", {"message": "Welcome! Connected to the server."})

@socketio.on("disconnect")
def handle_disconnect():
    logging.info("❌ Client disconnected")

@socketio.on("weapon_alert")
def handle_weapon_alert(data):
    logging.info(f"🚨 Weapon detected: {data['weapon_type']} at {data['location']} from camera {data['camera_id']}")
    
    emit(
        "weapon_alert",
        {
            "message": "Weapon detected!",
            "camera_id": data["camera_id"],
            "location": data["location"],
            "weapon_type": data["weapon_type"],
            "institution_id": data["institution_id"]
        },
        broadcast=True
    )
    logging.info("Emitted weapon alert")
