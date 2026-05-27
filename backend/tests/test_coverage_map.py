from fastapi.testclient import TestClient


def test_coverage_map_is_reference_only(client: TestClient) -> None:
    response = client.get("/coverage-map")

    assert response.status_code == 200
    body = response.json()
    assert body["reference_only"] is True
    assert body["payment_availability_not_guaranteed"] is True
    assert body["national_reference_count"] == 38
    assert "Cobertura referencial" in body["disclaimer"]


def test_coverage_map_state_distinguishes_reference_and_payable(client: TestClient) -> None:
    response = client.get("/coverage-map/states/GTO")

    assert response.status_code == 200
    body = response.json()
    assert body["state_code"] == "GTO"
    assert body["reference_only"] is True
    assert len(body["reference_services"]) > 0
    assert body["payable_services"] == []

