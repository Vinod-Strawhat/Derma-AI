"""
Password hashing and JWT helpers.

Passwords are hashed with PBKDF2-HMAC-SHA256 (a per-user random
salt, a configurable iteration count) and are NEVER stored in plain
text. Tokens are stateless JWTs; they are NOT persisted anywhere.
"""

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt

from app import config

# ============================================================
# Password hashing (PBKDF2-HMAC-SHA256)
# ============================================================

_HASH_NAME = "pbkdf2_sha256"


def hash_password(password: str) -> str:
    """Hash a plain-text password with a fresh random salt."""
    salt = secrets.token_hex(16)

    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        config.PASSWORD_ITERATIONS,
    )

    return (
        f"{_HASH_NAME}${config.PASSWORD_ITERATIONS}${salt}"
        f"${digest.hex()}"
    )


def verify_password(password: str, stored_hash: str) -> bool:
    """
    Verify a plain-text password against a stored hash.

    Returns False (rather than raising) for any malformed hash.
    """
    try:
        algorithm, iterations_text, salt_hex, digest_hex = (
            stored_hash.split("$")
        )

        if algorithm != _HASH_NAME:
            return False

        iterations = int(iterations_text)

        candidate = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            iterations,
        )

        return hmac.compare_digest(
            candidate.hex(),
            digest_hex,
        )
    except (ValueError, TypeError):
        return False


# ============================================================
# JWT
# ============================================================

def create_token(user_id: int) -> str:
    """Create a signed stateless JWT for a user id."""
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=config.JWT_EXPIRE_MINUTES),
    }

    return jwt.encode(
        payload,
        config.JWT_SECRET_KEY,
        algorithm=config.JWT_ALGORITHM,
    )


def decode_token(token: str):
    """
    Decode and verify a JWT.

    Returns the payload, or raises jwt.PyJWTError for invalid or
    expired tokens (including wrong-signature / tampered tokens).
    """
    return jwt.decode(
        token,
        config.JWT_SECRET_KEY,
        algorithms=[config.JWT_ALGORITHM],
    )