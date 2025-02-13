from flask import Blueprint, request, jsonify
from ..extensions import db
from flask_login import login_required, current_user
from ..utils import has_permission
from ..models import Alert, RoleEnum, Institution, get_institution_by_id, get_alert_by_id, get_cctv_by_id
import datetime

alert_bp = Blueprint('alert_bp', __name__)

# CREATE - Add a new Alert
@alert_bp.route("/register", methods=["POST"])
@login_required
def create_alert():
    try:
        data = request.get_json()
        institution_id = data.get('institution_id')
        institution = get_institution_by_id(institution_id)
        if not institution:
            return jsonify({"message": "Institution not found"}), 400
        
        cctv_ID = data.get('cctv_id')
        cctv = get_cctv_by_id(cctv_ID)
        if not cctv:
            return jsonify({"message": "CCTV not found"}), 400
        
        new_alert = Alert(
            weapon_type=data.get('weapon_type'),
            status=data.get('status', 'Pending'),
            is_active=data.get('is_active', True),
            image_path=data.get('image_path'),
            institution_id=institution_id,
            cctv_id=cctv_ID
        )

        db.session.add(new_alert)
        db.session.commit()
        return jsonify({"message": "Alert created successfully", "alert": new_alert.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


# READ - Get a list of all Alerts
@alert_bp.route("/all", methods=["GET"])
@login_required
def get_all_alerts():
    try:
        if current_user.role == RoleEnum.superAdmin:
            alerts = Alert.query.all()
        elif current_user.role == RoleEnum.siteAdmin:
            institution = Institution.query.filter_by(id=current_user.institution_id).first()
            if not institution:
                return jsonify({"message": "Institution not found. Cannot get alerts"}), 404
            alerts = Alert.query.filter_by(institution_id=institution.id).all()
        else:
            return jsonify({"message": "Unauthorized access"}), 403

        return jsonify([alert.serialize() for alert in alerts]), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# READ - Get a specific Alert by ID
@alert_bp.route('/<int:alert_id>', methods=['GET'])
@login_required
def get_alert(alert_id):
    try:
        alert = get_alert_by_id(alert_id)
        if not alert:
            return jsonify({"message": "Alert not found"}), 404
        
        if not has_permission(institution_id=alert.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403

        return jsonify(alert.serialize()), 200
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# UPDATE - Update an Alert by ID
@alert_bp.route('/<int:alert_id>', methods=['PATCH'])
@login_required
def update_alert(alert_id):
    try:
        alert = get_alert_by_id(alert_id)
        if not alert:
            return jsonify({"message": "Alert not found"}), 404
        
        if not has_permission(institution_id=alert.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403

        data = request.get_json()
        alert.weapon_type = data.get('weapon_type', alert.weapon_type)
        alert.status = data.get('status', alert.status)
        alert.is_active = data.get('is_active', alert.is_active)
        alert.image_path = data.get('image_path', alert.image_path)

        db.session.commit()
        return jsonify({"message": "Alert updated successfully", "alert": alert.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


# DELETE - Delete an Alert by ID
@alert_bp.route('/<int:alert_id>', methods=['DELETE'])
@login_required
def delete_alert(alert_id):
    try:
        alert = get_alert_by_id(alert_id)
        if not alert:
            return jsonify({"message": "Alert not found"}), 404
        
        if not has_permission(institution_id=alert.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403
        
        db.session.delete(alert)
        db.session.commit()
        return jsonify({"message": "Alert deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400