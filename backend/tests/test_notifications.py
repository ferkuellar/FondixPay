from collections.abc import Callable

from fastapi.testclient import TestClient

from app.modules.notifications.models import Notification
from app.modules.users.models import User


def test_notifications_require_auth(client: TestClient) -> None:
    assert client.get("/notifications").status_code == 401


def test_notifications_are_scoped_to_current_user(
    client: TestClient,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_notification: Callable[[User], Notification],
) -> None:
    owner = create_user("5577777777")
    other = create_user("5588888888")
    own_notification = create_notification(owner)
    other_notification = create_notification(other)

    response = client.get("/notifications", headers=auth_headers(owner))
    notification_ids = {item["id"] for item in response.json()}

    assert response.status_code == 200
    assert own_notification.id in notification_ids
    assert other_notification.id not in notification_ids
