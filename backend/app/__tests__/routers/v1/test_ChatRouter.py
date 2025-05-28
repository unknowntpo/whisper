import http
import json

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.__tests__.utils.utils import trunk_all_tables
from app.entities.chat_message import ChatMessage
from app.entities.item import Item
from app.infra.engine import engine
from app.main import app
from app.routers.v1.ChatRouter import ChatMessageCreateRequest
from app.routers.v1.HeroRouter import get_session


# Create a fixture that will be used for all tests
# Use `with` to use TestClient as a context manager
@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


@pytest.fixture(autouse=True)
def before_each():
    trunk_all_tables()


def test_ChatRouter_read_messages(client):
    msgs = [ChatMessage(content="Hello from user1"), ChatMessage(content="Hello from user2")]
    with Session(engine) as session:
        for msg in msgs:
            session.add(msg)
        session.commit()
        for msg in msgs:
            session.refresh(msg)

    response = client.get("/v1/chat/messages")
    assert response.status_code == http.HTTPStatus.OK
    got_messages = [ChatMessage(**data) for data in response.json()]
    assert len(got_messages) == 2
    assert got_messages == msgs

def test_ChatRouter_chat(client):
    with client.websocket_connect("/v1/chat/ws") as ws:
        msg = ChatMessageCreateRequest(content="Hello from user1")
        ws.send_json(msg.model_dump())
        got = ws.receive_json()
        with Session(engine) as session:
            rows = session.exec(select(ChatMessage)).all()
            assert len(rows) == 1
            # FIXME: why this is ChatMessage, not sqlalchemy.engine.row.Row ?
            got_msg = rows[0]
            assert got_msg.content == msg.content


def test_ChatRouter_get_messages(client):
    """
    fetch all historical messages
    """
