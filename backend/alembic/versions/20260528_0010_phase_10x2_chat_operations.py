"""phase 10x2 chat operations and escalation

Revision ID: 20260528_0010
Revises: 20260527_0009
Create Date: 2026-05-28

SQLite does not support ALTER TABLE ADD CONSTRAINT or DROP CONSTRAINT.
Tables that require FK additions or removals use op.batch_alter_table()
with recreate="always", which rebuilds the table via copy-and-rename.
PostgreSQL uses the same path without issue; the recreate cost is
acceptable for a dev/migration-time operation.

chatbot_conversations and support_tickets share a circular FK
(linked_ticket_id ↔ conversation_id). SQLite does not enforce FKs at
DDL time, so each table can be rebuilt independently in sequence without
a deferred constraint workaround.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260528_0010"
down_revision: str | None = "20260527_0009"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # chatbot_conversations — FK additions require batch mode on SQLite.
    # All columns, indexes, and all three FKs are added in a single batch pass.
    with op.batch_alter_table("chatbot_conversations", recreate="always") as batch_op:
        batch_op.add_column(sa.Column("severity", sa.String(length=20), nullable=False, server_default="SEV-4"))
        batch_op.add_column(sa.Column("suggested_severity", sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column("classification_reason", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("ai_suggested_severity", sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column("linked_ticket_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("assigned_to", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("escalation_status", sa.String(length=40), nullable=False, server_default="none"))
        batch_op.add_column(sa.Column("reviewed_at", sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column("reviewed_by", sa.Integer(), nullable=True))
        batch_op.create_index("ix_chatbot_conversations_severity", ["severity"])
        batch_op.create_index("ix_chatbot_conversations_suggested_severity", ["suggested_severity"])
        batch_op.create_index("ix_chatbot_conversations_linked_ticket_id", ["linked_ticket_id"])
        batch_op.create_index("ix_chatbot_conversations_assigned_to", ["assigned_to"])
        batch_op.create_index("ix_chatbot_conversations_escalation_status", ["escalation_status"])
        batch_op.create_foreign_key("fk_chatbot_conversations_assigned_to_users", "users", ["assigned_to"], ["id"])
        batch_op.create_foreign_key("fk_chatbot_conversations_reviewed_by_users", "users", ["reviewed_by"], ["id"])
        batch_op.create_foreign_key("fk_chatbot_conversations_linked_ticket_id_support", "support_tickets", ["linked_ticket_id"], ["id"])

    # support_tickets — FK addition requires batch mode on SQLite.
    # chatbot_conversations was rebuilt above, so the FK target exists.
    with op.batch_alter_table("support_tickets", recreate="always") as batch_op:
        batch_op.add_column(sa.Column("conversation_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("ticket_number", sa.String(length=40), nullable=True))
        batch_op.add_column(sa.Column("source", sa.String(length=40), nullable=False, server_default="admin"))
        batch_op.add_column(sa.Column("severity", sa.String(length=20), nullable=False, server_default="SEV-3"))
        batch_op.add_column(sa.Column("title", sa.String(length=180), nullable=True))
        batch_op.add_column(sa.Column("summary", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("customer_message_excerpt", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("sla_due_at", sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column("first_response_at", sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column("resolved_at", sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column("reopened_at", sa.DateTime(), nullable=True))
        batch_op.create_index("ix_support_tickets_conversation_id", ["conversation_id"])
        batch_op.create_index("ix_support_tickets_ticket_number", ["ticket_number"], unique=True)
        batch_op.create_index("ix_support_tickets_source", ["source"])
        batch_op.create_index("ix_support_tickets_severity", ["severity"])
        batch_op.create_foreign_key("fk_support_tickets_conversation_id_chatbot", "chatbot_conversations", ["conversation_id"], ["id"])

    # chatbot_conversation_events — created fresh; FKs declared inline, no batch needed.
    op.create_table(
        "chatbot_conversation_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("conversation_id", sa.Integer(), nullable=False),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("actor_id", sa.Integer(), nullable=True),
        sa.Column("before_json", sa.JSON(), nullable=True),
        sa.Column("after_json", sa.JSON(), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["conversation_id"], ["chatbot_conversations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_chatbot_conversation_events_conversation_id", "chatbot_conversation_events", ["conversation_id"])
    op.create_index("ix_chatbot_conversation_events_event_type", "chatbot_conversation_events", ["event_type"])
    op.create_index("ix_chatbot_conversation_events_actor_id", "chatbot_conversation_events", ["actor_id"])
    op.create_index("ix_chatbot_conversation_events_created_at", "chatbot_conversation_events", ["created_at"])

    # chatbot_internal_notes — created fresh; FKs declared inline, no batch needed.
    op.create_table(
        "chatbot_internal_notes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("conversation_id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["conversation_id"], ["chatbot_conversations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_chatbot_internal_notes_conversation_id", "chatbot_internal_notes", ["conversation_id"])
    op.create_index("ix_chatbot_internal_notes_author_id", "chatbot_internal_notes", ["author_id"])
    op.create_index("ix_chatbot_internal_notes_created_at", "chatbot_internal_notes", ["created_at"])


def downgrade() -> None:
    # Drop child tables first — both reference chatbot_conversations.
    op.drop_index("ix_chatbot_internal_notes_created_at", table_name="chatbot_internal_notes")
    op.drop_index("ix_chatbot_internal_notes_author_id", table_name="chatbot_internal_notes")
    op.drop_index("ix_chatbot_internal_notes_conversation_id", table_name="chatbot_internal_notes")
    op.drop_table("chatbot_internal_notes")
    op.drop_index("ix_chatbot_conversation_events_created_at", table_name="chatbot_conversation_events")
    op.drop_index("ix_chatbot_conversation_events_actor_id", table_name="chatbot_conversation_events")
    op.drop_index("ix_chatbot_conversation_events_event_type", table_name="chatbot_conversation_events")
    op.drop_index("ix_chatbot_conversation_events_conversation_id", table_name="chatbot_conversation_events")
    op.drop_table("chatbot_conversation_events")

    # support_tickets — drop FK to chatbot_conversations first to break the circular
    # reference, then drop indexes and columns.
    with op.batch_alter_table("support_tickets", recreate="always") as batch_op:
        batch_op.drop_constraint("fk_support_tickets_conversation_id_chatbot", type_="foreignkey")
        batch_op.drop_index("ix_support_tickets_severity")
        batch_op.drop_index("ix_support_tickets_source")
        batch_op.drop_index("ix_support_tickets_ticket_number")
        batch_op.drop_index("ix_support_tickets_conversation_id")
        batch_op.drop_column("reopened_at")
        batch_op.drop_column("resolved_at")
        batch_op.drop_column("first_response_at")
        batch_op.drop_column("sla_due_at")
        batch_op.drop_column("customer_message_excerpt")
        batch_op.drop_column("summary")
        batch_op.drop_column("title")
        batch_op.drop_column("severity")
        batch_op.drop_column("source")
        batch_op.drop_column("ticket_number")
        batch_op.drop_column("conversation_id")

    # chatbot_conversations — support_tickets no longer references it, safe to rebuild.
    with op.batch_alter_table("chatbot_conversations", recreate="always") as batch_op:
        batch_op.drop_constraint("fk_chatbot_conversations_linked_ticket_id_support", type_="foreignkey")
        batch_op.drop_constraint("fk_chatbot_conversations_reviewed_by_users", type_="foreignkey")
        batch_op.drop_constraint("fk_chatbot_conversations_assigned_to_users", type_="foreignkey")
        batch_op.drop_index("ix_chatbot_conversations_escalation_status")
        batch_op.drop_index("ix_chatbot_conversations_assigned_to")
        batch_op.drop_index("ix_chatbot_conversations_linked_ticket_id")
        batch_op.drop_index("ix_chatbot_conversations_suggested_severity")
        batch_op.drop_index("ix_chatbot_conversations_severity")
        batch_op.drop_column("reviewed_by")
        batch_op.drop_column("reviewed_at")
        batch_op.drop_column("escalation_status")
        batch_op.drop_column("assigned_to")
        batch_op.drop_column("linked_ticket_id")
        batch_op.drop_column("ai_suggested_severity")
        batch_op.drop_column("classification_reason")
        batch_op.drop_column("suggested_severity")
        batch_op.drop_column("severity")
