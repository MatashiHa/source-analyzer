from fastapi import APIRouter, Request

from backend.auth.auth_api import get_current_user
from backend.feed.feed_dao import FeedsDAO

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/create")
async def create_new_analysis(request: Request):
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
    if examples:
        examples = examples.split(";")
        import re

        formated_list = []
        for example in examples:
            example = example.strip()
            result = re.search(
                r"<Text>(?P<text>.+?)<Prediction>(?P<prediction>.+?)$", example
            )
            print(result)
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
    from backend.analysis.analysis_dao import AnalysesDAO

    await AnalysesDAO().add(
        name=name,
        category=categories,
        examples=formated_examples,
        user_id=user.user_id,
        analysis_type=type,
    )

    # При автоматической обработке с помощью оркестратора это делать не нужно
    # from models.models import device, load_embedding_model, load_tokenizer

    # tokenizer = load_tokenizer()
    # embedding_model = load_embedding_model(tokenizer)
    # import_data(feeds_to_process, tokenizer, embedding_model, device)
