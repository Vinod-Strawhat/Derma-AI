"""
SQLAlchemy ORM models.

Only real persisted data lives here. top_predictions is stored as a
JSON string so it round-trips cleanly through SQLite.

The User model is used for authentication. Scans belong to a user
(user_id). Phase 16 scans have no user_id and are treated as legacy
unowned records.
"""

from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def utcnow_naive() -> datetime:
    """UTC timestamp without tzinfo (SQLite-safe)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(Base):
    """An authenticated DermaAI account."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(String(128), nullable=False)

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    # Never the plain-text password.
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    preferred_language: Mapped[str] = mapped_column(
        String(8),
        nullable=False,
        default="en",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=utcnow_naive,
    )

    scans: Mapped[list["Scan"]] = relationship(
        "Scan",
        back_populates="user",
    )


class Scan(Base):
    """One successful AI scan, owned by a user."""

    __tablename__ = "scans"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=utcnow_naive,
    )

    # Owner. Nullable so Phase 16 legacy scans survive as unowned.
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    user: Mapped["User | None"] = relationship(
        "User",
        back_populates="scans",
    )

    # Image references (relative URLs only — never absolute paths).
    image_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    image_url: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )
    gradcam_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    # Patient metadata.
    age: Mapped[float] = mapped_column(Float, nullable=False)
    gender: Mapped[str] = mapped_column(String(32), nullable=False)
    region: Mapped[str] = mapped_column(String(64), nullable=False)

    # Prediction result.
    prediction: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
    )
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(16), nullable=False)
    is_uncertain: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # top_predictions as a JSON string:
    #   [{"className": str, "confidence": float, "probability": float}]
    top_predictions: Mapped[str] = mapped_column(Text, nullable=False)

    uncertainty_message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )