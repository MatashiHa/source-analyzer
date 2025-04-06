from datetime import datetime

from sqlalchemy import and_, select

from backend.dao.base import BaseDAO
from backend.database.database import async_session_maker
from backend.database.models import Session


class SessionsDAO(BaseDAO):
    model = Session

    @classmethod
    async def is_session_valid(cls, session_id: str):
        async with async_session_maker() as session:
            query = select(cls.model).filter(
                and_(
                    Session.session_id == session_id,
                    Session.expires_at > datetime.now(),
                )
            )
            result = await session.execute(query)
            return result.scalar_one_or_none()
