from sqlmodel import SQLModel, Field


# ChatMessage
class ChatMessageBase(SQLModel):
    content: str


class ChatMessage(ChatMessageBase, table=True):
    __tablename__: str = "chat_message"
    id: int | None = Field(default=None, primary_key=True)
