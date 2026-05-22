from collections.abc import Callable

from fastapi import Depends, HTTPException, status

from app.core.security import get_current_user
from app.modules.admin.permissions import ADMIN_ROLES, has_any_role, has_permission, normalize_role
from app.modules.users.models import User


def require_admin_role(roles: list[str] | None = None) -> Callable[[User], User]:
    allowed_roles = roles or sorted(ADMIN_ROLES)

    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if not has_any_role(current_user.role, allowed_roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
        return current_user

    return dependency


def require_admin_permission(permission: str) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(require_admin_role())) -> User:
        if not has_permission(current_user.role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing admin permission: {permission}",
            )
        current_user.role = normalize_role(current_user.role)
        return current_user

    return dependency
