"""phase 11 fraud chargeback readiness

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
        "fraud_signals",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("signal_type", sa.String(length=120), nullable=False),
        sa.Column("severity", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("entity_id", sa.String(length=80), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("payment_id", sa.Integer(), nullable=True),
        sa.Column("transaction_id", sa.Integer(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
        sa.Column("reviewed_by", sa.Integer(), nullable=True),
        sa.Column("resolution", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.ForeignKeyConstraint(["reviewed_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["transaction_id"], ["provider_transactions.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_fraud_signals_signal_type"), "fraud_signals", ["signal_type"], unique=False)
    op.create_index(op.f("ix_fraud_signals_severity"), "fraud_signals", ["severity"], unique=False)
    op.create_index(op.f("ix_fraud_signals_status"), "fraud_signals", ["status"], unique=False)
    op.create_index(op.f("ix_fraud_signals_entity_type"), "fraud_signals", ["entity_type"], unique=False)
    op.create_index(op.f("ix_fraud_signals_entity_id"), "fraud_signals", ["entity_id"], unique=False)
    op.create_index(op.f("ix_fraud_signals_user_id"), "fraud_signals", ["user_id"], unique=False)
    op.create_index(op.f("ix_fraud_signals_payment_id"), "fraud_signals", ["payment_id"], unique=False)
    op.create_index(op.f("ix_fraud_signals_transaction_id"), "fraud_signals", ["transaction_id"], unique=False)

    op.create_table(
        "dispute_cases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("case_type", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("payment_id", sa.Integer(), nullable=True),
        sa.Column("transaction_id", sa.Integer(), nullable=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("provider_transaction_id", sa.String(length=160), nullable=True),
        sa.Column("card_processor_reference", sa.String(length=160), nullable=True),
        sa.Column("amount_minor", sa.Integer(), nullable=True),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("reason_code", sa.String(length=80), nullable=True),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("opened_at", sa.DateTime(), nullable=False),
        sa.Column("due_at", sa.DateTime(), nullable=True),
        sa.Column("closed_at", sa.DateTime(), nullable=True),
        sa.Column("assigned_to", sa.Integer(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["assigned_to"], ["users.id"]),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.ForeignKeyConstraint(["transaction_id"], ["provider_transactions.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_dispute_cases_case_type"), "dispute_cases", ["case_type"], unique=False)
    op.create_index(op.f("ix_dispute_cases_status"), "dispute_cases", ["status"], unique=False)
    op.create_index(op.f("ix_dispute_cases_payment_id"), "dispute_cases", ["payment_id"], unique=False)
    op.create_index(op.f("ix_dispute_cases_transaction_id"), "dispute_cases", ["transaction_id"], unique=False)
    op.create_index(op.f("ix_dispute_cases_user_id"), "dispute_cases", ["user_id"], unique=False)
    op.create_index(op.f("ix_dispute_cases_provider_transaction_id"), "dispute_cases", ["provider_transaction_id"], unique=False)
    op.create_index(op.f("ix_dispute_cases_card_processor_reference"), "dispute_cases", ["card_processor_reference"], unique=False)

    op.create_table(
        "dispute_evidence",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("dispute_case_id", sa.Integer(), nullable=False),
        sa.Column("evidence_type", sa.String(length=80), nullable=False),
        sa.Column("title", sa.String(length=180), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("storage_reference", sa.String(length=260), nullable=True),
        sa.Column("source_entity_type", sa.String(length=80), nullable=True),
        sa.Column("source_entity_id", sa.String(length=80), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["dispute_case_id"], ["dispute_cases.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_dispute_evidence_dispute_case_id"), "dispute_evidence", ["dispute_case_id"], unique=False)
    op.create_index(op.f("ix_dispute_evidence_evidence_type"), "dispute_evidence", ["evidence_type"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_dispute_evidence_evidence_type"), table_name="dispute_evidence")
    op.drop_index(op.f("ix_dispute_evidence_dispute_case_id"), table_name="dispute_evidence")
    op.drop_table("dispute_evidence")

    op.drop_index(op.f("ix_dispute_cases_card_processor_reference"), table_name="dispute_cases")
    op.drop_index(op.f("ix_dispute_cases_provider_transaction_id"), table_name="dispute_cases")
    op.drop_index(op.f("ix_dispute_cases_user_id"), table_name="dispute_cases")
    op.drop_index(op.f("ix_dispute_cases_transaction_id"), table_name="dispute_cases")
    op.drop_index(op.f("ix_dispute_cases_payment_id"), table_name="dispute_cases")
    op.drop_index(op.f("ix_dispute_cases_status"), table_name="dispute_cases")
    op.drop_index(op.f("ix_dispute_cases_case_type"), table_name="dispute_cases")
    op.drop_table("dispute_cases")

    op.drop_index(op.f("ix_fraud_signals_transaction_id"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_payment_id"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_user_id"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_entity_id"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_entity_type"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_status"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_severity"), table_name="fraud_signals")
    op.drop_index(op.f("ix_fraud_signals_signal_type"), table_name="fraud_signals")
    op.drop_table("fraud_signals")
