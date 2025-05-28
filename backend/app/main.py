from contextlib import asynccontextmanager
from typing import Union, Annotated
from fastapi import FastAPI, Depends, Query, HTTPException
from pydantic import BaseModel, EmailStr, constr
from sqlalchemy import select
from sqlmodel import Session, SQLModel

from app.infra.engine import create_db_and_tables
from app.entities.hero import Hero
from app.entities.item import Item
from app.routers.v1.ChatRouter import ChatRouter
from app.routers.v1.HeroRouter import HeroRouter
from app.routers.v1.ItemRouter import ItemRouter
from app.routers.v1.healthz import HealthzRouter

@asynccontextmanager
async def lifespan(app):
    print("xxx lifespan startup")
    create_db_and_tables()
    yield
    # Optional: cleanup code here

app = FastAPI(lifespan=lifespan)

app.include_router(HealthzRouter)
app.include_router(ItemRouter)
app.include_router(HeroRouter)
app.include_router(ChatRouter)

class User(BaseModel):
    name: constr(max_length=15)
    email: EmailStr


@app.get("/")
async def read_root() -> dict:
    return {"Hello": "World"}


@app.put("/users")
def add_user(user: User):
    return {"user": user}
