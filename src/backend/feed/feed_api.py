from fastapi import APIRouter
from sqlalchemy import select

from .feed_dao import FeedsDAO

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.post("/create")
async def create_feed(feed_url: str):  # принимаем feed_url как параметр функции
    print(feed_url)
    await FeedsDAO.add(url=feed_url)
    return {"status": "success", "url": feed_url}  # рекомендуется возвращать ответ


@router.post("/import")
async def import_data():
    from database.models import Feed

    from crawler.rss_crawler import import_data
    from models.models import device, embedding_model, tokenizer

    urls = select(Feed.url)
    import_data(
        urls, tokenizer=tokenizer, embedding_model=embedding_model, device=device
    )
    return {"status": "success", "message": "Data is loaded!"}
