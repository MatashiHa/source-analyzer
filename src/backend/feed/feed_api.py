from fastapi import APIRouter

from .feed_dao import FeedsDAO

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.post("/create")
async def create_feed(feed_url: str):
    await FeedsDAO.add(url=feed_url)
    return {"status": "success", "url": feed_url}


@router.post("/import")
async def import_data():
    from crawler.rss_crawler import import_data
    from models.models import device, load_embedding_model, load_tokenizer

    tokenizer = load_tokenizer()
    embedding_model = load_embedding_model(tokenizer)
    urls = await FeedsDAO.get_all_feed_ids_with_urls()

    count = await import_data(
        urls, tokenizer=tokenizer, embedding_model=embedding_model, device=device
    )
    return {"message": f"{count} news was loaded."}


class Args:
    feed_id: str
    category: str


@router.post("/process")
async def process(feed_id: int, category: str):
    from models.models import device, load_embedding_model, load_model, load_tokenizer
    from rag.processor import process

    args = Args()
    args.feed_id = feed_id
    args.category = category
    tokenizer = load_tokenizer()
    embedding_model = load_embedding_model(tokenizer)
    model = load_model()
    await process(args, tokenizer, model, embedding_model, device)
    return {"status": "success", "message": "Processing started!"}
