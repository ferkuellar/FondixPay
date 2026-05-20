from collections.abc import Callable

from fastapi.testclient import TestClient

from app.modules.service_providers.models import ServiceProvider


def test_service_provider_catalog_is_public(
    client: TestClient,
    create_provider: Callable[[str], ServiceProvider],
) -> None:
    provider = create_provider("cfe")

    response = client.get("/service-providers")

    assert response.status_code == 200
    assert any(item["id"] == provider.id for item in response.json())
