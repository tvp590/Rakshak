from flask import Blueprint, request, jsonify
from ..extensions import db, login_manager
from..models import User
from flask_login import logout_user, login_required, login_user, current_user

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/login', methods=['POST'])
def login_user_route():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Missing fields"}), 400
        
        user = User.query.filter_by(email=email).first()\
        
        if not user or not user.check_password(password):
            return jsonify({"message": "Invalid email or password"}), 401
        
        login_user(user)
        return jsonify({"message": "Login successful", "user": user.serialize()}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred during login", "error": str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout_user_route():
    try:
        logout_user()
        return jsonify({"message": "Logged out successfully"}), 200
        
    except Exception as e:
        return jsonify({"message": "An error occurred during logout", "error": str(e)}), 500

@auth_bp.route("/get-user", methods=["GET"])
@login_required
def get_user():
    try:
        if not current_user.is_authenticated:
            return jsonify({"message": "Unauthorized"}), 401

        return jsonify(current_user.serialize()), 200

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
    

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized"}), 401