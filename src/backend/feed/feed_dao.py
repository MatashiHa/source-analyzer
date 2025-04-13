from dao.base import BaseDAO
from database.database import async_session_maker
from database.models import Feed
from sqlalchemy import select


class FeedsDAO(BaseDAO):
    model = Feed

    @classmethod
    async def get_all_feed_ids_with_urls(cls):
        async with async_session_maker() as session:
            stmt = select(cls.model.feed_id, cls.model.url)
            result = await session.execute(stmt)
            return result.all()
