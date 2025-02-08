from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Institution, get_institution_by_id
from flask_login import login_required
from ..utils import has_permission

institution_bp = Blueprint('institution_bp', __name__)

# CREATE - Add a new institution
@institution_bp.route('/register', methods=['POST'])
def register_institution():
    try:
        data = request.get_json()
        
        name = data.get('name')
        address = data.get('address')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')

        if not name or not address or not phone or not email or not password:
            return jsonify({"message": "Missing fields"}), 400

        if Institution.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400

        new_institution = Institution(name=name, address=address, email=email, phone=phone)
        new_institution.set_institution_password(password)

        db.session.add(new_institution)
        db.session.commit()
        return jsonify({"message": "Institution registered successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while registering the institution", "error": str(e)}), 500


# READ - Get a list of all institutions
@institution_bp.route('/all', methods=['GET'])
@login_required
def get_all_institutions():
    try:
        if not has_permission():
            return jsonify({"message": "Unauthorized access"}), 403

        institutions = Institution.query.all()
        if not institutions:
            return jsonify({"message": "No institutions found"}), 404

        institutions_data = []
        for institution in institutions:
            institutions_data.append({
                "id": institution.id,
                "name": institution.name,
                "address": institution.address,
                "email": institution.email,
                "phone": institution.phone
            })

        return jsonify(institutions_data), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while fetching institutions", "error": str(e)}), 500


# READ - Get a specific institution by ID
@institution_bp.route('/<int:id>', methods=['GET'])
@login_required
def get_institution(id):
    try:
        if not has_permission():
            return jsonify({"message": "Unauthorized access"}), 403

        institution = get_institution_by_id(id)
        if not institution:
            return jsonify({"message": "Institution not found"}), 404

        institution_data = {
            "id": institution.id,
            "name": institution.name,
            "address": institution.address,
            "email": institution.email,
            "phone": institution.phone
        }

        return jsonify(institution_data), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while fetching the institution", "error": str(e)}), 500


# UPDATE - Update an institution by ID
@institution_bp.route('/<int:id>', methods=['PATCH'])
@login_required
def update_institution(id):
    try:
        if not has_permission():
            return jsonify({"message": "Unauthorized access"}), 403

        data = request.get_json()
        institution = get_institution_by_id(id)
        if not institution:
            return jsonify({"message": "Institution not found"}), 404

        institution.name = data.get("name", institution.name)
        institution.address = data.get("address", institution.address)
        institution.email = data.get("email", institution.email)
        institution.phone = data.get("phone", institution.phone)
        if data.get("password"):
            institution.set_institution_password(data.get("password"))

        db.session.commit()

        return jsonify({"message": "Institution updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating the institution", "error": str(e)}), 500


# DELETE - Delete an institution
@institution_bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_institution(id):
    try:
        if not has_permission():
            return jsonify({"message": "Unauthorized access"}), 403

        institution = get_institution_by_id(id)
        if not institution:
            return jsonify({"message": "Institution not found"}), 404

        db.session.delete(institution)
        db.session.commit()

        return jsonify({"message": "Institution deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while deleting the institution", "error": str(e)}), 500
