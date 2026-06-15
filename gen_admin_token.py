from datetime import datetime, timedelta, timezone
from jose import jwt
import os

secret = os.environ.get("JWT_SECRET_KEY", "")
if not secret:
    print("ERROR: JWT_SECRET_KEY no encontrado")
    exit(1)

payload = {
    "sub": "1",
    "exp": datetime.now(timezone.utc) + timedelta(hours=8),
}
token = jwt.encode(payload, secret, algorithm="HS256")
print("TOKEN:", token)
