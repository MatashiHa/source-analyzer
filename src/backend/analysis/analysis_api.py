from fastapi import APIRouter, Request

from backend.auth.auth_api import get_current_user
from backend.feed.feed_dao import FeedsDAO

# class Analysis(BaseModel):
#     name: str
#     type: str
#     categories: str
#     examples: str
#     source_type: str
#     urls: str

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/create")
async def create_new_analysis(request: Request):
    # name: str = Form(...)
    # type: str = Form(...)
    # categories: str = Form(...)
    # examples: str = Form("")
    # source_type: str = Form(...)
    # urls: str = Form("")
    # name: str = request.
    data = await request.json()
    name = data["name"]
    type = data["type"]
    categories = data["categories"]
    examples = data.get("examples")
    source_type = data["source_type"]
    urls = data["urls"]
    user = await get_current_user(request)
    feed_dao = FeedsDAO()

    if source_type == "links" and type == "monitoring":
        urls = urls.split()
        feeds_to_process = []
        for url in urls:
            feed = feed_dao.find_one_or_none(url=url)
            if feed:
                await feed_dao.connect_user_to_existing_feed(user_id=user.user_id)
            else:
                feed = feed_dao.add(url=url)

            feeds_to_process.append((feed.feed_id, feed.url))

    if examples:
        examples = examples.split(";")
        import re

        formated_examples = ""
        for example in examples:
            result = re.search(r"<Text>(.*?)<Prediction>(.*?)", example)
            if not result:
                continue
            text, prediction = result.group(1), result.group(2)
            formated_example = f"""
            Category: {categories},
            Text: {text},
            predicted_class: {prediction}\n
            """
            formated_examples.join(formated_example)

    from backend.analysis.analysis_dao import AnalysesDAO

    await AnalysesDAO().add(
        name=name, category=categories, examples=formated_examples, user_id=user.user_id
    )

    # При автоматической обработке с помощью оркестратора это делать не нужно
    # from models.models import device, load_embedding_model, load_tokenizer

    # tokenizer = load_tokenizer()
    # embedding_model = load_embedding_model(tokenizer)
    # import_data(feeds_to_process, tokenizer, embedding_model, device)
