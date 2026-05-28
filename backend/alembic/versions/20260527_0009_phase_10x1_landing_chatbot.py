"""phase 10x1 landing chatbot

Revision ID: 20260527_0009
Revises: 20260527_0008
Create Date: 2026-05-27
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260527_0009"
down_revision: str | None = "20260527_0008"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "chatbot_faqs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("question", sa.String(length=500), nullable=False),
        sa.Column("normalized_question", sa.String(length=500), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("priority", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chatbot_faqs_normalized_question"), "chatbot_faqs", ["normalized_question"], unique=False)
    op.create_index(op.f("ix_chatbot_faqs_category"), "chatbot_faqs", ["category"], unique=False)
    op.create_index(op.f("ix_chatbot_faqs_priority"), "chatbot_faqs", ["priority"], unique=False)
    op.create_index(op.f("ix_chatbot_faqs_is_active"), "chatbot_faqs", ["is_active"], unique=False)

    op.create_table(
        "chatbot_intents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("example_phrases", sa.JSON(), nullable=True),
        sa.Column("response", sa.Text(), nullable=False),
        sa.Column("severity_hint", sa.String(length=40), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chatbot_intents_name"), "chatbot_intents", ["name"], unique=False)
    op.create_index(op.f("ix_chatbot_intents_severity_hint"), "chatbot_intents", ["severity_hint"], unique=False)
    op.create_index(op.f("ix_chatbot_intents_is_active"), "chatbot_intents", ["is_active"], unique=False)

    op.create_table(
        "chatbot_knowledge_entries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=180), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chatbot_knowledge_entries_title"), "chatbot_knowledge_entries", ["title"], unique=False)
    op.create_index(op.f("ix_chatbot_knowledge_entries_category"), "chatbot_knowledge_entries", ["category"], unique=False)
    op.create_index(op.f("ix_chatbot_knowledge_entries_is_active"), "chatbot_knowledge_entries", ["is_active"], unique=False)

    op.create_table(
        "chatbot_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(length=120), nullable=False),
        sa.Column("value", sa.Text(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key"),
    )
    op.create_index(op.f("ix_chatbot_settings_key"), "chatbot_settings", ["key"], unique=False)

    op.create_table(
        "chatbot_conversations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("session_id", sa.String(length=120), nullable=False),
        sa.Column("source", sa.String(length=40), nullable=False),
        sa.Column("page_url", sa.String(length=500), nullable=True),
        sa.Column("started_at", sa.DateTime(), nullable=False),
        sa.Column("last_message_at", sa.DateTime(), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("detected_intent", sa.String(length=120), nullable=True),
        sa.Column("confidence", sa.String(length=40), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chatbot_conversations_session_id"), "chatbot_conversations", ["session_id"], unique=False)
    op.create_index(op.f("ix_chatbot_conversations_source"), "chatbot_conversations", ["source"], unique=False)
    op.create_index(op.f("ix_chatbot_conversations_last_message_at"), "chatbot_conversations", ["last_message_at"], unique=False)
    op.create_index(op.f("ix_chatbot_conversations_status"), "chatbot_conversations", ["status"], unique=False)
    op.create_index(op.f("ix_chatbot_conversations_detected_intent"), "chatbot_conversations", ["detected_intent"], unique=False)
    op.create_index(op.f("ix_chatbot_conversations_confidence"), "chatbot_conversations", ["confidence"], unique=False)

    op.create_table(
        "chatbot_messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("conversation_id", sa.Integer(), nullable=False),
        sa.Column("sender_type", sa.String(length=20), nullable=False),
        sa.Column("message_text_masked", sa.Text(), nullable=False),
        sa.Column("raw_message_stored", sa.Boolean(), nullable=False),
        sa.Column("classification", sa.String(length=80), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["conversation_id"], ["chatbot_conversations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chatbot_messages_conversation_id"), "chatbot_messages", ["conversation_id"], unique=False)
    op.create_index(op.f("ix_chatbot_messages_sender_type"), "chatbot_messages", ["sender_type"], unique=False)
    op.create_index(op.f("ix_chatbot_messages_classification"), "chatbot_messages", ["classification"], unique=False)

    op.create_table(
        "chatbot_fallbacks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("conversation_id", sa.Integer(), nullable=False),
        sa.Column("message_id", sa.Integer(), nullable=True),
        sa.Column("message_text_masked", sa.Text(), nullable=False),
        sa.Column("reason", sa.String(length=160), nullable=False),
        sa.Column("reviewed", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["conversation_id"], ["chatbot_conversations.id"]),
        sa.ForeignKeyConstraint(["message_id"], ["chatbot_messages.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chatbot_fallbacks_conversation_id"), "chatbot_fallbacks", ["conversation_id"], unique=False)
    op.create_index(op.f("ix_chatbot_fallbacks_message_id"), "chatbot_fallbacks", ["message_id"], unique=False)
    op.create_index(op.f("ix_chatbot_fallbacks_reviewed"), "chatbot_fallbacks", ["reviewed"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_chatbot_fallbacks_reviewed"), table_name="chatbot_fallbacks")
    op.drop_index(op.f("ix_chatbot_fallbacks_message_id"), table_name="chatbot_fallbacks")
    op.drop_index(op.f("ix_chatbot_fallbacks_conversation_id"), table_name="chatbot_fallbacks")
    op.drop_table("chatbot_fallbacks")
    op.drop_index(op.f("ix_chatbot_messages_classification"), table_name="chatbot_messages")
    op.drop_index(op.f("ix_chatbot_messages_sender_type"), table_name="chatbot_messages")
    op.drop_index(op.f("ix_chatbot_messages_conversation_id"), table_name="chatbot_messages")
    op.drop_table("chatbot_messages")
    op.drop_index(op.f("ix_chatbot_conversations_confidence"), table_name="chatbot_conversations")
    op.drop_index(op.f("ix_chatbot_conversations_detected_intent"), table_name="chatbot_conversations")
    op.drop_index(op.f("ix_chatbot_conversations_status"), table_name="chatbot_conversations")
    op.drop_index(op.f("ix_chatbot_conversations_last_message_at"), table_name="chatbot_conversations")
    op.drop_index(op.f("ix_chatbot_conversations_source"), table_name="chatbot_conversations")
    op.drop_index(op.f("ix_chatbot_conversations_session_id"), table_name="chatbot_conversations")
    op.drop_table("chatbot_conversations")
    op.drop_index(op.f("ix_chatbot_settings_key"), table_name="chatbot_settings")
    op.drop_table("chatbot_settings")
    op.drop_index(op.f("ix_chatbot_knowledge_entries_is_active"), table_name="chatbot_knowledge_entries")
    op.drop_index(op.f("ix_chatbot_knowledge_entries_category"), table_name="chatbot_knowledge_entries")
    op.drop_index(op.f("ix_chatbot_knowledge_entries_title"), table_name="chatbot_knowledge_entries")
    op.drop_table("chatbot_knowledge_entries")
    op.drop_index(op.f("ix_chatbot_intents_is_active"), table_name="chatbot_intents")
    op.drop_index(op.f("ix_chatbot_intents_severity_hint"), table_name="chatbot_intents")
    op.drop_index(op.f("ix_chatbot_intents_name"), table_name="chatbot_intents")
    op.drop_table("chatbot_intents")
    op.drop_index(op.f("ix_chatbot_faqs_is_active"), table_name="chatbot_faqs")
    op.drop_index(op.f("ix_chatbot_faqs_priority"), table_name="chatbot_faqs")
    op.drop_index(op.f("ix_chatbot_faqs_category"), table_name="chatbot_faqs")
    op.drop_index(op.f("ix_chatbot_faqs_normalized_question"), table_name="chatbot_faqs")
    op.drop_table("chatbot_faqs")
