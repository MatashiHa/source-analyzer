import select

from database.database import async_session_maker
from sqlalchemy import exists

from backend.dao.base import BaseDAO
from backend.database.models import AnalysisRequest, Article, LLMConnection


class ArticlesDAO(BaseDAO):
    model = Article

    @classmethod
    async def find_articles_without_analysis(cls, feed_id, req_id):
        async with async_session_maker() as session:
            stmt = select(cls.model).where(
                cls.model.feed_id == feed_id,
                # Статьи которые не обрабатывались в рамках запроса
                ~exists().where(
                    LLMConnection.article_id == Article.article_id,
                    LLMConnection.request_id == req_id,
                    AnalysisRequest.request_id == req_id,
                    AnalysisRequest.is_active,
                ),
            )
            result = await session.execute(stmt)
            return result.scalars().all()

    @classmethod
    async def get_relevant_data_from_articles(
        cls, query_embedding, max_entries=5, choose_labeled=False
    ):
        async with async_session_maker() as session:
            stmt = (
                select(
                    Article.title,
                    Article.description,
                    AnalysisRequest.category,
                    LLMConnection.response,
                )
                .join(LLMConnection, Article.article_id == LLMConnection.article_id)
                .join(
                    AnalysisRequest,
                    LLMConnection.request_id == AnalysisRequest.request_id,
                )
                # .where(
                #     LLMConnection.labeled == True,
                # )
                .order_by(Article.embeddings.cosine_distance(query_embedding))
                .limit(max_entries)
            )
            if choose_labeled:
                stmt = stmt.where(LLMConnection.labeled == True)  # noqa

            stmt = stmt.order_by(
                Article.embeddings.cosine_distance(query_embedding)
            ).limit(max_entries)

            result = await session.execute(stmt)
            return result.all()
