from ..models import RoleEnum
from flask_login import current_user

def has_permission(institution_id=None):
    if current_user.role == RoleEnum.superAdmin:
        return True
    if current_user.role == RoleEnum.siteAdmin and institution_id == current_user.institution_id:
        return True
    return False