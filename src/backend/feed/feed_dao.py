from dao.base import BaseDAO
from database.database import async_session_maker
from database.models import Feed
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from backend.database.models import user_feed_association


class FeedsDAO(BaseDAO):
    model = Feed

    @classmethod
    async def get_all_feed_ids_with_urls(cls):
        async with async_session_maker() as session:
            stmt = select(cls.model.feed_id, cls.model.url)
            result = await session.execute(stmt)
            return result.all()

    @classmethod
    async def connect_user_to_existing_feed(cls, user_id, feed_id):
        async with async_session_maker() as session:
            # Добавляем связь, если пользователь уже связан с фидом -- ничего не делаем
            stmt = (
                insert(user_feed_association)
                .values(
                    user_id=user_id,
                    feed_id=feed_id,
                )
                .on_conflict_do_nothing(
                    constraint="user_feed_association_pkey",  # Уникальный ключ для проверки
                )
            )
            try:
                await session.execute(stmt)
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise ValueError(f"User feed connection failed: {str(e)}")
