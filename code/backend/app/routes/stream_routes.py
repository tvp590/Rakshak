from flask import Blueprint, request, jsonify, send_from_directory
from flask_login import login_required, current_user
from ..utils import has_permission
from ..services import start_all_streams, stop_all_streams
from ..models import CCTV, RoleEnum, get_cctv_details
import os
from ..socketio_events import socketio

stream_bp = Blueprint('stream', __name__)

@stream_bp.route('/start-streams', methods=['POST'])
@login_required
def start_streams():
    try:
        if current_user.role == RoleEnum.superAdmin:
            data = request.get_json()
            institution_id = data.get('institution_id')
        else: 
            institution_id = current_user.institution_id

        if not institution_id:
            return jsonify({"error": "Institution ID is required"}), 400

        if not has_permission(institution_id=institution_id):
            return jsonify({"message": "Unauthorized access"}), 403
        
        cctv_details = get_cctv_details(institution_id)

        if not cctv_details:
            return({"error" : "No CCTV and RTSP URLs found. Aborting streaming."}), 400

        start_all_streams(cctv_details, institution_id)

        return jsonify({"message": "Streams started successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to start streams"}), 500
    

@stream_bp.route('/active-streams', methods=['GET'])
@login_required
def get_active_streams():
    try:
        if current_user.role == RoleEnum.superAdmin:
             institution_id = request.args.get('institution_id')
        else: 
            institution_id = current_user.institution_id

        if not institution_id:
            return jsonify({"error": "Institution ID is required"}), 400
        
        active_streams = CCTV.query.filter_by(institution_id=institution_id, is_active=True).all()
        if not active_streams:
            return jsonify({"message": "No active CCTV streams found"}), 200
        
        streams = []
        for cctv in active_streams:
            streams.append(
                {
                    "cctv_id": cctv.id,
                    "stream_url": f"/streams/{cctv.id}/playlist.m3u8",
                    "location": cctv.location
                }
            )

        return jsonify({"active_streams": streams}), 200
    
    except Exception as e:
        print("Error fetching active streams:", e)
        return jsonify({"error": str(e)}), 500

@stream_bp.route('/stop-streams', methods=['POST'])
@login_required
def stop_streams():
    try:
        if current_user.role == RoleEnum.superAdmin:
            data = request.get_json()
            institution_id = data.get('institution_id')
        else: 
            institution_id = current_user.institution_id

        if not institution_id:
            return jsonify({"error": "Institution ID is required"}), 400
        
        if not has_permission(institution_id=institution_id):
            return jsonify({"message": "Unauthorized access"}), 403

        stop_all_streams()

        return jsonify({"message": "Streams stopped successfully!"}), 200
    except Exception as e:
        print(f"Error in stop_streams endpoint: {str(e)}")
        return jsonify({"error": "Failed to stop streams"}), 500


@stream_bp.route('/streams/<int:stream_id>/playlist.m3u8', methods=['GET'])
@login_required
def serve_playlist(stream_id):
    try:
        stream_dir = os.path.join("/app/streams", str(stream_id))
        return send_from_directory(stream_dir, "playlist.m3u8", mimetype='application/vnd.apple.mpegurl')
    except Exception as e:
        return jsonify({"error": f"Failed to serve playlist: {str(e)}"}), 500
