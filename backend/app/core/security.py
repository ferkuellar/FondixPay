from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.modules.users.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/verify-otp")


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    delta = expires_delta if expires_delta is not None else timedelta(minutes=settings.access_token_expire_minutes)
    expires = datetime.now(timezone.utc) + delta
    payload = {"sub": subject, "exp": expires}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Sesion no valida",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
        user_pk = int(user_id)
    except (JWTError, ValueError) as exc:
        raise credentials_error from exc

    user = db.get(User, user_pk)
    if user is None:
        raise credentials_error
    return user

