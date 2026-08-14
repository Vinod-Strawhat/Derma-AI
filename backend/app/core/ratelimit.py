"""
Lightweight in-memory rate limiting.

No external dependency. Fixed-window limiting keyed by
(scope, key) where key is typically the client IP (and, for login,
also the account email). Used to blunt authentication abuse and to
bound expensive prediction and static-image requests.

Memory is bounded: per-key buckets are pruned on every check and the
buckets dict is periodically compacted.

This is appropriate for a single-process development server. A
production deployment behind multiple workers should replace this
with a shared store (e.g. Redis) — the scope/limits stay the same.
"""

import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app import config

_buckets: dict[tuple[str, str], deque[float]] = defaultdict(deque)

_last_compaction = time.monotonic()


def _now() -> float:
    return time.monotonic()


def _compact() -> None:
    """Drop empty buckets occasionally so memory stays bounded."""
    global _last_compaction

    if _now() - _last_compaction < 300:
        return

    _last_compaction = _now()

    stale = [
        key
        for key, bucket in list(_buckets.items())
        if not bucket
    ]

    for key in stale:
        del _buckets[key]


def _prune(bucket: deque) -> None:
    cutoff = _now() - config.RATE_LIMIT_WINDOW_SECONDS
    while bucket and bucket[0] <= cutoff:
        bucket.popleft()


def client_ip(request: Request) -> str:
    """
    Return the best-effort client IP.

    When DERMA_TRUST_PROXY is enabled, the first X-Forwarded-For value
    is used (standard for a reverse proxy). Otherwise the direct
    socket peer is used.
    """
    if config.TRUST_PROXY:
        forwarded = request.headers.get("x-forwarded-for", "")
        if forwarded:
            return forwarded.split(",")[0].strip()

    if request.client is not None and request.client.host:
        return request.client.host

    return "unknown"


def check_rate_limit(
    scope: str,
    *keys: str,
    limit: int | None = None,
) -> None:
    """
    Enforce a per-key request limit within the configured window.

    Each provided key is a separate bucket for the same scope, so
    `check_rate_limit("login", ip, email)` limits BOTH attempts from
    one IP and attempts against one account.

    Raises HTTPException(429) when a bucket is exhausted.
    """
    if not config.RATE_LIMIT_ENABLED:
        return

    effective = limit or {
        "signup": config.RATE_LIMIT_SIGNUP,
        "login": config.RATE_LIMIT_LOGIN,
        "predict": config.RATE_LIMIT_PREDICT,
        "static": config.RATE_LIMIT_STATIC,
    }.get(scope, 30)

    for key in keys or ("global",):
        bucket = _buckets[(scope, key)]
        _prune(bucket)

        if len(bucket) >= effective:
            raise HTTPException(
                status_code=429,
                detail=(
                    "Too many requests. Please wait a moment and "
                    "try again."
                ),
            )

        bucket.append(_now())

    _compact()
