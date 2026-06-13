import time

RATE_LIMIT = 20
_WINDOW_SECONDS = 3600.0

_buckets: dict[str, tuple[int, float]] = {}


def check_rate_limit(session_id: str) -> bool:
    """Returns True if within limit, False if exceeded (20 msgs/sessionId/hour)."""
    now = time.monotonic()
    if session_id in _buckets:
        count, window_start = _buckets[session_id]
        if now - window_start < _WINDOW_SECONDS:
            if count >= RATE_LIMIT:
                return False
            _buckets[session_id] = (count + 1, window_start)
        else:
            _buckets[session_id] = (1, now)
    else:
        _buckets[session_id] = (1, now)
    return True
