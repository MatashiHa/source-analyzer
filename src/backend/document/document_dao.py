from backend.dao import base
from backend.database.models import Document


class DocumentsDAO(base):
    model = Document
