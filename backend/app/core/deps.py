"""
Authentication dependency.

Extracts a Bearer token, verifies it, loads the user, and rejects
invalid or expired tokens with a 401.
"""

from fastapi import Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db import get_db
from app.models import User

_bearer = HTTPBearer(auto_error=False)


def _authenticate(
    token: str | None,
    db: Session,
) -> User:
    """
    Shared token validation used by every auth dependency.

    Rejects requests without a token, with an invalid token, or with
    an expired token. The same 401 is returned in every case so the
    existence of a user is never revealed.
    """
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except (PyJWTError, KeyError, ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        _bearer
    ),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency that returns the authenticated User.

    Header-only authentication (Authorization: Bearer <token>). Used
    by the API routes. Rejects requests without a token, with an
    invalid token, or with an expired token. The same 401 is returned
    in every case so the existence of a user is never revealed.
    """
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _authenticate(credentials.credentials, db)


def get_static_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        _bearer
    ),
    access_token: str | None = Query(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Authentication for the private /static image routes.

    <img> tags cannot send Authorization headers, so the frontend
    attaches the owner's token as an `access_token` query parameter.
    This dependency accepts that query parameter as a fallback, but
    validates it exactly like the header token (JWT + ownership still
    enforced by the route), so images remain private. The query-
    parameter fallback is scoped to asset routes only; the API routes
    keep header-only authentication.
    """
    token = None

    if credentials is not None and credentials.scheme.lower() == "bearer":
        token = credentials.credentials
    elif access_token:
        token = access_token

    return _authenticate(token, db)