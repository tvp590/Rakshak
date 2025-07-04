from flask import Blueprint, jsonify, request, send_from_directory,render_template
from ..extensions import db
from flask_login import login_required, current_user
from ..models import CCTV, Institution, RoleEnum, get_cctv_by_id, get_cctv_details
from ..utils import has_permission

cctv_bp = Blueprint('cctv_bp', __name__)

# CREATE - Add a new CCTV
@cctv_bp.route('/register', methods=['POST'])
@login_required
def register_cctv():
    try:
        data = request.get_json()
        institution_id = data.get('institution_id')
        if not institution_id or not (Institution.query.filter_by(id=institution_id).first()):
            return jsonify({"message": "Institution not found"}), 404
    
        if not has_permission(institution_id=institution_id):
            return jsonify({"message": "Unauthorized access"}), 403

        name = data.get('name')
        location = data.get('location')
        ip_address = data.get('ip_address')
        username = data.get('username')
        password = data.get('password')

        if not all([name, location, ip_address, username, password]):
            return jsonify({"message": "Missing fields"}), 400

        if CCTV.query.filter_by(ip_address=ip_address).first():
            return jsonify({"message": "CCTV with this IP address already exists"}), 409

        new_cctv = CCTV(
            name=name,
            location=location,
            ip_address=ip_address,
            username=username,
            institution_id=institution_id,
            password=password
        )

        db.session.add(new_cctv)
        db.session.commit()
        return jsonify({"message": "CCTV registered successfully", "cctv": new_cctv.serialize()}), 201

    except Exception as e:
        db.session.rollback()  # Rollback in case of failure
        return jsonify({"message": "An error occurred while registering the CCTV", "error": str(e)}), 500


# READ - Get a list of all CCTVs
@cctv_bp.route('/all', methods=['GET'])
@login_required
def get_all_cctvs():
    try:
        if current_user.role == RoleEnum.superAdmin:
            cctvs = CCTV.query.all()
        elif current_user.role == RoleEnum.siteAdmin:
            institution = Institution.query.filter_by(id=current_user.institution_id).first()
            if not institution:
                return jsonify({"message": "Institution not found. Cannot get CCTVs"}), 404
            cctvs = CCTV.query.filter_by(institution_id=institution.id).all()
        else:
            return jsonify({"message": "Unauthorized access"}), 403

        cctv_list = [cctv.serialize() for cctv in cctvs]

        return jsonify(cctv_list), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while retrieving CCTVs", "error": str(e)}), 500


# READ - Get a specific CCTV by ID
@cctv_bp.route('/<int:id>', methods=['GET'])
@login_required
def get_cctv(id):
    try:
        cctv = get_cctv_by_id(id)
        if not cctv:
            return jsonify({"message": "CCTV not found"}), 404
        
        if not has_permission(institution_id=cctv.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403

        return jsonify(cctv.serialize()), 200
        
    except Exception as e:
        return jsonify({"message": "An error occurred while retrieving the CCTV", "error": str(e)}), 500


# UPDATE - Update a CCTV by ID
@cctv_bp.route('/<int:id>', methods=['PATCH'])
@login_required
def update_cctv(id):
    try:
        cctv = get_cctv_by_id(id)
        if not cctv:
            return jsonify({"message": "CCTV not found"}), 404
        
        if not has_permission(institution_id=cctv.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403

        data = request.get_json()
        cctv.name = data.get('name', cctv.name)
        cctv.location = data.get('location', cctv.location)
        cctv.ip_address = data.get('ip_address', cctv.ip_address)
        cctv.username = data.get('username', cctv.username)
        cctv.is_active = data.get('is_active', cctv.is_active)
        cctv.password = data.get('password', cctv.password)
        
        db.session.commit()
        return jsonify({"message": "CCTV updated successfully", "cctv": cctv.serialize()}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating the CCTV", "error": str(e)}), 500
    

# DELETE - Delete a CCTV by ID
@cctv_bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_cctv(id):
    try:
        cctv = get_cctv_by_id(id)
        if not cctv:
            return jsonify({"message": "CCTV not found"}), 404
    
        if not has_permission(institution_id=cctv.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403
        
        db.session.delete(cctv)
        db.session.commit()
        return jsonify({"message": "CCTV deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while deleting the CCTV", "error": str(e)}), 500

