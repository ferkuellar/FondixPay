"""phase 10g whatsapp receipt notification delivery

Revision ID: 20260527_0007
Revises: 20260527_0006
Create Date: 2026-05-27
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260527_0007"
down_revision: str | None = "20260527_0006"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "notification_preferences",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("channel", sa.String(length=40), nullable=False),
        sa.Column("notification_type", sa.String(length=80), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column("consented_at", sa.DateTime(), nullable=True),
        sa.Column("revoked_at", sa.DateTime(), nullable=True),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "channel", "notification_type", name="uq_notification_preferences_user_channel_type"),
    )
    op.create_index(op.f("ix_notification_preferences_channel"), "notification_preferences", ["channel"], unique=False)
    op.create_index(op.f("ix_notification_preferences_notification_type"), "notification_preferences", ["notification_type"], unique=False)
    op.create_index(op.f("ix_notification_preferences_user_id"), "notification_preferences", ["user_id"], unique=False)

    op.create_table(
        "notification_deliveries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("channel", sa.String(length=40), nullable=False),
        sa.Column("notification_type", sa.String(length=80), nullable=False),
        sa.Column("template_name", sa.String(length=120), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("entity_id", sa.String(length=80), nullable=False),
        sa.Column("recipient_hash", sa.String(length=128), nullable=False),
        sa.Column("recipient_masked", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("idempotency_key", sa.String(length=240), nullable=False),
        sa.Column("provider_name", sa.String(length=80), nullable=True),
        sa.Column("provider_message_id", sa.String(length=160), nullable=True),
        sa.Column("error_code", sa.String(length=80), nullable=True),
        sa.Column("error_message_safe", sa.String(length=240), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("idempotency_key", name="uq_notification_deliveries_idempotency_key"),
    )
    op.create_index(op.f("ix_notification_deliveries_channel"), "notification_deliveries", ["channel"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_entity_id"), "notification_deliveries", ["entity_id"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_entity_type"), "notification_deliveries", ["entity_type"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_idempotency_key"), "notification_deliveries", ["idempotency_key"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_notification_type"), "notification_deliveries", ["notification_type"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_recipient_hash"), "notification_deliveries", ["recipient_hash"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_status"), "notification_deliveries", ["status"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_template_name"), "notification_deliveries", ["template_name"], unique=False)
    op.create_index(op.f("ix_notification_deliveries_user_id"), "notification_deliveries", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_notification_deliveries_user_id"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_template_name"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_status"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_recipient_hash"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_notification_type"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_idempotency_key"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_entity_type"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_entity_id"), table_name="notification_deliveries")
    op.drop_index(op.f("ix_notification_deliveries_channel"), table_name="notification_deliveries")
    op.drop_table("notification_deliveries")

    op.drop_index(op.f("ix_notification_preferences_user_id"), table_name="notification_preferences")
    op.drop_index(op.f("ix_notification_preferences_notification_type"), table_name="notification_preferences")
    op.drop_index(op.f("ix_notification_preferences_channel"), table_name="notification_preferences")
    op.drop_table("notification_preferences")
