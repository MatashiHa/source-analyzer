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


email: Mapped[str] = mapped_column()
provider: Mapped[str] = mapped_column()


# у RSS-фида есть набор статей
class Articles(Base):
    __tablename__ = "articles"
    article_id: Mapped[int] = mapped_column(primary_key=True)
    # feed_id: Mapped[int] = mapped_column(ForeignKey("feeds.id"))
    title: Mapped[str] = mapped_column()
    link: Mapped[str] = mapped_column(unique=True)
    pub_date: Mapped[datetime.datetime] = mapped_column()
    description: Mapped[str | None] = mapped_column()
    # content: Mapped[str | None] = mapped_column() не используем из-за отсутствия на сайтах и из-за собственных полей у сайтов, например <rbc_news:full-text>
    embeddings = mapped_column(Vector(768))
    llm_conn: Mapped[list["LLMConnection"]] = relationship(
        "LLMConnection",
        backref="article",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    # llm_conn: Mapped["LLMConnection"] = relationship(
    #     back_populates="articles", uselist=False
    # )


class LLMConnection(Base):
    __tablename__ = "llm_conn"
    request_id: Mapped[int] = mapped_column(primary_key=True)
    # document_id: Mapped[int | None] = mapped_column(ForeignKey("documents.document_id"))
    article_id: Mapped[int | None] = mapped_column(
        ForeignKey("articles.article_id", ondelete="CASCADE")
    )
    category: Mapped[str] = mapped_column()
    response = mapped_column(JSONB, nullable=True)  # ответ модели
    is_annotating: Mapped[bool] = mapped_column(default=True)

    # document: Mapped["Documents"] = relationship(back_populates="llm_conn")
    # article: Mapped["Articles"] = relationship(back_populates="llm_conn")
