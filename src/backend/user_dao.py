from backend.dao.base import BaseDAO
from backend.database.models import User


class UsersDAO(BaseDAO):
    model = User
