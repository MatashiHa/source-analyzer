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


class Args:
    document_id: int
    req_id: int


# запуск единичного анализа документа
@router.post("/process")
async def process(req_id: int, document_id: int):
    from rag.processor import process

    analysis = await AnalysesDAO().find_one_or_none_by_id(req_id)
    if not analysis:
        return Exception("Analysis not found")

    document = await DocumentsDAO().find_one_or_none_by_id(document_id)
    if not document:
        return Exception("Feed was not found")

    args = Args()
    args.document_id = document.document_id
    args.req_id = analysis.request_id
    await process()
    return {"message": "Processing started!"}
