"""initial schema — foundational tables

Revision ID: 20260519_0000
Revises:
Create Date: 2026-05-19

Creates the six foundational tables that the remainder of the migration chain
assumes exist. These tables were previously created outside Alembic via
Base.metadata.create_all(). This migration establishes them in their
pre-alteration state so that subsequent migrations can apply their additive
changes cleanly on a fresh database.

Pre-alteration notes:
  - users: no 'role' column — added by 20260521_0004
  - notifications: no 'type', 'title', 'entity_type', 'entity_id' — added by 20260521_0003
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260519_0000"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ── users ──────────────────────────────────────────────────────────────
    # 'role' column is intentionally absent — migration 20260521_0004 adds it.
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_phone", "users", ["phone"], unique=True)

    # ── service_providers ──────────────────────────────────────────────────
    op.create_table(
        "service_providers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column("display_name", sa.String(length=120), nullable=False),
        sa.Column("category", sa.String(length=40), nullable=False),
        sa.Column("icon_key", sa.String(length=40), nullable=False),
        sa.Column("integration_type", sa.String(length=20), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_service_providers_name", "service_providers", ["name"], unique=True)
    op.create_index("ix_service_providers_category", "service_providers", ["category"], unique=False)

    # ── user_services ──────────────────────────────────────────────────────
    op.create_table(
        "user_services",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("provider_id", sa.Integer(), nullable=False),
        sa.Column("alias", sa.String(length=80), nullable=False),
        sa.Column("reference", sa.String(length=80), nullable=False),
        sa.Column("amount_due", sa.Numeric(10, 2), nullable=False),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["provider_id"], ["service_providers.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_services_user_id", "user_services", ["user_id"], unique=False)
    op.create_index("ix_user_services_reference", "user_services", ["reference"], unique=False)

    # ── payments ───────────────────────────────────────────────────────────
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("user_service_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "CREATED", "PENDING", "PROCESSING", "SUCCESS",
                "FAILED", "CANCELLED", "REVERSED",
                name="paymentstatus",
            ),
            nullable=False,
        ),
        sa.Column("external_reference", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("paid_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["user_service_id"], ["user_services.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_payments_user_id", "payments", ["user_id"], unique=False)

    # ── receipts ───────────────────────────────────────────────────────────
    op.create_table(
        "receipts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("payment_id", sa.Integer(), nullable=False),
        sa.Column("folio", sa.String(length=120), nullable=False),
        sa.Column("message", sa.String(length=240), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("folio"),
        sa.UniqueConstraint("payment_id"),
    )

    # ── notifications ──────────────────────────────────────────────────────
    # 'type', 'title', 'entity_type', 'entity_id' are intentionally absent —
    # migration 20260521_0003 adds them.
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("message", sa.String(length=240), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_notifications_user_id", table_name="notifications")
    op.drop_table("notifications")
    op.drop_table("receipts")
    op.drop_index("ix_payments_user_id", table_name="payments")
    op.drop_table("payments")
    op.drop_index("ix_user_services_reference", table_name="user_services")
    op.drop_index("ix_user_services_user_id", table_name="user_services")
    op.drop_table("user_services")
    op.drop_index("ix_service_providers_category", table_name="service_providers")
    op.drop_index("ix_service_providers_name", table_name="service_providers")
    op.drop_table("service_providers")
    op.drop_index("ix_users_phone", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
