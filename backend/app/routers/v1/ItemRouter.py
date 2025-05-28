from typing import Union

from fastapi import APIRouter, status
from pydantic import BaseModel

from app.entities.item import Item

class ItemResponse(BaseModel):
    item_id: int
    q: Union[str, None] = None

class CreateItemResponse(BaseModel):
    item_name: str
    item_id: int


ItemRouter: APIRouter = APIRouter(prefix="/v1/items", tags=["item"])


@ItemRouter.get("/{item_id}", response_model=ItemResponse)
async def read_item(item_id: int, q: Union[str, None] = None) -> ItemResponse:
    return ItemResponse(item_id=item_id, q=q)


@ItemRouter.post("", response_model=CreateItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(item: Item) -> CreateItemResponse:
    # FIXME: use real id
    item_id: int = 3
    return CreateItemResponse(item_name=item.name, item_id=item_id)
