from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.modules.auth.routes import router as auth_router
from app.modules.notifications.routes import router as notifications_router
from app.modules.payments.routes import router as payments_router
from app.modules.receipts.routes import router as receipts_router
from app.modules.service_providers.routes import router as providers_router
from app.modules.user_services.routes import router as user_services_router
from app.modules.users.routes import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FONDIX PAY API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(providers_router, prefix="/service-providers", tags=["service providers"])
app.include_router(user_services_router, prefix="/user-services", tags=["user services"])
app.include_router(payments_router, prefix="/payments", tags=["payments"])
app.include_router(receipts_router, prefix="/receipts", tags=["receipts"])
app.include_router(notifications_router, prefix="/notifications", tags=["notifications"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": "fondix-pay"}

