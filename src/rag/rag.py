import json

import pandas as pd
import torch
from sqlalchemy import select
from templates import context, template
from transformers import pipeline

from backend.database.database import async_session_maker
from backend.database.models import Article, LLMConnection
from crawler.processor import get_embeddings

torch.random.manual_seed(0)

# задача состоит в том, чтобы классифицировать данные источников, для этого пользователь отправляет запрос в котором представлен параметр по которому проводиться классификация,
# далее система должна классифицировать текст по трём классам проявления этого параметра: низкое, среднее, высокое. Для более точного запроса нужно подавать в контекст пары запрос-ответ согласно вопросу пользователя.

# Ошибки в обработке: одни и те же слова в нескольких классах, иногда путает class с level (при установке predicted_level в примере), появление больших повторений в в одном классе
# из-за чего не хватает токенов для полного ответа, неточность в классификации, пытается отнести к классу даже то что не имеет значения, иногда отсутствуют вероятности,
# классифицирует как low хотя вероятность не наибольшая среди классов, иногда интерпретирует русские слова на английском и выдаёт мусор


async def rag_processing(
    tokenizer: any, model: any, embedding_model: any, device: str, request: dict
) -> str:
    """get embedding of a query, retrieve relevant context from database
    and generate the response

    Args:
        tokenizer (_type_): some tokenizer
        model (_type_): model to generate response
        device (_type_): cpu or cuda
        request (_type_): list containig category and text from the source
    """

    query_embedding, _ = get_embeddings(
        tokenizer=tokenizer,
        model=embedding_model,
        device=device,
        df=pd.DataFrame({request["title"]}),
    )
    query_embedding = query_embedding.tolist()[0]
    # print(shape)
    # if shape != 768:
    #     projection = nn.Linear(shape, 768).half().eval().to(device)
    #     query_embedding = projection(query_embedding)

    # making async request to database with set condition to get 5 max relevant examples
    async with async_session_maker() as session:
        stmt = (
            select(
                Article.title,
                Article.description,
                LLMConnection.category,
                LLMConnection.response,
            )
            .join(LLMConnection)
            .where(~LLMConnection.is_busy)
            .order_by(Article.embeddings.cosine_distance(query_embedding))
            .limit(5)
        )

        # Если ответа нет, то дополнять только релевантынм текстом, чтобы
        # модель поняла какое место занимает текущее преложение в контексте.
        # Вопрос в паре это или заголовки(+описание?) статей для rss или отрывки текста из документов.
        # result = (await session.scalars(stmt)).all()
        result = (await session.execute(stmt)).all()
        combined_results = [
            f"<title>: {title};<description>:{description};<category>:{category};<result>:{json.dumps(response, ensure_ascii=False)}"
            if response
            else f"{title};{description}"
            for title, description, category, response in result
        ]
        rag_query = " ".join(combined_results)
        # rag_query = " ".join(result)

        query_template = template.format(
            context=rag_query, category=request["category"], text=request["title"]
        )

        # добавляем в контекст вопрос
        context.append({"role": "user", "content": query_template})

        pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
        )

        generation_args = {
            "max_new_tokens": 200,
            "return_full_text": False,
            "do_sample": False,
        }

        output = pipe(context, **generation_args)
        # sometimes output might contain json markdown
        return output[0]["generated_text"]
