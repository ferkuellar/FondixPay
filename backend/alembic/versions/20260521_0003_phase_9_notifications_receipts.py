"""phase 9 notification proof metadata

Revision ID: 20260521_0003
Revises: 20260520_0002
Create Date: 2026-05-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260521_0003"
down_revision: str | None = "20260520_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("notifications", sa.Column("type", sa.String(length=80), nullable=False, server_default="general"))
    op.add_column(
        "notifications",
        sa.Column("title", sa.String(length=120), nullable=False, server_default="Actualizacion"),
    )
    op.add_column("notifications", sa.Column("entity_type", sa.String(length=80), nullable=True))
    op.add_column("notifications", sa.Column("entity_id", sa.String(length=80), nullable=True))


def downgrade() -> None:
    op.drop_column("notifications", "entity_id")
    op.drop_column("notifications", "entity_type")
    op.drop_column("notifications", "title")
    op.drop_column("notifications", "type")
