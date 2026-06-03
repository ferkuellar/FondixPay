"""phase 10d crm workflows

Revision ID: 20260522_0005
Revises: 20260521_0004
Create Date: 2026-05-22

SQLite does not support ALTER TABLE ADD CONSTRAINT or DROP CONSTRAINT.
Tables that require FK additions or removals use op.batch_alter_table()
with recreate="always", which rebuilds the table via copy-and-rename.
PostgreSQL uses the same path without issue; the recreate cost is
acceptable for a dev/migration-time operation.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260522_0005"
down_revision: str | None = "20260521_0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # support_tickets — FK addition requires batch mode on SQLite.
    with op.batch_alter_table("support_tickets", recreate="always") as batch_op:
        batch_op.add_column(sa.Column("manual_review_case_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("correlation_id", sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column("closed_at", sa.DateTime(), nullable=True))
        batch_op.create_index(
            op.f("ix_support_tickets_manual_review_case_id"),
            ["manual_review_case_id"],
            unique=False,
        )
        batch_op.create_index(
            op.f("ix_support_tickets_correlation_id"),
            ["correlation_id"],
            unique=False,
        )
        batch_op.create_foreign_key(
            "fk_support_tickets_manual_review_case_id",
            "manual_review_cases",
            ["manual_review_case_id"],
            ["id"],
        )

    # manual_review_cases — FK addition requires batch mode on SQLite.
    with op.batch_alter_table("manual_review_cases", recreate="always") as batch_op:
        batch_op.add_column(sa.Column("support_ticket_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("summary", sa.Text(), nullable=False, server_default=""))
        batch_op.add_column(sa.Column("closed_at", sa.DateTime(), nullable=True))
        batch_op.create_index(
            op.f("ix_manual_review_cases_support_ticket_id"),
            ["support_ticket_id"],
            unique=False,
        )
        batch_op.create_foreign_key(
            "fk_manual_review_cases_support_ticket_id",
            "support_tickets",
            ["support_ticket_id"],
            ["id"],
        )

    # manual_review_events — add_column only; no FK constraints, no batch needed.
    op.add_column("manual_review_events", sa.Column("before_status", sa.String(length=40), nullable=True))
    op.add_column("manual_review_events", sa.Column("after_status", sa.String(length=40), nullable=True))
    op.add_column("manual_review_events", sa.Column("note", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("manual_review_events", "note")
    op.drop_column("manual_review_events", "after_status")
    op.drop_column("manual_review_events", "before_status")

    # Reverse manual_review_cases first (drops back-reference to support_tickets).
    with op.batch_alter_table("manual_review_cases", recreate="always") as batch_op:
        batch_op.drop_constraint("fk_manual_review_cases_support_ticket_id", type_="foreignkey")
        batch_op.drop_index(op.f("ix_manual_review_cases_support_ticket_id"))
        batch_op.drop_column("closed_at")
        batch_op.drop_column("summary")
        batch_op.drop_column("support_ticket_id")

    # Then reverse support_tickets (drops forward reference to manual_review_cases).
    with op.batch_alter_table("support_tickets", recreate="always") as batch_op:
        batch_op.drop_constraint("fk_support_tickets_manual_review_case_id", type_="foreignkey")
        batch_op.drop_index(op.f("ix_support_tickets_correlation_id"))
        batch_op.drop_index(op.f("ix_support_tickets_manual_review_case_id"))
        batch_op.drop_column("closed_at")
        batch_op.drop_column("correlation_id")
        batch_op.drop_column("manual_review_case_id")
