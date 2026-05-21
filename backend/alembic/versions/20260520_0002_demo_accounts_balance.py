"""demo accounts and balance snapshots

Revision ID: 20260520_0002
Revises: 20260520_0001
Create Date: 2026-05-20
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260520_0002"
down_revision: str | None = "20260520_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "accounts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("account_type", sa.String(length=80), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("closed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index("ix_accounts_user_id", "accounts", ["user_id"])
    op.create_index("ix_accounts_account_type", "accounts", ["account_type"])
    op.create_index("ix_accounts_status", "accounts", ["status"])

    op.create_table(
        "balance_snapshots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("account_id", sa.Integer(), nullable=False),
        sa.Column("available_minor", sa.Integer(), nullable=False),
        sa.Column("pending_minor", sa.Integer(), nullable=False),
        sa.Column("held_minor", sa.Integer(), nullable=False),
        sa.Column("simulated_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("is_real_money", sa.Boolean(), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_balance_snapshots_account_id", "balance_snapshots", ["account_id"])

    op.create_table(
        "movements",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("account_id", sa.Integer(), nullable=False),
        sa.Column("ledger_entry_id", sa.Integer(), nullable=True),
        sa.Column("payment_id", sa.Integer(), nullable=True),
        sa.Column("receipt_id", sa.Integer(), nullable=True),
        sa.Column("movement_type", sa.String(length=40), nullable=False),
        sa.Column("direction", sa.String(length=20), nullable=False),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"]),
        sa.ForeignKeyConstraint(["ledger_entry_id"], ["ledger_entries.id"]),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"]),
        sa.ForeignKeyConstraint(["receipt_id"], ["receipts.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_movements_account_id", "movements", ["account_id"])
    op.create_index("ix_movements_ledger_entry_id", "movements", ["ledger_entry_id"])
    op.create_index("ix_movements_payment_id", "movements", ["payment_id"])
    op.create_index("ix_movements_receipt_id", "movements", ["receipt_id"])
    op.create_index("ix_movements_movement_type", "movements", ["movement_type"])
    op.create_index("ix_movements_direction", "movements", ["direction"])
    op.create_index("ix_movements_status", "movements", ["status"])


def downgrade() -> None:
    op.drop_index("ix_movements_status", table_name="movements")
    op.drop_index("ix_movements_direction", table_name="movements")
    op.drop_index("ix_movements_movement_type", table_name="movements")
    op.drop_index("ix_movements_receipt_id", table_name="movements")
    op.drop_index("ix_movements_payment_id", table_name="movements")
    op.drop_index("ix_movements_ledger_entry_id", table_name="movements")
    op.drop_index("ix_movements_account_id", table_name="movements")
    op.drop_table("movements")
    op.drop_index("ix_balance_snapshots_account_id", table_name="balance_snapshots")
    op.drop_table("balance_snapshots")
    op.drop_index("ix_accounts_status", table_name="accounts")
    op.drop_index("ix_accounts_account_type", table_name="accounts")
    op.drop_index("ix_accounts_user_id", table_name="accounts")
    op.drop_table("accounts")
