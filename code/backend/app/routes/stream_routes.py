from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..utils import has_permission
from ..services import start_all_streams
from ..models import CCTV, RoleEnum

stream_bp = Blueprint('stream', __name__)

@stream_bp.route('/start-streams', methods=['POST'])
@login_required
def start_streams():
    try:
        if not has_permission():
            return jsonify({"message": "Unauthorized access"}), 403
        
        if current_user.role == RoleEnum.superAdmin:
            data = request.get_json()
            institution_id = data.get('institution_id')
        else: 
            institution_id = current_user.institution_id

        if not institution_id:
            return jsonify({"error": "Institution ID is required"}), 400

        start_all_streams(institution_id)

        return jsonify({"message": "Streams started successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to start streams"}), 500
    

@stream_bp.route('/active-streams', methods=['GET'])
@login_required
def get_active_streams():
    try:
        if current_user.role == RoleEnum.superAdmin:
            data = request.get_json()
            institution_id = data.get('institution_id')
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
                    "stream_url": f"/stream/{cctv.stream_id}/playlist.m3u8",
                    "location": cctv.location
                }
            )

        return jsonify({"active_streams": streams}), 200
    
    except Exception as e:
        return jsonify({"error": "Failed to fetch active streams"}), 500
