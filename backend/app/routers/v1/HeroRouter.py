import http
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlmodel import Session

from app.infra.engine import engine, create_db_and_tables
from app.entities.hero import Hero, HeroBase

HeroRouter = APIRouter(prefix="/v1/heroes", tags=["item"])


def get_session():
    with Session(engine) as session:
        print(f" in get session: engine: {engine}")
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

class HeroCreateRequest(HeroBase):
    pass

class HeroResponse(HeroBase):
    id: int

@HeroRouter.post("", response_model=HeroResponse, status_code=http.HTTPStatus.CREATED)
def create_hero(req: HeroCreateRequest, session: SessionDep) -> HeroResponse:
    hero: Hero = Hero(**req.model_dump())
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return HeroResponse(**hero.model_dump())

@HeroRouter.get("")
async def read_heroes(session: SessionDep) -> list[HeroResponse]:
    rows = session.exec(select(Hero)).all()
    print(type(rows[0]))
    # row has type sqlalchemy.engine.row.Row, we need to get the Hero object from row._mapping
    return [HeroResponse(**row._mapping["Hero"].model_dump()) for row in rows]


@HeroRouter.get("/{hero_id}", response_model=HeroResponse)
def read_hero(hero_id: int, session: SessionDep) -> HeroResponse:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return HeroResponse(**hero.model_dump())


@HeroRouter.delete("/{hero_id}", response_model=dict)
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
