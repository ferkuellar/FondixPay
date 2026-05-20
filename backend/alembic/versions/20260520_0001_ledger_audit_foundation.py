"""ledger audit foundation

Revision ID: 20260520_0001
Revises:
Create Date: 2026-05-20
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260520_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "audit_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("actor_type", sa.String(length=40), nullable=False),
        sa.Column("actor_id", sa.String(length=80), nullable=True),
        sa.Column("entity_type", sa.String(length=80), nullable=True),
        sa.Column("entity_id", sa.String(length=80), nullable=True),
        sa.Column("result", sa.String(length=40), nullable=False),
        sa.Column("before_json", sa.JSON(), nullable=True),
        sa.Column("after_json", sa.JSON(), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("request_id", sa.String(length=80), nullable=True),
        sa.Column("correlation_id", sa.String(length=80), nullable=True),
        sa.Column("ip_address", sa.String(length=80), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_audit_events_event_type", "audit_events", ["event_type"])
    op.create_index("ix_audit_events_actor_id", "audit_events", ["actor_id"])
    op.create_index("ix_audit_events_entity_id", "audit_events", ["entity_id"])
    op.create_index("ix_audit_events_request_id", "audit_events", ["request_id"])
    op.create_index("ix_audit_events_correlation_id", "audit_events", ["correlation_id"])

    op.create_table(
        "payment_intents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("user_service_id", sa.Integer(), nullable=False),
        sa.Column("payment_id", sa.Integer(), nullable=True),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("fee_minor", sa.Integer(), nullable=False),
        sa.Column("total_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("idempotency_key", sa.String(length=120), nullable=False),
        sa.Column("correlation_id", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["user_service_id"], ["user_services.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "idempotency_key", name="uq_payment_intents_user_idempotency"),
    )
    op.create_index("ix_payment_intents_user_id", "payment_intents", ["user_id"])
    op.create_index("ix_payment_intents_user_service_id", "payment_intents", ["user_service_id"])
    op.create_index("ix_payment_intents_payment_id", "payment_intents", ["payment_id"])
    op.create_index("ix_payment_intents_status", "payment_intents", ["status"])
    op.create_index("ix_payment_intents_idempotency_key", "payment_intents", ["idempotency_key"])
    op.create_index("ix_payment_intents_correlation_id", "payment_intents", ["correlation_id"])

    op.create_table(
        "payment_attempts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("payment_intent_id", sa.Integer(), nullable=False),
        sa.Column("provider_name", sa.String(length=80), nullable=False),
        sa.Column("provider_operation", sa.String(length=80), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("request_payload_hash", sa.String(length=128), nullable=True),
        sa.Column("response_payload_hash", sa.String(length=128), nullable=True),
        sa.Column("provider_reference", sa.String(length=120), nullable=True),
        sa.Column("error_code", sa.String(length=80), nullable=True),
        sa.Column("error_message_safe", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["payment_intent_id"], ["payment_intents.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_payment_attempts_payment_intent_id", "payment_attempts", ["payment_intent_id"])
    op.create_index("ix_payment_attempts_status", "payment_attempts", ["status"])
    op.create_index("ix_payment_attempts_provider_reference", "payment_attempts", ["provider_reference"])

    op.create_table(
        "ledger_accounts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_type", sa.String(length=40), nullable=False),
        sa.Column("owner_id", sa.String(length=80), nullable=True),
        sa.Column("account_type", sa.String(length=80), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_ledger_accounts_owner_type", "ledger_accounts", ["owner_type"])
    op.create_index("ix_ledger_accounts_owner_id", "ledger_accounts", ["owner_id"])
    op.create_index("ix_ledger_accounts_account_type", "ledger_accounts", ["account_type"])

    op.create_table(
        "ledger_entries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ledger_account_id", sa.Integer(), nullable=False),
        sa.Column("payment_intent_id", sa.Integer(), nullable=True),
        sa.Column("direction", sa.String(length=20), nullable=False),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("entry_type", sa.String(length=80), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("correlation_id", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.String(length=80), nullable=True),
        sa.ForeignKeyConstraint(["ledger_account_id"], ["ledger_accounts.id"]),
        sa.ForeignKeyConstraint(["payment_intent_id"], ["payment_intents.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_ledger_entries_ledger_account_id", "ledger_entries", ["ledger_account_id"])
    op.create_index("ix_ledger_entries_payment_intent_id", "ledger_entries", ["payment_intent_id"])
    op.create_index("ix_ledger_entries_entry_type", "ledger_entries", ["entry_type"])
    op.create_index("ix_ledger_entries_correlation_id", "ledger_entries", ["correlation_id"])

    op.create_table(
        "provider_transactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("payment_attempt_id", sa.Integer(), nullable=False),
        sa.Column("provider_name", sa.String(length=80), nullable=False),
        sa.Column("provider_reference", sa.String(length=120), nullable=True),
        sa.Column("provider_status", sa.String(length=80), nullable=False),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("raw_response_hash", sa.String(length=128), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("confirmed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["payment_attempt_id"], ["payment_attempts.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_provider_transactions_payment_attempt_id", "provider_transactions", ["payment_attempt_id"])
    op.create_index("ix_provider_transactions_provider_name", "provider_transactions", ["provider_name"])
    op.create_index("ix_provider_transactions_provider_reference", "provider_transactions", ["provider_reference"])
    op.create_index("ix_provider_transactions_provider_status", "provider_transactions", ["provider_status"])

    op.create_table(
        "reconciliation_records",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("provider_name", sa.String(length=80), nullable=False),
        sa.Column("reconciliation_date", sa.Date(), nullable=False),
        sa.Column("status", sa.String(length=80), nullable=False),
        sa.Column("matched_count", sa.Integer(), nullable=False),
        sa.Column("mismatch_count", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reconciliation_records_provider_name", "reconciliation_records", ["provider_name"])
    op.create_index("ix_reconciliation_records_status", "reconciliation_records", ["status"])


def downgrade() -> None:
    op.drop_index("ix_reconciliation_records_status", table_name="reconciliation_records")
    op.drop_index("ix_reconciliation_records_provider_name", table_name="reconciliation_records")
    op.drop_table("reconciliation_records")
    op.drop_index("ix_provider_transactions_provider_status", table_name="provider_transactions")
    op.drop_index("ix_provider_transactions_provider_reference", table_name="provider_transactions")
    op.drop_index("ix_provider_transactions_provider_name", table_name="provider_transactions")
    op.drop_index("ix_provider_transactions_payment_attempt_id", table_name="provider_transactions")
    op.drop_table("provider_transactions")
    op.drop_index("ix_ledger_entries_correlation_id", table_name="ledger_entries")
    op.drop_index("ix_ledger_entries_entry_type", table_name="ledger_entries")
    op.drop_index("ix_ledger_entries_payment_intent_id", table_name="ledger_entries")
    op.drop_index("ix_ledger_entries_ledger_account_id", table_name="ledger_entries")
    op.drop_table("ledger_entries")
    op.drop_index("ix_ledger_accounts_account_type", table_name="ledger_accounts")
    op.drop_index("ix_ledger_accounts_owner_id", table_name="ledger_accounts")
    op.drop_index("ix_ledger_accounts_owner_type", table_name="ledger_accounts")
    op.drop_table("ledger_accounts")
    op.drop_index("ix_payment_attempts_provider_reference", table_name="payment_attempts")
    op.drop_index("ix_payment_attempts_status", table_name="payment_attempts")
    op.drop_index("ix_payment_attempts_payment_intent_id", table_name="payment_attempts")
    op.drop_table("payment_attempts")
    op.drop_index("ix_payment_intents_correlation_id", table_name="payment_intents")
    op.drop_index("ix_payment_intents_idempotency_key", table_name="payment_intents")
    op.drop_index("ix_payment_intents_status", table_name="payment_intents")
    op.drop_index("ix_payment_intents_payment_id", table_name="payment_intents")
    op.drop_index("ix_payment_intents_user_service_id", table_name="payment_intents")
    op.drop_index("ix_payment_intents_user_id", table_name="payment_intents")
    op.drop_table("payment_intents")
    op.drop_index("ix_audit_events_correlation_id", table_name="audit_events")
    op.drop_index("ix_audit_events_request_id", table_name="audit_events")
    op.drop_index("ix_audit_events_entity_id", table_name="audit_events")
    op.drop_index("ix_audit_events_actor_id", table_name="audit_events")
    op.drop_index("ix_audit_events_event_type", table_name="audit_events")
    op.drop_table("audit_events")
