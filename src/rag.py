import json

import pandas as pd
import torch
from sqlalchemy import select
from transformers import pipeline

from backend.database.database import async_session_maker
from backend.database.models import Articles, LLMConnection
from crawler.processor import get_embeddings

torch.random.manual_seed(0)

# задача состоит в том, чтобы классифицировать данные источников, для этого пользователь отправляет запрос в котором представлен параметр по которому проводиться классификация,
# далее система должна классифицировать текст по трём классам проявления этого параметра: низкое, среднее, высокое. Для более точного запроса нужно подавать в контекст пары запрос-ответ согласно вопросу пользователя.
context = [
    {
        "role": "system",
        "content": """You are a helpful AI tool that returns ONLY JSON answers to classification requests. If you output anything but JSON you will have FAILED. 
        JSON is REQUIRED to have fields: predicted class, key-values of level (high, medium, low) to words, key-values of level to probabilities""",
    },
    {
        "role": "user",
        "content": """Context: So much happened today
        Category: positivity
        Text: the weather is good tonight, but im too tired.""",
    },
    {
        "role": "assistant",
        "content": """
    {
      "predicted_class": "low"
      "class_to_words": {
        "high": ["good"],
        "medium": ["tonight"]
        "low": ["tired", "but"],
      },
      "class_to_probabilities": {
        "high": 0.25,
        "medium": 0.25,
        "low": 0.5
        }
    }
    """,
    },
]

template = """
    Context: {context}
    Category: {category}
    Text: {text}
"""


async def rag_processing(
    tokenizer: any, model: any, embedding_model: any, device: str, request: list
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
        df=pd.DataFrame({request[1]}),
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
                Articles.title,
                Articles.description,
                LLMConnection.category,
                LLMConnection.response,
            )
            .join(LLMConnection)
            .order_by(Articles.embeddings.cosine_distance(query_embedding))
            .limit(5)
        )

        # TODO: нужно обрабатывать  необработванные статьи в цикле выбирая пять акутальных статей и
        # составлять из них пары вопрос-ответ (если есть размеченный ответ) которыми и дополнять контекст
        # т.е. код снизу измениться. Если ответа нет, то дополнять только релевантынм текстом, чтобы
        # модель поняла какое место занимает текущее преложение в контексте.
        # Вопрос в паре это или заголовки(+описание?) статей для rss или отрыки текста из документов.
        # result = (await session.scalars(stmt)).all()
        result = (await session.execute(stmt)).all()
        combined_results = [
            f"Title: {title}; Description:{description}; Category:{category};Result:{json.dumps(response, ensure_ascii=False)}"
            if response
            else f"{title};{description}"
            for title, description, category, response in result
        ]
        rag_query = " ".join(combined_results)
        # rag_query = " ".join(result)

        query_template = template.format(
            context=rag_query, category=request[0], text=request[1]
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
