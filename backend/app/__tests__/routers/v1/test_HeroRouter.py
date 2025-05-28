import http
import json
from typing import TypeVar

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session

from app.entities.hero import Hero
from app.entities.item import Item
from app.infra.engine import engine
from app.main import app
from app.routers.v1.HeroRouter import get_session
from app.__tests__.utils.utils import trunk_all_tables


# Create a fixture that will be used for all tests
# Use `with` to use TestClient as a context manager
@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


@pytest.fixture(autouse=True)
def before_each():
    trunk_all_tables()


K = TypeVar('K')
V = TypeVar('V')


def exclude_field(d: dict[K, V], keys: list[K]):
    return {k: d[k] for k in d.keys() - keys}


def test_exclude_field():
    d = {"a": 1, "b": 2, "c": 3}
    assert exclude_field(d, ["a"]) == {"b": 2, "c": 3}
    assert exclude_field(d, ["a", "b"]) == {"c": 3}
    assert exclude_field(d, ["a", "b", "c"]) == {}


def test_HeroRouter_get(client):
    hero0 = Hero(name="Car", secret_name="Carl", age=40)
    hero1 = Hero(name="Batman", secret_name="Robin", age=35)

    want_heroes = [hero0, hero1]
    for hero in want_heroes:
        response = client.post("/v1/heroes", json=hero.model_dump())
        assert response.status_code == http.HTTPStatus.CREATED

    # Get heroes and check response
    response = client.get(f"/v1/heroes")
    assert response.status_code == http.HTTPStatus.OK
    got_heroes = response.json()
    assert (
            [exclude_field(hero, ["id"]) for hero in got_heroes]
            ==
            [exclude_field(hero.model_dump(), ["id"]) for hero in want_heroes]
    )
