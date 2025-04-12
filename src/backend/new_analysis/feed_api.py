from fastapi import APIRouter
from feed_dao import FeedsDAO

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.post("/create")
async def create_feeds(new_feeds):
    for feed in new_feeds:
        await FeedsDAO.add(**feed)
