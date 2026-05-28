"""phase 10x2 chat operations and escalation

Revision ID: 20260528_0010
Revises: 20260527_0009
Create Date: 2026-05-28
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260528_0010"
down_revision: str | None = "20260527_0009"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("chatbot_conversations", sa.Column("severity", sa.String(length=20), nullable=False, server_default="SEV-4"))
    op.add_column("chatbot_conversations", sa.Column("suggested_severity", sa.String(length=20), nullable=True))
    op.add_column("chatbot_conversations", sa.Column("classification_reason", sa.Text(), nullable=True))
    op.add_column("chatbot_conversations", sa.Column("ai_suggested_severity", sa.String(length=20), nullable=True))
    op.add_column("chatbot_conversations", sa.Column("linked_ticket_id", sa.Integer(), nullable=True))
    op.add_column("chatbot_conversations", sa.Column("assigned_to", sa.Integer(), nullable=True))
    op.add_column("chatbot_conversations", sa.Column("escalation_status", sa.String(length=40), nullable=False, server_default="none"))
    op.add_column("chatbot_conversations", sa.Column("reviewed_at", sa.DateTime(), nullable=True))
    op.add_column("chatbot_conversations", sa.Column("reviewed_by", sa.Integer(), nullable=True))
    op.create_index("ix_chatbot_conversations_severity", "chatbot_conversations", ["severity"])
    op.create_index("ix_chatbot_conversations_suggested_severity", "chatbot_conversations", ["suggested_severity"])
    op.create_index("ix_chatbot_conversations_linked_ticket_id", "chatbot_conversations", ["linked_ticket_id"])
    op.create_index("ix_chatbot_conversations_assigned_to", "chatbot_conversations", ["assigned_to"])
    op.create_index("ix_chatbot_conversations_escalation_status", "chatbot_conversations", ["escalation_status"])
    op.create_foreign_key("fk_chatbot_conversations_assigned_to_users", "chatbot_conversations", "users", ["assigned_to"], ["id"])
    op.create_foreign_key("fk_chatbot_conversations_reviewed_by_users", "chatbot_conversations", "users", ["reviewed_by"], ["id"])

    op.add_column("support_tickets", sa.Column("conversation_id", sa.Integer(), nullable=True))
    op.add_column("support_tickets", sa.Column("ticket_number", sa.String(length=40), nullable=True))
    op.add_column("support_tickets", sa.Column("source", sa.String(length=40), nullable=False, server_default="admin"))
    op.add_column("support_tickets", sa.Column("severity", sa.String(length=20), nullable=False, server_default="SEV-3"))
    op.add_column("support_tickets", sa.Column("title", sa.String(length=180), nullable=True))
    op.add_column("support_tickets", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("support_tickets", sa.Column("customer_message_excerpt", sa.Text(), nullable=True))
    op.add_column("support_tickets", sa.Column("sla_due_at", sa.DateTime(), nullable=True))
    op.add_column("support_tickets", sa.Column("first_response_at", sa.DateTime(), nullable=True))
    op.add_column("support_tickets", sa.Column("resolved_at", sa.DateTime(), nullable=True))
    op.add_column("support_tickets", sa.Column("reopened_at", sa.DateTime(), nullable=True))
    op.create_index("ix_support_tickets_conversation_id", "support_tickets", ["conversation_id"])
    op.create_index("ix_support_tickets_ticket_number", "support_tickets", ["ticket_number"], unique=True)
    op.create_index("ix_support_tickets_source", "support_tickets", ["source"])
    op.create_index("ix_support_tickets_severity", "support_tickets", ["severity"])

    op.create_foreign_key("fk_support_tickets_conversation_id_chatbot", "support_tickets", "chatbot_conversations", ["conversation_id"], ["id"])
    op.create_foreign_key("fk_chatbot_conversations_linked_ticket_id_support", "chatbot_conversations", "support_tickets", ["linked_ticket_id"], ["id"])

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
    op.drop_index("ix_chatbot_internal_notes_created_at", table_name="chatbot_internal_notes")
    op.drop_index("ix_chatbot_internal_notes_author_id", table_name="chatbot_internal_notes")
    op.drop_index("ix_chatbot_internal_notes_conversation_id", table_name="chatbot_internal_notes")
    op.drop_table("chatbot_internal_notes")
    op.drop_index("ix_chatbot_conversation_events_created_at", table_name="chatbot_conversation_events")
    op.drop_index("ix_chatbot_conversation_events_actor_id", table_name="chatbot_conversation_events")
    op.drop_index("ix_chatbot_conversation_events_event_type", table_name="chatbot_conversation_events")
    op.drop_index("ix_chatbot_conversation_events_conversation_id", table_name="chatbot_conversation_events")
    op.drop_table("chatbot_conversation_events")

    op.drop_constraint("fk_chatbot_conversations_linked_ticket_id_support", "chatbot_conversations", type_="foreignkey")
    op.drop_constraint("fk_support_tickets_conversation_id_chatbot", "support_tickets", type_="foreignkey")
    op.drop_index("ix_support_tickets_severity", table_name="support_tickets")
    op.drop_index("ix_support_tickets_source", table_name="support_tickets")
    op.drop_index("ix_support_tickets_ticket_number", table_name="support_tickets")
    op.drop_index("ix_support_tickets_conversation_id", table_name="support_tickets")
    op.drop_column("support_tickets", "reopened_at")
    op.drop_column("support_tickets", "resolved_at")
    op.drop_column("support_tickets", "first_response_at")
    op.drop_column("support_tickets", "sla_due_at")
    op.drop_column("support_tickets", "customer_message_excerpt")
    op.drop_column("support_tickets", "summary")
    op.drop_column("support_tickets", "title")
    op.drop_column("support_tickets", "severity")
    op.drop_column("support_tickets", "source")
    op.drop_column("support_tickets", "ticket_number")
    op.drop_column("support_tickets", "conversation_id")

    op.drop_constraint("fk_chatbot_conversations_reviewed_by_users", "chatbot_conversations", type_="foreignkey")
    op.drop_constraint("fk_chatbot_conversations_assigned_to_users", "chatbot_conversations", type_="foreignkey")
    op.drop_index("ix_chatbot_conversations_escalation_status", table_name="chatbot_conversations")
    op.drop_index("ix_chatbot_conversations_assigned_to", table_name="chatbot_conversations")
    op.drop_index("ix_chatbot_conversations_linked_ticket_id", table_name="chatbot_conversations")
    op.drop_index("ix_chatbot_conversations_suggested_severity", table_name="chatbot_conversations")
    op.drop_index("ix_chatbot_conversations_severity", table_name="chatbot_conversations")
    op.drop_column("chatbot_conversations", "reviewed_by")
    op.drop_column("chatbot_conversations", "reviewed_at")
    op.drop_column("chatbot_conversations", "escalation_status")
    op.drop_column("chatbot_conversations", "assigned_to")
    op.drop_column("chatbot_conversations", "linked_ticket_id")
    op.drop_column("chatbot_conversations", "ai_suggested_severity")
    op.drop_column("chatbot_conversations", "classification_reason")
    op.drop_column("chatbot_conversations", "suggested_severity")
    op.drop_column("chatbot_conversations", "severity")
