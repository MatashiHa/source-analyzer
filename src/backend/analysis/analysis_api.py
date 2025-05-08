from fastapi import APIRouter, Request

from backend.analysis.analysis_dao import AnalysesDAO
from backend.auth.auth_api import get_current_user
from backend.document.document_api import process
from backend.document.document_dao import DocumentsDAO
from backend.feed.feed_dao import FeedsDAO
from utils import split_text_into_paragraphs


def examples_formatting(examples: str, categories):
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
    return "".join(formated_list)


router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/create")
async def create_new_analysis(request: Request):
    data = await request.json()
    name: str = data["name"]
    categories: str = data["categories"]
    analysis_type: str = data["type"]  # single or monitoring
    source_type: str = data["source_type"]  # links or files
    # необязательные поля получаем через get
    description: str = data.get("description")
    examples: str = data.get("examples")
    urls: str = data.get("urls")
    document: str = data.get("docs")

    user = await get_current_user(request)
    feed_dao = FeedsDAO()

    # async def process_sources():
    # обработка фидов запускается по расписанию планировщиком
    if source_type == "links" and analysis_type == "monitoring":
        urls_arr = urls.split()
        # feeds_to_process = []
        for url in urls_arr:
            feed = await feed_dao.find_one_or_none(url=url)
            if feed:
                await feed_dao.connect_user_to_existing_feed(
                    user_id=user.user_id, feed_id=feed.feed_id
                )
            else:
                await feed_dao.add(url=url)

    # загрузка документов в БД
    if analysis_type == "single":
        if source_type == "files":
            title = split_text_into_paragraphs(document, 50)
            description = split_text_into_paragraphs(document, 300)
            document_obj = await DocumentsDAO().add(
                title=title, content=document, user_id=user.user_id
            )

        if source_type == "links":
            pass  # TODO

    formated_examples = examples_formatting(examples, categories) if examples else ""

    # создаение анализа
    analysis_obj = await AnalysesDAO().add(
        name=name,
        category=categories,
        examples=formated_examples,
        user_id=user.user_id,
        analysis_type=analysis_type,
        description=description,
    )

    # сразу обрабатваем только тексты до 2500 символов (в среднем одна страница формата A4 и 1000 токенов)
    if analysis_type == "single" and len(document) < 2500:
        await process(document_obj.document_id, analysis_obj.analysis_id)

    # return StreamingResponse(process_sources, media_type="application/x-ndjson")


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
