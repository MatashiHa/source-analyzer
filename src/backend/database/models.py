import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base

# есть RSS-фиды который задаются пользователями
# class Feeds:
#     id: Mapped[int] = mapped_column(primary_key=True)
#     url: Mapped[str] = mapped_column(unique=True)
#     title: Mapped[str] = mapped_column()
#     description: Mapped[str] = mapped_column()
#     last_updated: Mapped[str] = mapped_column()


class User(Base):
    __tablename__ = "user"
    user_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    # email: Mapped[str] = mapped_column()
    # provider: Mapped[str] = mapped_column()


# у RSS-фида есть набор статей
class Articles(Base):
    __tablename__ = "articles"
    article_id: Mapped[int] = mapped_column(primary_key=True)
    # feed_id: Mapped[int] = mapped_column(ForeignKey("feeds.id"))
    title: Mapped[str] = mapped_column()
    link: Mapped[str] = mapped_column(unique=True)
    pub_date: Mapped[datetime.datetime] = mapped_column()
    description: Mapped[str | None] = mapped_column()
    content: Mapped[str | None] = mapped_column()
    embeddings = mapped_column(Vector(768))


# TODO: title и description подаются LLM для анализа после чего они возвращают
# json с полученными результатами
class LLMConnection(Base):
    __tablename__ = "llm_conn"
    request_id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[str] = (
        mapped_column()
    )  # параметр по которому проводиться классификация
    article_id = mapped_column(
        ForeignKey("articles.article_id")
    )  # запись по которой проводиться классификация
    response = mapped_column(JSONB, nullable=True)  # ответ модели

    article = relationship("Articles")


# TODO: полученный json просмативается и записывается резаультат анализа
# результаты анализа тоже хранаться в БД
