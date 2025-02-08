from flask_socketio import emit
from ..extensions import socketio
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@socketio.on('connect')
def handle_connect():
    logging.info("Client connected")
    emit('server_message', {'message': 'Welcome! Connected to the server.'})

@socketio.on('disconnect')
def handle_disconnect():
    logging.info("Client disconnected")
    