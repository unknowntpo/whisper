from fastapi import APIRouter

HealthzRouter: APIRouter = APIRouter(prefix="/v1/healthz", tags=["healthz"])

@HealthzRouter.get("")
async def healthcheck() -> dict:
    return {"status": "ok"}
