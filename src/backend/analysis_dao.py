from backend.dao.base import BaseDAO
from backend.database.models import AnalysisRequest


class AnalysesDAO(BaseDAO):
    model = AnalysisRequest
