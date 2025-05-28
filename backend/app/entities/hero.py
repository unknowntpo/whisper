from typing import Annotated

from sqlmodel import Field, Session, SQLModel, create_engine, select

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
