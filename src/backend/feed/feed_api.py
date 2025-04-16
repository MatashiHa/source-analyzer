from fastapi import APIRouter

from backend.analysis_dao import AnalysesDAO
from models.models import device, load_embedding_model, load_model, load_tokenizer

from .feed_dao import FeedsDAO

router = APIRouter(prefix="/feed", tags=["Feed"])
tokenizer = load_tokenizer()
embedding_model = load_embedding_model(tokenizer)
model = load_model()


@router.post("/import")
async def import_data():
    from crawler.rss_crawler import import_data

    urls = await FeedsDAO.get_all_feed_ids_with_urls()

    count = await import_data(
        urls, tokenizer=tokenizer, embedding_model=embedding_model, device=device
    )
    return {"message": f"{count} news was loaded."}


class args:
    feed_id: int
    category: str


@router.post("/process")
async def process(url: str, title: str | None, description: str | None, category: str):
    from rag.processor import process

    feed = await FeedsDAO.find_one_or_none(url=url)
    analysis = await AnalysesDAO.find_one_or_none(feed.id)
    if not feed and not analysis:
        await FeedsDAO.add(url=url, title=title, description=description)
        await AnalysesDAO.add(url=url, title=title, category=category, feed=feed)

    AnalysesDAO.add(feed=feed)

    await process(feed, tokenizer, model, embedding_model, device)
    return {"status": "success", "message": "Processing started!"}
