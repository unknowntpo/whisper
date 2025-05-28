import http
import json

import pytest
from fastapi.testclient import TestClient

from app.entities.item import Item
from app.main import app

# Create a fixture that will be used for all tests
@pytest.fixture
def client():
    return TestClient(app)

def test_ItemRouter_get(client):
    expect_id: int = 3
    response = client.get(f"/v1/items/{expect_id}")
    assert response.status_code == 200
    assert response.json() == {"item_id": expect_id, "q": None}

def test_ItemRouter_post(client):
    item = Item(name="Car", price=1000.00)
    expect_id = 3

    response = client.post(f"/v1/items", json=item.model_dump())

    assert response.status_code == http.HTTPStatus.CREATED
    assert response.json() == {"item_name": item.name, "item_id": expect_id}
