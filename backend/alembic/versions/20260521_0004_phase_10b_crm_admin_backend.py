"""phase 10b crm admin backend

Revision ID: 20260521_0004
Revises: 20260521_0003
Create Date: 2026-05-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260521_0004"
down_revision: str | None = "20260521_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("users", sa.Column("role", sa.String(length=40), nullable=False, server_default="USER"))
    op.create_index(op.f("ix_users_role"), "users", ["role"], unique=False)

    op.create_table(
        "support_tickets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("payment_id", sa.Integer(), nullable=True),
        sa.Column("receipt_id", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("priority", sa.String(length=40), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("subject", sa.String(length=180), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("assigned_to", sa.Integer(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["assigned_to"], ["users.id"]),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.ForeignKeyConstraint(["receipt_id"], ["receipts.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_support_tickets_user_id"), "support_tickets", ["user_id"], unique=False)
    op.create_index(op.f("ix_support_tickets_payment_id"), "support_tickets", ["payment_id"], unique=False)
    op.create_index(op.f("ix_support_tickets_receipt_id"), "support_tickets", ["receipt_id"], unique=False)
    op.create_index(op.f("ix_support_tickets_status"), "support_tickets", ["status"], unique=False)
    op.create_index(op.f("ix_support_tickets_priority"), "support_tickets", ["priority"], unique=False)
    op.create_index(op.f("ix_support_tickets_category"), "support_tickets", ["category"], unique=False)

    op.create_table(
        "support_ticket_notes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ticket_id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("is_internal", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["ticket_id"], ["support_tickets.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_support_ticket_notes_ticket_id"), "support_ticket_notes", ["ticket_id"], unique=False)

    op.create_table(
        "manual_review_cases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("case_type", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("severity", sa.String(length=40), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("payment_id", sa.Integer(), nullable=True),
        sa.Column("receipt_id", sa.Integer(), nullable=True),
        sa.Column("card_reference", sa.String(length=160), nullable=True),
        sa.Column("provider_reference", sa.String(length=160), nullable=True),
        sa.Column("correlation_id", sa.String(length=120), nullable=True),
        sa.Column("assigned_to", sa.Integer(), nullable=True),
        sa.Column("resolution", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["assigned_to"], ["users.id"]),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.ForeignKeyConstraint(["receipt_id"], ["receipts.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_manual_review_cases_case_type"), "manual_review_cases", ["case_type"], unique=False)
    op.create_index(op.f("ix_manual_review_cases_status"), "manual_review_cases", ["status"], unique=False)
    op.create_index(op.f("ix_manual_review_cases_severity"), "manual_review_cases", ["severity"], unique=False)
    op.create_index(op.f("ix_manual_review_cases_user_id"), "manual_review_cases", ["user_id"], unique=False)
    op.create_index(op.f("ix_manual_review_cases_payment_id"), "manual_review_cases", ["payment_id"], unique=False)
    op.create_index(op.f("ix_manual_review_cases_receipt_id"), "manual_review_cases", ["receipt_id"], unique=False)
    op.create_index(op.f("ix_manual_review_cases_correlation_id"), "manual_review_cases", ["correlation_id"], unique=False)

    op.create_table(
        "manual_review_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("case_id", sa.Integer(), nullable=False),
        sa.Column("actor_id", sa.Integer(), nullable=False),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["case_id"], ["manual_review_cases.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_manual_review_events_case_id"), "manual_review_events", ["case_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_manual_review_events_case_id"), table_name="manual_review_events")
    op.drop_table("manual_review_events")
    op.drop_index(op.f("ix_manual_review_cases_correlation_id"), table_name="manual_review_cases")
    op.drop_index(op.f("ix_manual_review_cases_receipt_id"), table_name="manual_review_cases")
    op.drop_index(op.f("ix_manual_review_cases_payment_id"), table_name="manual_review_cases")
    op.drop_index(op.f("ix_manual_review_cases_user_id"), table_name="manual_review_cases")
    op.drop_index(op.f("ix_manual_review_cases_severity"), table_name="manual_review_cases")
    op.drop_index(op.f("ix_manual_review_cases_status"), table_name="manual_review_cases")
    op.drop_index(op.f("ix_manual_review_cases_case_type"), table_name="manual_review_cases")
    op.drop_table("manual_review_cases")
    op.drop_index(op.f("ix_support_ticket_notes_ticket_id"), table_name="support_ticket_notes")
    op.drop_table("support_ticket_notes")
    op.drop_index(op.f("ix_support_tickets_category"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_priority"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_status"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_receipt_id"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_payment_id"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_user_id"), table_name="support_tickets")
    op.drop_table("support_tickets")
    op.drop_index(op.f("ix_users_role"), table_name="users")
    op.drop_column("users", "role")
