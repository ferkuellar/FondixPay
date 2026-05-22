from fastapi.testclient import TestClient


def test_admin_dashboard_requires_token_and_admin_role(client: TestClient, create_user, auth_headers) -> None:
    normal_user = create_user("5510000000")

    assert client.get("/admin/dashboard").status_code == 401
    assert client.get("/admin/dashboard", headers=auth_headers(normal_user)).status_code == 403


def test_support_cannot_view_audit_or_reconciliation(client: TestClient, create_user, auth_headers) -> None:
    support = create_user("5510000001", "SUPPORT")

    assert client.get("/admin/dashboard", headers=auth_headers(support)).status_code == 200
    assert client.get("/admin/audit-events", headers=auth_headers(support)).status_code == 403
    assert client.get("/admin/reconciliation/card", headers=auth_headers(support)).status_code == 403


def test_finance_reconciliation_and_auditor_read_only_permissions(client: TestClient, create_user, auth_headers) -> None:
    finance = create_user("5510000002", "FINANCE")
    auditor = create_user("5510000003", "AUDITOR")

    assert client.get("/admin/reconciliation/prontipagos", headers=auth_headers(finance)).json()["status"] == "not_implemented"
    assert client.get("/admin/audit-events", headers=auth_headers(auditor)).status_code == 200
    assert client.post(
        "/admin/support/tickets",
        headers=auth_headers(auditor),
        json={"subject": "No write", "category": "other"},
    ).status_code == 403
