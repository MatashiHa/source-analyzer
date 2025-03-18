import datetime

from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base

# есть RSS-фиды который задаются пользователями
# class Feeds:
#     id: Mapped[int] = mapped_column(primary_key=True)
#     url: Mapped[str] = mapped_column(unique=True)
#     title: Mapped[str] = mapped_column()
#     description: Mapped[str] = mapped_column()
#     last_updated: Mapped[str] = mapped_column()


# у RSS-фида есть набор статей
class Articles(Base):
    __tablename__ = "articles"
    id: Mapped[int] = mapped_column(primary_key=True)
    # feed_id: Mapped[int] = mapped_column(ForeignKey("feeds.id"))
    title: Mapped[str] = mapped_column()
    link: Mapped[str] = mapped_column()
    pub_date: Mapped[datetime.datetime] = mapped_column()
    description: Mapped[str | None] = mapped_column()  # нужно читить от тегов
    content: Mapped[str | None] = mapped_column()  # нужно читить от тегов


# TODO: title и description подаются LLM для анализа после чего они возвращают
# json с полученными результатами


# TODO: полученный json просмативается и записывается резаультат анализа
# результаты анализа тоже хранаться в БД
