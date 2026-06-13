import time

RATE_LIMIT = 20
IP_LIMIT_CHAT = 30
IP_LIMIT_CONFIG = 120
_WINDOW_SECONDS = 3600.0

_buckets: dict[str, tuple[int, float]] = {}
_ip_buckets: dict[str, tuple[int, float]] = {}


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


def check_ip_rate_limit(namespace: str, ip: str, limit: int) -> bool:
    """Returns True if within limit, False if exceeded. Key: namespace:ip."""
    key = f"{namespace}:{ip}"
    now = time.monotonic()
    if key in _ip_buckets:
        count, window_start = _ip_buckets[key]
        if now - window_start < _WINDOW_SECONDS:
            if count >= limit:
                return False
            _ip_buckets[key] = (count + 1, window_start)
        else:
            _ip_buckets[key] = (1, now)
    else:
        _ip_buckets[key] = (1, now)
    return True
