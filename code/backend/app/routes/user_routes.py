from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import User, Institution, RoleEnum, get_user_by_id
from flask_login import login_required, current_user
from ..utils import has_permission

user_bp = Blueprint('user_bp', __name__)

# CREATE- Register a new user
@user_bp.route('/register', methods=['POST'])
def register_user_route():
    try:
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        institution_id = data.get('institution_id')

        if not name or not email or not password or not institution_id:
            return jsonify({"message": "Missing fields"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400
        
        if not Institution.query.get(institution_id):
            return jsonify({"message": "Institution not found"}), 404

        new_user = User(name=name, email=email,institution_id=institution_id)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully", "user": new_user.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while registering the user", "error": str(e)}), 500


# READ - Get a list of all users
@user_bp.route('/all', methods=['GET'])
@login_required
def get_all_users():
    try:
        if current_user.role == RoleEnum.superAdmin:
            users = User.query.all()
        elif current_user.role == RoleEnum.siteAdmin:
            institution = Institution.query.filter_by(id=current_user.institution_id).first()
            if not institution:
                return jsonify({"message": "Institution not found. Cannot get users"}), 404
            users = User.query.filter_by(institution_id=institution.id).all()
        else:
            return jsonify({"message": "Unauthorized access"}), 403
            
        if not users:
            return jsonify({"message": "No users found"}), 404

        users_data = [user.serialize() for user in users]
        return jsonify(users_data), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while retrieving users", "error": str(e)}), 500


# READ- Get user details by ID
@user_bp.route('/<int:id>', methods=['GET'])
@login_required
def get_user(id):
    try:
        user = get_user_by_id(id)
        if not user:
            return jsonify({"message": "User not found"}), 404
            
        if not has_permission(institution_id=user.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403
        
        return jsonify(user.serialize()), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while retrieving the user", "error": str(e)}), 500


# UPDATE - Update user details by ID
@user_bp.route('/<int:id>', methods=['PATCH'])
@login_required
def update_user(id):
    try:
        user = get_user_by_id(id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        if not has_permission(institution_id=user.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403
        
        data = request.get_json()

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        if "role" in data:
            role = data["role"]
            if role not in [r.value for r in RoleEnum]:
                return jsonify({"message": "Invalid role"}), 400
            user.role = RoleEnum(role)

        user.institution_id = data.get("institution_id", user.institution_id)
        if data.get("password"):
            user.set_password(data.get("password"))

        db.session.commit()

        return jsonify({"message": "User Updated successfully", "user": user.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating the user", "error": str(e)}), 500


# DELETE - Delete a user by ID
@user_bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    try:
        user = User.query.get_or_404(id)
        if not user:
            return jsonify({"message": "User not found"}), 404
    
        if not has_permission(institution_id=user.institution_id):
            return jsonify({"message": "Unauthorized access"}), 403
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while deleting the user", "error": str(e)}), 500
