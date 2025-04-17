from fastapi import APIRouter

from backend.analysis.analysis_dao import AnalysesDAO
from models.models import device, load_embedding_model, load_model, load_tokenizer

from .feed_dao import FeedsDAO

router = APIRouter(prefix="/feed", tags=["Feed"])
tokenizer = load_tokenizer()
embedding_model = load_embedding_model(tokenizer)
model = load_model()


# @router.post("/create")
# async def create_feed(url: str, title: str | None, description: str | None):
#     if not FeedsDAO.find_one_or_none(url=url):
#         await FeedsDAO.add(url=url, title=title, description=description)
#     return {"message": f"Feed {url} was added!"}


@router.post("/import")
async def import_data():
    from crawler.rss_crawler import import_data

    urls = await FeedsDAO.get_all_feed_ids_with_urls()

    count = await import_data(
        urls, tokenizer=tokenizer, embedding_model=embedding_model, device=device
    )
    return {"message": f"{count} news was loaded!"}


class Args:
    feed_id: int
    req_id: int


@router.post("/process")
async def process(req_id: int, feed_id: int):
    from rag.processor import process

    analysis = await AnalysesDAO().find_one_or_none_by_id(req_id)
    if not analysis:
        return Exception("Analysis not found")

    feed = await FeedsDAO().find_one_or_none_by_id(feed_id)
    if not feed:
        return Exception("Feed was not found")

    args = Args()
    args.feed_id = feed.feed_id
    args.req_id = analysis.request_id
    await process(args, tokenizer, model, embedding_model, device)
    return {"message": "Processing started!"}
