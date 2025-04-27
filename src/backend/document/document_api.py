from fastapi import APIRouter

from backend.analysis.analysis_dao import AnalysesDAO
from backend.document.document_dao import DocumentsDAO

router = APIRouter(prefix="/document", tags=["Document"])

# одноразовый скрапинг предложенных пользователем url
# @router.post("/import")
# async def import_data():
#     from crawler.rss_crawler import import_data

#     urls = await DocumentsDAO.get_all_feed_ids_with_urls()

#     count = await import_data(urls)
#     return {"message": f"{count} news was loaded!"}


# запуск единичного анализа документа
@router.post("/process")
async def process(req_id: int, feed_id: int):
    from rag.processor import process

    analysis = await AnalysesDAO().find_one_or_none_by_id(req_id)
    if not analysis:
        return Exception("Analysis not found")

    document = await DocumentsDAO().find_one_or_none_by_id(feed_id)
    if not document:
        return Exception("Feed was not found")

    await process()
    return {"message": "Processing started!"}
