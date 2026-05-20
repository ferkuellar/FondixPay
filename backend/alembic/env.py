from logging.config import fileConfig

from alembic import context

from app.core.config import settings
from app.core.database import Base
from app.modules.audit.models import AuditEvent
from app.modules.ledger.models import (
    LedgerAccount,
    LedgerEntry,
    PaymentAttempt,
    PaymentIntent,
    ProviderTransaction,
    ReconciliationRecord,
)
from app.modules.notifications.models import Notification
from app.modules.payments.models import Payment
from app.modules.receipts.models import Receipt
from app.modules.service_providers.models import ServiceProvider
from app.modules.user_services.models import UserService
from app.modules.users.models import User

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from sqlalchemy import engine_from_config, pool

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

