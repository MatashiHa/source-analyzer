import select

from backend.dao.base import BaseDAO
from backend.database.database import async_session_maker
from backend.database.models import AnalysisRequest, Document, LLMConnection


class DocumentsDAO(BaseDAO):
    model = Document

    # @classmethod
    # async def find_documents_without_analysis(cls, req_id):
    #     async with async_session_maker() as session:
    #         stmt = select(cls.model).where(
    #             # Документы которые не обрабатывались в рамках запроса
    #             ~exists().where(
    #                 LLMConnection.document_id == Document.document_id,
    #                 LLMConnection.request_id == req_id,
    #                 AnalysisRequest.request_id == req_id,
    #                 AnalysisRequest.is_active,
    #             ),
    #         )
    #         result = await session.execute(stmt)
    #         return result.scalars().all()

    @classmethod
    async def get_relevant_data_from_documents(
        query_embedding, max_entries=5, choose_labeled=False
    ):
        async with async_session_maker() as session:
            stmt = (
                select(
                    AnalysisRequest.category,
                    LLMConnection.response,
                )
                .join(LLMConnection, Document.document_id == LLMConnection.document_id)
                .join(
                    AnalysisRequest,
                    LLMConnection.request_id == AnalysisRequest.request_id,
                )
                .order_by(Document.embeddings.cosine_distance(query_embedding))
                .limit(max_entries)
            )
            if choose_labeled:
                stmt = stmt.where(LLMConnection.labeled == True)  # noqa

            stmt = stmt.order_by(
                Document.embeddings.cosine_distance(query_embedding)
            ).limit(max_entries)

            result = await session.execute(stmt)
            return result.all()
