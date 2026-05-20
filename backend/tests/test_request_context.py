from fastapi.testclient import TestClient


def test_request_id_header_is_echoed(client: TestClient) -> None:
    response = client.get("/health", headers={"X-Request-ID": "req-explicit"})

    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == "req-explicit"


def test_request_id_header_is_generated(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.headers["X-Request-ID"].startswith("req_")
