"""phase 10d crm workflows

Revision ID: 20260522_0005
Revises: 20260521_0004
Create Date: 2026-05-22
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260522_0005"
down_revision: str | None = "20260521_0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("support_tickets", sa.Column("manual_review_case_id", sa.Integer(), nullable=True))
    op.add_column("support_tickets", sa.Column("correlation_id", sa.String(length=120), nullable=True))
    op.add_column("support_tickets", sa.Column("closed_at", sa.DateTime(), nullable=True))
    op.create_index(
        op.f("ix_support_tickets_manual_review_case_id"),
        "support_tickets",
        ["manual_review_case_id"],
        unique=False,
    )
    op.create_index(op.f("ix_support_tickets_correlation_id"), "support_tickets", ["correlation_id"], unique=False)
    op.create_foreign_key(
        "fk_support_tickets_manual_review_case_id",
        "support_tickets",
        "manual_review_cases",
        ["manual_review_case_id"],
        ["id"],
    )

    op.add_column("manual_review_cases", sa.Column("support_ticket_id", sa.Integer(), nullable=True))
    op.add_column("manual_review_cases", sa.Column("summary", sa.Text(), nullable=False, server_default=""))
    op.add_column("manual_review_cases", sa.Column("closed_at", sa.DateTime(), nullable=True))
    op.create_index(op.f("ix_manual_review_cases_support_ticket_id"), "manual_review_cases", ["support_ticket_id"], unique=False)
    op.create_foreign_key(
        "fk_manual_review_cases_support_ticket_id",
        "manual_review_cases",
        "support_tickets",
        ["support_ticket_id"],
        ["id"],
    )

    op.add_column("manual_review_events", sa.Column("before_status", sa.String(length=40), nullable=True))
    op.add_column("manual_review_events", sa.Column("after_status", sa.String(length=40), nullable=True))
    op.add_column("manual_review_events", sa.Column("note", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("manual_review_events", "note")
    op.drop_column("manual_review_events", "after_status")
    op.drop_column("manual_review_events", "before_status")

    op.drop_constraint(
        "fk_manual_review_cases_support_ticket_id",
        "manual_review_cases",
        type_="foreignkey",
    )
    op.drop_index(op.f("ix_manual_review_cases_support_ticket_id"), table_name="manual_review_cases")
    op.drop_column("manual_review_cases", "closed_at")
    op.drop_column("manual_review_cases", "summary")
    op.drop_column("manual_review_cases", "support_ticket_id")

    op.drop_constraint(
        "fk_support_tickets_manual_review_case_id",
        "support_tickets",
        type_="foreignkey",
    )
    op.drop_index(op.f("ix_support_tickets_correlation_id"), table_name="support_tickets")
    op.drop_index(op.f("ix_support_tickets_manual_review_case_id"), table_name="support_tickets")
    op.drop_column("support_tickets", "closed_at")
    op.drop_column("support_tickets", "correlation_id")
    op.drop_column("support_tickets", "manual_review_case_id")
