from fastapi import APIRouter, Form, Request
from sqlalchemy.dialects.postgresql import insert

from backend.auth.auth_api import get_current_user
from backend.database.database import async_session_maker
from backend.database.models import user_feed_association
from backend.feed.feed_dao import FeedsDAO

router = APIRouter(prefix="/analysis")


@router.post("/create")
async def create_new_analysis(request: Request):
    name: str = Form(...)
    type: str = Form(...)
    categories: str = Form(...)
    examples: str = Form(None)
    source_type: str = Form(...)
    urls: str = Form(None)
    user = get_current_user()
    feed_dao = FeedsDAO()
    if source_type == "links" and type == "monitoring":
        urls = urls.split()
        feeds_to_process = []
        for url in urls:
            feed = feed_dao.find_one_or_none(url=url)
            if feed:
                async with async_session_maker() as session:
                    # Добавляем связь, если пользователь уже связан с фидом -- ничего не делаем
                    stmt = (
                        insert(user_feed_association)
                        .values(
                            user_id=user.user_id,
                            feed_id=feed.feed_id,
                        )
                        .on_conflict_do_nothing(
                            constraint="user_feed_association_pkey",  # Уникальный ключ для проверки
                        )
                    )
                    session.execute(stmt)
                    session.commit()
            else:
                feed = feed_dao.add(url=url)

            feeds_to_process.append((feed.feed_id, feed.url))

        if examples:
            examples = examples.split(";")
            import re

            for example in examples:
                result = re.search(r"<Text>(.*?)<Prediction>(.*?)", example).group(1)
                text, prediction = result.group(1), result.group(2)
                formated_example = f"""
                Category: {categories},
                Text: {text},
                predicted_class: {prediction}
                """
                from analysis_dao import AnalysesDAO

                await AnalysesDAO().add(
                    name=name,
                    category=categories,
                    example=formated_example,
                    labaled=True,
                )

        # При автоматической обработке с помощью оркестратора это делать не нужно
        # from models.models import device, load_embedding_model, load_tokenizer

        # tokenizer = load_tokenizer()
        # embedding_model = load_embedding_model(tokenizer)
        # import_data(feeds_to_process, tokenizer, embedding_model, device)
