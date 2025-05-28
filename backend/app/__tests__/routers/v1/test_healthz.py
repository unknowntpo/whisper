import pytest
from fastapi.testclient import TestClient
from app.main import app

# Create a fixture that will be used for all tests
# Use `with` to use TestClient as a context manager
@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

def test_healthz(client):
    response = client.get("/v1/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
