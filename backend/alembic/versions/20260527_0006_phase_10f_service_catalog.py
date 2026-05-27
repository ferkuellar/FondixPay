"""phase 10f coverage aware service catalog

Revision ID: 20260527_0006
Revises: 20260522_0005
Create Date: 2026-05-27
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260527_0006"
down_revision: str | None = "20260522_0005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "catalog_service_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("code", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_catalog_service_categories_code"), "catalog_service_categories", ["code"], unique=True)

    op.create_table(
        "service_catalog_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("display_name", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=180), nullable=False),
        sa.Column("icon_key", sa.String(length=40), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_national", sa.Boolean(), nullable=False),
        sa.Column("coverage_status", sa.String(length=40), nullable=False),
        sa.Column("visible_on_landing", sa.Boolean(), nullable=False),
        sa.Column("visible_on_mobile", sa.Boolean(), nullable=False),
        sa.Column("payable_in_mobile", sa.Boolean(), nullable=False),
        sa.Column("visible_on_admin", sa.Boolean(), nullable=False),
        sa.Column("show_in_coverage_map", sa.Boolean(), nullable=False),
        sa.Column("is_mock", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["category_id"], ["catalog_service_categories.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_service_catalog_items_category_id"), "service_catalog_items", ["category_id"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_coverage_status"), "service_catalog_items", ["coverage_status"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_display_name"), "service_catalog_items", ["display_name"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_payable_in_mobile"), "service_catalog_items", ["payable_in_mobile"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_show_in_coverage_map"), "service_catalog_items", ["show_in_coverage_map"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_slug"), "service_catalog_items", ["slug"], unique=True)
    op.create_index(op.f("ix_service_catalog_items_visible_on_admin"), "service_catalog_items", ["visible_on_admin"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_visible_on_landing"), "service_catalog_items", ["visible_on_landing"], unique=False)
    op.create_index(op.f("ix_service_catalog_items_visible_on_mobile"), "service_catalog_items", ["visible_on_mobile"], unique=False)

    op.create_table(
        "coverage_map_sources",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("source_name", sa.String(length=120), nullable=False),
        sa.Column("source_type", sa.String(length=80), nullable=False),
        sa.Column("file_path", sa.String(length=260), nullable=True),
        sa.Column("version", sa.String(length=80), nullable=True),
        sa.Column("imported_at", sa.DateTime(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_coverage_map_sources_source_name"), "coverage_map_sources", ["source_name"], unique=False)
    op.create_index(op.f("ix_coverage_map_sources_source_type"), "coverage_map_sources", ["source_type"], unique=False)

    op.create_table(
        "provider_service_capabilities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("service_catalog_item_id", sa.Integer(), nullable=False),
        sa.Column("provider_name", sa.String(length=80), nullable=False),
        sa.Column("provider_service_code", sa.String(length=120), nullable=True),
        sa.Column("supports_reference_validation", sa.Boolean(), nullable=False),
        sa.Column("supports_amount_lookup", sa.Boolean(), nullable=False),
        sa.Column("supports_payment_execution", sa.Boolean(), nullable=False),
        sa.Column("supports_receipt", sa.Boolean(), nullable=False),
        sa.Column("min_amount_minor", sa.Integer(), nullable=True),
        sa.Column("max_amount_minor", sa.Integer(), nullable=True),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["service_catalog_item_id"], ["service_catalog_items.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_provider_service_capabilities_provider_name"), "provider_service_capabilities", ["provider_name"], unique=False)
    op.create_index(op.f("ix_provider_service_capabilities_service_catalog_item_id"), "provider_service_capabilities", ["service_catalog_item_id"], unique=False)
    op.create_index(op.f("ix_provider_service_capabilities_status"), "provider_service_capabilities", ["status"], unique=False)

    op.create_table(
        "service_coverage_by_state",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("service_catalog_item_id", sa.Integer(), nullable=False),
        sa.Column("state_code", sa.String(length=3), nullable=False),
        sa.Column("state_name", sa.String(length=120), nullable=False),
        sa.Column("coverage_status", sa.String(length=40), nullable=False),
        sa.Column("source", sa.String(length=120), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["service_catalog_item_id"], ["service_catalog_items.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("service_catalog_item_id", "state_code", name="uq_service_coverage_state"),
    )
    op.create_index(op.f("ix_service_coverage_by_state_coverage_status"), "service_coverage_by_state", ["coverage_status"], unique=False)
    op.create_index(op.f("ix_service_coverage_by_state_service_catalog_item_id"), "service_coverage_by_state", ["service_catalog_item_id"], unique=False)
    op.create_index(op.f("ix_service_coverage_by_state_state_code"), "service_coverage_by_state", ["state_code"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_service_coverage_by_state_state_code"), table_name="service_coverage_by_state")
    op.drop_index(op.f("ix_service_coverage_by_state_service_catalog_item_id"), table_name="service_coverage_by_state")
    op.drop_index(op.f("ix_service_coverage_by_state_coverage_status"), table_name="service_coverage_by_state")
    op.drop_table("service_coverage_by_state")

    op.drop_index(op.f("ix_provider_service_capabilities_status"), table_name="provider_service_capabilities")
    op.drop_index(op.f("ix_provider_service_capabilities_service_catalog_item_id"), table_name="provider_service_capabilities")
    op.drop_index(op.f("ix_provider_service_capabilities_provider_name"), table_name="provider_service_capabilities")
    op.drop_table("provider_service_capabilities")

    op.drop_index(op.f("ix_coverage_map_sources_source_type"), table_name="coverage_map_sources")
    op.drop_index(op.f("ix_coverage_map_sources_source_name"), table_name="coverage_map_sources")
    op.drop_table("coverage_map_sources")

    op.drop_index(op.f("ix_service_catalog_items_visible_on_mobile"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_visible_on_landing"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_visible_on_admin"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_slug"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_show_in_coverage_map"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_payable_in_mobile"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_display_name"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_coverage_status"), table_name="service_catalog_items")
    op.drop_index(op.f("ix_service_catalog_items_category_id"), table_name="service_catalog_items")
    op.drop_table("service_catalog_items")

    op.drop_index(op.f("ix_catalog_service_categories_code"), table_name="catalog_service_categories")
    op.drop_table("catalog_service_categories")

