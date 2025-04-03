from flask import Blueprint, request, jsonify, send_from_directory
from flask_login import login_required, current_user
from ..utils import has_permission
from ..services import start_all_streams, stop_all_streams, start_individual_stream , stop_individual_stream
from ..models import CCTV, RoleEnum, get_cctv_details, get_cctv_by_id, create_rtsp_url
import os
from ..extensions import redis_client

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
        
        all_cctvs = CCTV.query.filter_by(institution_id=institution_id).all()
        active_streams = []

        for cctv in all_cctvs:
            redis_key = f"tasks:{cctv.id}"
            if redis_client.exists(redis_key):
                active_streams.append({
                    "cctv_id": cctv.id,
                    "stream_url": f"/streams/{cctv.id}/playlist.m3u8",
                    "location": cctv.location
                })

        return jsonify({"active_streams": active_streams}), 200
    
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

        cctv_details = get_cctv_details(institution_id)

        cctv_ids = [cctv['cctv_id'] for cctv in cctv_details]

        if not cctv_details:
            return({"error" : "No CCTV and RTSP URLs found. Aborting streaming."}), 400

        stop_all_streams(cctv_ids)

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
    

@stream_bp.route('/start-stream/<int:cctv_id>', methods=['POST'])
@login_required
def start_individual_stream_route(cctv_id):
    try:
        cctv = get_cctv_by_id(cctv_id)
        if not cctv:
            return jsonify({"error": "CCTV not found"}), 404
        
        if current_user.role == RoleEnum.superAdmin:
            institution_id = request.json.get("institution_id")
        else:
            institution_id = current_user.institution_id

        if not institution_id:
            return jsonify({"error": "Institution ID is required"}), 400
        
        if institution_id != cctv.institution_id:
            return jsonify({"error": "Unauthorized access to this CCTV"}), 403

        rtsp_URL = create_rtsp_url(cctv.username, cctv.password, cctv.ip_address)

        start_individual_stream(cctv_id, rtsp_URL, cctv.location, institution_id)

        return jsonify({"message": f"Stream {cctv_id} started"}), 200
    
    except Exception as e:
        print(f"Error starting stream {cctv_id}: {str(e)}")
        return jsonify({"error": "Failed to start individual stream"}), 500
    

@stream_bp.route('/stop-stream/<int:cctv_id>', methods=['POST'])
@login_required
def stop_individual_stream_route(cctv_id):
    try:
        stop_individual_stream(cctv_id)
        return jsonify({"message": f"Stream {cctv_id} stopped"}), 200

    except Exception as e:
        print(f"Error stopping stream {cctv_id}: {str(e)}")
        return jsonify({"error": "Failed to stop individual stream"}), 500
