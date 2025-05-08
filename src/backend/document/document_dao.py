from backend.dao.base import BaseDAO
from backend.database.models import Document


class DocumentsDAO(BaseDAO):
    model = Document
