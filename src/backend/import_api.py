# from feed_dao import FeedsDAO
from database.models import Feed
from fastapi import APIRouter
from sqlalchemy import select

router = APIRouter(prefix="/import-data", tags=["Import"])


@router.post("/")
async def import_data():
    from crawler.rss_crawler import import_data
    from models.models import device, embedding_model, tokenizer

    urls = select(Feed.url)
    import_data(
        urls, tokenizer=tokenizer, embedding_model=embedding_model, device=device
    )
    return {"message": "Data is loaded!"}
