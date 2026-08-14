"""
Authentication service: user creation, login, token issuance.

Never returns password or password_hash. All errors are user-safe
messages with no filesystem paths, hashes, or database internals.
"""

import re

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app import config
from app.core.security import (
    create_token,
    hash_password,
    verify_password,
)
from app.db import SessionLocal
from app.models import User

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _email_error(message: str):
    return HTTPException(status_code=422, detail=message)


def validate_signup_fields(
    name: str,
    email: str,
    password: str,
    preferred_language: str,
) -> None:
    """Validate signup inputs, raising user-safe 422 errors."""
    if not name or not str(name).strip():
        raise _email_error("Name is required.")

    email = str(email or "").strip().lower()

    if not _EMAIL_RE.match(email):
        raise _email_error(
            "Email must be a valid email address."
        )

    if not password or len(password) < config.PASSWORD_MIN_LENGTH:
        raise _email_error(
            f"Password must be at least "
            f"{config.PASSWORD_MIN_LENGTH} characters."
        )

    if preferred_language not in config.SUPPORTED_LANGUAGES:
        raise _email_error("Preferred language is not supported.")


def create_user(
    name: str,
    email: str,
    password: str,
    preferred_language: str,
) -> User:
    """Create a user account. Raises 422 on duplicate email."""
    normalized_email = str(email or "").strip().lower()

    db = SessionLocal()
    try:
        user = User(
            name=str(name).strip(),
            email=normalized_email,
            password_hash=hash_password(password),
            preferred_language=preferred_language,
        )
        db.add(user)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise _email_error("Email already registered.")

        db.refresh(user)
        return user
    finally:
        db.close()


def authenticate_user(email: str, password: str) -> User:
    """
    Verify email + password.

    Returns the user, or raises a user-safe 401 without revealing
    whether the email exists or the password was wrong.
    """
    normalized_email = str(email or "").strip().lower()

    db = SessionLocal()
    try:
        user = (
            db.query(User)
            .filter(User.email == normalized_email)
            .first()
        )

        if user is None or not verify_password(
            password or "", user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password.",
            )

        return user
    finally:
        db.close()


def issue_token(user: User) -> str:
    """Create an auth token for a user."""
    return create_token(user.id)


def serialize_user(user: User) -> dict:
    """Safe user payload — no password fields."""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "preferredLanguage": user.preferred_language,
        "createdAt": user.created_at.isoformat(),
    }