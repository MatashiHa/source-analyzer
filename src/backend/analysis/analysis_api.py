import re
from datetime import datetime, timedelta

import pandas as pd
from fastapi import APIRouter, Depends, Request

# from models.models import device, load_embedding_model, load_tokenizer
from backend.analysis.analysis_dao import AnalysesDAO
from backend.auth.auth_api import get_current_user
from backend.document.document_api import process
from backend.document.document_dao import DocumentsDAO
from backend.feed.feed_dao import FeedsDAO
from crawler.processor import get_embeddings
from crawler.scraper.scraper.spiders.doc_crawler import import_data
from utils import split_text_into_paragraphs, write_request


def load_embedding_model():
    pass


def load_tokenizer():
    pass


device = "CUDA"


def examples_formatting(examples: str, categories):
    examples = examples.split(";")

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
async def create_new_analysis(
    request: Request,
    tokenizer=Depends(load_tokenizer),
    embedding_model=Depends(load_embedding_model),
):
    data = await request.json()
    name: str = data["name"]
    categories: str = data["categories"]
    analysis_type: str = data["type"]  # single or monitoring
    source_type: str = data["source_type"]  # links or files
    # необязательные поля получаем через get
    description: str = data.get("description")
    examples: str = data.get("examples")
    urls: str = data.get("urls")
    urls_list = urls.split()
    document: str = data.get("docs")

    user = await get_current_user(request)

    # async def process_sources():
    # обработка фидов запускается по расписанию планировщиком
    if source_type == "links" and analysis_type == "monitoring":
        feed_dao = FeedsDAO()
        # feeds_to_process = []
        for url in urls_list:
            feed_obj = await feed_dao.find_one_or_none(url=url)
            if feed_obj:
                await feed_dao.connect_user_to_existing_feed(
                    user_id=user.user_id, feed_id=feed_obj.feed_id
                )
            else:
                feed_obj = await feed_dao.add(url=url)

    # загрузка документов в БД
    if analysis_type == "single":
        if source_type == "links" and len(urls_list) == 1:
            # пока обрабатваем только первую ссылку
            document = import_data(urls_list[0])[0]

        document_obj = await DocumentsDAO.add(
            url=url,
            title=split_text_into_paragraphs(document, 50),
            description=split_text_into_paragraphs(document, 300),
            content=document,
            embeddings=get_embeddings(
                tokenizer, embedding_model, device, pd.DataFrame(document)
            )[0],
        )
        if len(urls_list) > 1:
            return {"error": "Too many links"}
    formated_examples = examples_formatting(examples, categories) if examples else None

    # создаение анализа
    analysis_obj = await AnalysesDAO.add(
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

    # записывам запрос в csv файл для последующего запуска обработки
    if analysis_type == "monitoring":
        request = [analysis_obj.analysis_id, feed_obj.feed_id, ""]
    else:
        request = [analysis_obj.analysis_id, "", document_obj.document_id]

    write_request(request)
    # return StreamingResponse(process_sources, media_type="application/x-ndjson")


@router.get("/templates")
async def get_templates(request: Request):
    user = await get_current_user(request)
    analyses = await AnalysesDAO.find_all(user_id=user.user_id)
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
        for analysis in analyses
    ]
    return {"templates": templates}


@router.get("/monitoring")
async def get_monitoring(request: Request):
    user = await get_current_user(request)
    analyses = AnalysesDAO().find_all(user_id=user.id)
    yesterday = datetime.now().replace(
        hour=0, minute=0, second=0, microsecond=0
    ) - timedelta(days=1)

    schedules = []
    for analysis in analyses:
        conns = analysis.llm_conns

        # Безопасное получение последнего created_at (если conns не пуст)
        last_run = conns[-1].created_at.strftime("%d.%m.%Y") if conns else ""

        # Считаем новые источники (за последние сутки)
        new_sources = (
            len([conn for conn in conns if conn.created_at >= yesterday])
            if conns
            else 0
        )

        schedules.append(
            {
                "id": analysis.request_id,
                "name": analysis.name,
                "description": analysis.description,
                "status": analysis.is_active,
                "frequency": "Daily",
                "lastRun": last_run,
                "nextRun": last_run + timedelta(days=1) if last_run else "",
                "sources": len(conns),
                "newSources": new_sources,
            }
        )

    return {"schedules": schedules}


# @router.get("/results")
# async def results(analysis_id)
