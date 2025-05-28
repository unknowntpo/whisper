from typing import Literal, Optional, Union, Annotated

from fastapi import APIRouter, status, Depends
from pydantic import BaseModel
from sqlmodel import Session, select
from starlette.responses import HTMLResponse
from starlette.websockets import WebSocket, WebSocketDisconnect

from app.entities.chat_message import ChatMessageBase, ChatMessage
from app.entities.item import Item
from app.infra.engine import engine


class ChatMessageCreateRequest(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessage):
    pass


ChatRouter: APIRouter = APIRouter(prefix="/v1/chat", tags=["chat"])


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

"""
Reference:
https://fastapi.tiangolo.com/advanced/websockets/#in-production
"""

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                // send message to websocket server
                data = {content: input.value}
                console.log(`sending value: ${JSON.stringify(data)}`)
                ws.send(JSON.stringify(data))
                input.value = ''
                event.preventDefault()
            }
            // chatMessageStr: '{"content": "Hello from user1}'
            function appendMessagesToList(chatMessageStr) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(chatMessageStr)
                message.appendChild(content)
                messages.appendChild(message)
            }
            
            async function fetchAndDisplayMessages() {
                const response = await fetch('/v1/chat/messages');
                const messages = await response.json();
                messages.forEach(msg => {
                    appendMessagesToList(msg.content);
                });
            }
            
            document.addEventListener('DOMContentLoaded', fetchAndDisplayMessages);
             
            var ws = new WebSocket("ws://localhost:8000/v1/chat/ws");
            ws.onmessage = function(event) {
                appendMessagesToList(event.data)
            };
        </script>
    </body>
</html>
"""


@ChatRouter.get("/")
async def get():
    return HTMLResponse(html)


@ChatRouter.get("/messages", response_model=list[ChatMessageResponse])
async def read_messages(session: SessionDep) -> list[ChatMessageResponse]:
    """
    get all historical messages
    TODO: get all messages by chatroom id ?
    """

    msgs = session.exec(select(ChatMessage)).all()
    return [ChatMessageResponse.model_validate(msg) for msg in msgs]


# export interface ChatMessage {
#   user_id: string;
#   content: string;
# }

# export interface WebSocketMessage {
#   type: 'messages';
#   data?: ChatMessage[];
# }


class WebSocketMessage(BaseModel):
    type: Literal["messages"]
    data: Optional[list[ChatMessage]] = None


@ChatRouter.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session: SessionDep):
    await websocket.accept()
    try:
        while True:
            msg_json = await websocket.receive_json()
            msg = ChatMessage(**msg_json)
            session.add(msg)
            session.commit()
            session.refresh(msg)
            await websocket.send_json(msg.model_dump())
    except WebSocketDisconnect:
        print("Disconnected")
