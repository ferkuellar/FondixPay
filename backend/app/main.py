from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.core.request_context import RequestContextMiddleware
from app.modules.accounts.models import Account, BalanceSnapshot, Movement
from app.modules.accounts.routes import router as accounts_router
from app.modules.admin.models import (
    DisputeCase,
    DisputeEvidence,
    FraudSignal,
    ManualReviewCase,
    ManualReviewEvent,
    SupportTicket,
    SupportTicketNote,
)
from app.modules.admin.routes import router as admin_router
from app.modules.audit.models import AuditEvent
from app.modules.auth.routes import router as auth_router
from app.modules.chatbot.models import (
    ChatbotConversation,
    ChatbotFallback,
    ChatbotFaq,
    ChatbotIntent,
    ChatbotKnowledgeEntry,
    ChatbotMessage,
    ChatbotSetting,
)
from app.modules.chatbot.routes import admin_router as chatbot_admin_router
from app.modules.chatbot.routes import public_router as chatbot_public_router
from app.modules.ledger.models import (
    LedgerAccount,
    LedgerEntry,
    PaymentAttempt,
    PaymentIntent,
    ProviderTransaction,
    ReconciliationRecord,
)
from app.modules.notifications.models import NotificationDelivery, NotificationPreference
from app.modules.notifications.routes import preferences_router, router as notifications_router
from app.modules.payments.routes import router as payments_router
from app.modules.receipts.routes import router as receipts_router
from app.modules.service_catalog.models import (
    CoverageMapSource,
    ProviderServiceCapability,
    ServiceCatalogItem,
    ServiceCategory as CatalogServiceCategory,
    ServiceCoverageByState,
)
from app.modules.service_catalog.routes import admin_router as service_catalog_admin_router
from app.modules.service_catalog.routes import coverage_router, router as service_catalog_router
from app.modules.service_providers.routes import router as providers_router
from app.modules.user_services.routes import router as user_services_router
from app.modules.users.routes import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FONDIX PAY API", version="0.1.0")

app.add_middleware(RequestContextMiddleware)

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
app.include_router(preferences_router, prefix="/notification-preferences", tags=["notification preferences"])
app.include_router(accounts_router, prefix="/account", tags=["account"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(service_catalog_router, prefix="/service-catalog", tags=["service catalog"])
app.include_router(coverage_router, tags=["coverage map"])
app.include_router(service_catalog_admin_router, prefix="/admin/service-catalog", tags=["admin service catalog"])
app.include_router(chatbot_public_router, prefix="/api/public", tags=["public chatbot"])
app.include_router(chatbot_admin_router, prefix="/admin/chat", tags=["admin chatbot"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": "fondix-pay"}

