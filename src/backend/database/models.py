import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, ForeignKey, String, Table, UniqueConstraint
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
    email: Mapped[str | None] = mapped_column(String(100))  # не все предоставлют email
    login: Mapped[str] = mapped_column(String(100))
    # OAuth2-поля (пока один провайдер на пользователя)
    provider: Mapped[str] = mapped_column(String(50))  # google, github и т.д.
    provider_id: Mapped[str] = mapped_column(
        String(255), unique=True
    )  # ID у провайдера
    # Связь многие-ко-многим с Feed (через ассоциативную таблицу)
    feeds: Mapped[list["Feed"]] = relationship(
        "Feed",
        secondary=user_feed_association,  # Указываем таблицу связи
        back_populates="users",  # Обратная ссылка (будет в Feed)
        lazy="selectin",
    )
    # у провайдоров могут быть одинаковые ID но сочетание с названием всегда разное
    UniqueConstraint("provider", "provider_id", name="uix_provider_id_provider")


# есть RSS-фиды который задаются пользователями
class Feed(Base):
    __tablename__ = "feeds"
    feed_id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(unique=True)
    title: Mapped[str | None] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(String(600))

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
    analyses: Mapped[list["AnalysisRequest"]] = relationship(
        "AnalysisRequest",
        backref="feed",
        lazy="selectin",
    )


# у RSS-фида есть набор статей
class Article(Base):
    __tablename__ = "articles"
    article_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    link: Mapped[str] = mapped_column(unique=True)
    pub_date: Mapped[datetime.datetime] = mapped_column()
    description: Mapped[str | None] = mapped_column(String(600))
    embeddings = mapped_column(Vector(768))

    feed_id: Mapped[int] = mapped_column(
        ForeignKey("feeds.feed_id", ondelete="CASCADE")
    )


class AnalysisRequest(Base):
    __tablename__ = "analyses"
    request_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), default="New Analysis")
    category: Mapped[str] = mapped_column(String(50))
    examples: Mapped[str] = mapped_column(String(400))
    is_active: Mapped[bool] = mapped_column(default=True)
    feed_id: Mapped[int] = mapped_column(
        ForeignKey("feeds.feed_id", ondelete="CASCADE")
    )
    llm_conns: Mapped[list["LLMConnection"]] = relationship(
        "LLMConnection",
        backref="analysis",
        lazy="selectin",
    )


class LLMConnection(Base):
    __tablename__ = "llm_conns"
    conn_id: Mapped[int] = mapped_column(primary_key=True)
    # document_id: Mapped[int | None] = mapped_column(ForeignKey("documents.document_id"))
    response = mapped_column(JSONB, nullable=True)  # ответ модели
    is_labeled: Mapped[bool] = mapped_column(
        default=False
    )  # разамчена ли пользователями

    request_id: Mapped[int] = mapped_column(
        ForeignKey("analyses.request_id", ondelete="CASCADE")
    )
    # document: Mapped["Documents"] = relationship(back_populates="llm_conn")


# class Template(Base): # затравка на будущее
#     pass


# Храниим сессии пользователей
class Session(Base):
    __tablename__ = "sessions"
    session_id: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )
    expires_at: Mapped[datetime.datetime] = mapped_column()
