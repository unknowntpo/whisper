import pytest
from fastapi.testclient import TestClient
from app.main import app


# Create a fixture that will be used for all tests
@pytest.fixture
def client():
    return TestClient(app)


# Create a fixture for valid user data that can be reused
@pytest.fixture
def valid_user_data():
    return {"name": "John Doe", "email": "john@example.com"}


# Test cases using fixtures
def test_add_user_success(client, valid_user_data):
    response = client.put("/users", json=valid_user_data)
    assert response.status_code == 200
    assert response.json() == {"user": valid_user_data}


@pytest.mark.parametrize(
    "invalid_user_data, expected_status_code",
    [
        ({"name": "John Doe", "email": "invalid-email"}, 422),  # Invalid email format
        (
            {
                "name": "This is a very long name that exceeds limit",
                "email": "john@example.com",
            },
            422,  # Name too long
        ),
        ({"name": "John Doe"}, 422),  # Missing email
        ({"email": "john@example.com"}, 422),  # Missing name
    ],
)
def test_add_user_validation_errors(client, invalid_user_data, expected_status_code):
    response = client.put("/users", json=invalid_user_data)
    assert response.status_code == expected_status_code
