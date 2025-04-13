from dao.base import BaseDAO
from database.models import Feed


class FeedsDAO(BaseDAO):
    model = Feed
