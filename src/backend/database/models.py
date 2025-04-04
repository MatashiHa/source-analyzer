import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, ForeignKey, String, Table
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base

# Промежуточная таблица для связи многие-ко-многим
user_feed_association = Table(
    "user_feed_association",
    Base.metadata,
    Column(
        "user_id", ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "feed_id", ForeignKey("feeds.feed_id", ondelete="CASCADE"), primary_key=True
    ),
)


class User(Base):
    __tablename__ = "users"

    # Основные поля
    user_id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    # OAuth2-поля (пока один провайдер на пользователя)
    provider: Mapped[str] = mapped_column(String(50))  # google, github и т.д.
    provider_id: Mapped[str] = mapped_column(
        String(255), unique=True
    )  # ID у провайдера
    # Статусы
    # is_active: Mapped[bool] = mapped_column(default=True) удобно для контроля без удаления данных пользователя
    is_verified: Mapped[bool] = mapped_column(default=True)  # Доверяем OAuth-провайдеру

    # Связь многие-ко-многим с Feed (через ассоциативную таблицу)
    feeds: Mapped[list["Feed"]] = relationship(
        "Feed",
        secondary=user_feed_association,  # Указываем таблицу связи
        back_populates="users",  # Обратная ссылка (будет в Feed)
        lazy="selectin",
    )


# есть RSS-фиды который задаются пользователями
class Feed(Base):
    __tablename__ = "feeds"
    feed_id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(unique=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(String(600))
    last_updated: Mapped[datetime.datetime] = mapped_column()

    # Связь многие-ко-многим с User
    users: Mapped[list["User"]] = relationship(
        "User",
        secondary=user_feed_association,
        back_populates="feeds",
        lazy="selectin",
    )
    # Связь один-ко-многим с Article
    articles: Mapped[list["Article"]] = relationship(
        "Article",
        backref="feed",
        lazy="selectin",
    )


# у RSS-фида есть набор статей
class Article(Base):
    __tablename__ = "articles"
    article_id: Mapped[int] = mapped_column(primary_key=True)
    # feed_id: Mapped[int] = mapped_column(ForeignKey("feeds.id"))
    title: Mapped[str] = mapped_column(String(200))
    link: Mapped[str] = mapped_column(unique=True)
    pub_date: Mapped[datetime.datetime] = mapped_column()
    description: Mapped[str | None] = mapped_column(String(600))
    # content: Mapped[str | None] = mapped_column() не используем из-за отсутствия на сайтах и из-за собственных полей у сайтов, например <rbc_news:full-text>
    embeddings = mapped_column(Vector(768))

    feed_id: Mapped[int | None] = mapped_column(
        ForeignKey("feeds.feed_id", ondelete="CASCADE")
    )
    # Связь один-ко-многим с LLMConnection
    llm_conns: Mapped[list["LLMConnection"]] = relationship(
        "LLMConnection",
        backref="article",
        lazy="selectin",
    )


class LLMConnection(Base):
    __tablename__ = "llm_conns"
    request_id: Mapped[int] = mapped_column(primary_key=True)
    # document_id: Mapped[int | None] = mapped_column(ForeignKey("documents.document_id"))
    category: Mapped[str] = mapped_column()
    response = mapped_column(JSONB, nullable=True)  # ответ модели
    is_annotating: Mapped[bool] = mapped_column(default=True)

    article_id: Mapped[int | None] = mapped_column(
        ForeignKey("articles.article_id", ondelete="CASCADE")
    )
    # document: Mapped["Documents"] = relationship(back_populates="llm_conn")
