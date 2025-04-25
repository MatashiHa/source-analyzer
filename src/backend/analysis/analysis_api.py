from fastapi import APIRouter, Request

from backend.analysis.analysis_dao import AnalysesDAO
from backend.auth.auth_api import get_current_user
from backend.feed.feed_dao import FeedsDAO

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/create")
async def create_new_analysis(request: Request):
    data = await request.json()
    name = data["name"]
    categories = data["categories"]
    type = data["type"]  # single or monitoring
    source_type = data["source_type"]  # links or files
    # необязательные поля получаем через get
    description = data.get("description")
    examples = data.get("examples")
    urls = data.get("urls")
    docs = data.get("docs")
    print(docs)

    user = await get_current_user(request)
    feed_dao = FeedsDAO()

    if source_type == "links" and type == "monitoring":
        urls = urls.split()
        # feeds_to_process = []
        for url in urls:
            feed = await feed_dao.find_one_or_none(url=url)
            if feed:
                await feed_dao.connect_user_to_existing_feed(
                    user_id=user.user_id, feed_id=feed.feed_id
                )
            else:
                await feed_dao.add(url=url)
            # feeds_to_process.append((feed.feed_id, feed.url)) пока обработка идёт только с помощью планировщика

    # if source_type == "files" and type == "single":
    #     files =

    if examples:
        examples = examples.split(";")
        import re

        formated_list = []
        for example in examples:
            example = example.strip()
            result = re.search(
                r"<Text>(?P<text>.+?)<Prediction>(?P<prediction>.+?)$", example
            )
            if not result:
                continue
            text, prediction = (
                result.group("text").strip(),
                result.group("prediction").strip(),
            )
            formated_example = f"""
            Category: {categories},
            Text: {text},
            predicted_class: {prediction}
            """
            formated_list.append(formated_example)
        formated_examples = "".join(formated_list)

    await AnalysesDAO().add(
        name=name,
        category=categories,
        examples=formated_examples,
        user_id=user.user_id,
        analysis_type=type,
        description=description,
    )

    # При автоматической обработке с помощью оркестратора это делать не нужно
    # from models.models import device, load_embedding_model, load_tokenizer

    # tokenizer = load_tokenizer()
    # embedding_model = load_embedding_model(tokenizer)
    # import_data(feeds_to_process, tokenizer, embedding_model, device)


def get_analyses():
    pass


@router.get("/templates")
async def get_templates(request: Request):
    user = await get_current_user(request)
    analysis_dao = AnalysesDAO()
    users_analyses = await analysis_dao.find_all(user_id=user.user_id)
    templates = [
        {
            "id": analysis.request_id,
            "name": analysis.name,
            "description": analysis.description,
            "categories": [
                x.strip() for x in analysis.category.split(",") if x.strip()
            ],
            "isDefault": False,
        }
        for analysis in users_analyses
    ]
    return {"templates": templates}
