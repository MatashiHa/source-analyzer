from backend.dao.base import BaseDAO
from backend.database.models import LLMConnection


class AnalysesDAO(BaseDAO):
    model = LLMConnection
