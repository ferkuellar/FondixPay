from collections.abc import Iterable

ADMIN_ROLES = {"SUPPORT", "FINANCE", "ADMIN", "AUDITOR", "SUPER_ADMIN"}

PERMISSIONS_BY_ROLE: dict[str, set[str]] = {
    "SUPPORT": {
        "admin.dashboard.view",
        "admin.users.list",
        "admin.users.view",
        "admin.payments.list",
        "admin.payments.view",
        "admin.receipts.list",
        "admin.receipts.view",
        "admin.notifications.list",
        "admin.notifications.view",
        "admin.search.view",
        "admin.manual_review.list",
        "admin.manual_review.view",
        "admin.support_tickets.list",
        "admin.support_tickets.create",
        "admin.support_tickets.update",
    },
    "FINANCE": {
        "admin.dashboard.view",
        "admin.users.list",
        "admin.users.view",
        "admin.payments.list",
        "admin.payments.view",
        "admin.receipts.list",
        "admin.receipts.view",
        "admin.notifications.list",
        "admin.notifications.view",
        "admin.search.view",
        "admin.reconciliation.card.view",
        "admin.reconciliation.prontipagos.view",
        "admin.manual_review.list",
        "admin.manual_review.view",
        "admin.manual_review.update",
        "admin.support_tickets.list",
    },
    "ADMIN": {
        "admin.dashboard.view",
        "admin.users.list",
        "admin.users.view",
        "admin.payments.list",
        "admin.payments.view",
        "admin.receipts.list",
        "admin.receipts.view",
        "admin.notifications.list",
        "admin.notifications.view",
        "admin.search.view",
        "admin.audit.list",
        "admin.reconciliation.card.view",
        "admin.reconciliation.prontipagos.view",
        "admin.manual_review.list",
        "admin.manual_review.view",
        "admin.manual_review.update",
        "admin.support_tickets.list",
        "admin.support_tickets.create",
        "admin.support_tickets.update",
        "admin.catalog.view",
        "admin.catalog.manage",
    },
    "AUDITOR": {
        "admin.dashboard.view",
        "admin.users.list",
        "admin.users.view",
        "admin.payments.list",
        "admin.payments.view",
        "admin.receipts.list",
        "admin.receipts.view",
        "admin.notifications.list",
        "admin.notifications.view",
        "admin.search.view",
        "admin.audit.list",
        "admin.reconciliation.card.view",
        "admin.reconciliation.prontipagos.view",
        "admin.manual_review.list",
        "admin.manual_review.view",
        "admin.support_tickets.list",
    },
    "SUPER_ADMIN": {
        "admin.dashboard.view",
        "admin.users.list",
        "admin.users.view",
        "admin.payments.list",
        "admin.payments.view",
        "admin.receipts.list",
        "admin.receipts.view",
        "admin.notifications.list",
        "admin.notifications.view",
        "admin.search.view",
        "admin.audit.list",
        "admin.reconciliation.card.view",
        "admin.reconciliation.prontipagos.view",
        "admin.manual_review.list",
        "admin.manual_review.view",
        "admin.manual_review.update",
        "admin.support_tickets.list",
        "admin.support_tickets.create",
        "admin.support_tickets.update",
        "admin.catalog.view",
        "admin.catalog.manage",
        "admin.roles.manage",
        "admin.config.view",
        "admin.config.manage",
    },
}


def normalize_role(role: str | None) -> str:
    return (role or "USER").upper()


def has_permission(role: str | None, permission: str) -> bool:
    return permission in PERMISSIONS_BY_ROLE.get(normalize_role(role), set())


def has_any_role(role: str | None, roles: Iterable[str]) -> bool:
    allowed = {normalize_role(item) for item in roles}
    return normalize_role(role) in allowed
