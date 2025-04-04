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
        "content": """You are an AI that returns ONLY JSON answers. If you output anything but JSON you will have FAILED. Follow these rules:
        - Output only valid JSON.
        - JSON must include:
        - predicted_class: the level ("high", "medium", or "low") with the highest probability among all levels.
        - class_to_words: a mapping of each level ("high", "medium", "low") to a list of words or phrases from the text.
        - class_to_probabilities: a mapping of each level ("high", "medium", "low") to its probability.
        - Classify only words/phrases that meaningfully impact the category.
        - Use the source language without reinterpretation.
        - One word/phrase can only be in one class. Don't repeat same words.
        - Do not mention or classify the provided context.
        - If context with similar results is given, use it; otherwise, answer without it.
        Keep your answer concise.""",
    },
    {
        "role": "user",
        "content": """
        Context: <title>: Improved Classification Model Context;
        <description>: Enhanced classification logic to prevent word duplication across levels, ensure correct probability distribution, and improve accuracy in text classification.;
        <category>: positivity;
        <result>: {"predicted_class": "medium", "class_to_words": {"high": ["wonderful"], "medium": ["today"], "low": ["too tired", "but"]}, "class_to_probabilities": {"high": 0.3, "medium": 0.3, "low": 0.4}}
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
    # {
    #     "role": "system",
    #     "content": """Вы — ИИ, который возвращает ТОЛЬКО JSON-ответы. Если вы выдадите что-либо кроме JSON, это будет ОШИБКОЙ. Следуйте этим правилам:
    #     - Выводите только корректный JSON.
    #     - JSON должен содержать:
    #     - predicted_class: уровень ("high", "medium" или "low") с наивысшей вероятностью среди всех уровней.
    #     - class_to_words: соответствие каждого уровня ("high", "medium", "low") со списком слов или фраз из текста.
    #     - class_to_probabilities: соответствие каждого уровня ("high", "medium", "low") с его вероятностью.
    #     - Классифицируйте только слова/фразы, которые значимо влияют на категорию.
    #     - Используйте исходный язык без переосмысления.
    #     - Одно слово/фраза может принадлежать только одному классу. Не повторяйте одни и те же слова.
    #     - Не упоминайте и не классифицируйте предоставленный контекст.
    #     - Если дан контекст с похожими результатами, используйте его; иначе отвечайте без него.
    #     Держите ответ лаконичным.""",
    # },
    # {
    #     "role": "user",
    #     "content": """Context:
    #         <title>: Позитивный настрой на день;
    #         <description>: Отличное начало дня с солнечным настроем и позитивными мыслями, которые помогут настроиться на успех.;
    #         <category>: позитивность;
    #         <result>: {
    #         "predicted_class": "high",
    #         "class_to_words": {
    #             "high": ["отличное", "позитивными", "успех"],
    #             "medium": ["начало", "солнечным"],
    #             "low": ["не"]
    #         },
    #         "class_to_probabilities": {
    #             "high": 0.6,
    #             "medium": 0.3,
    #             "low": 0.1
    #         }
    #     }
    #     Category: позитивность
    #     Text: погода сегодня хорошая, но я слишком устал.""",
    # },
    # {
    #     "role": "assistant",
    #     "content": """
    #     {
    #     "predicted_class": "low",
    #     "class_to_words": {
    #         "high": ["хорошая"],
    #         "medium": ["сегодня"],
    #         "low": ["слишком устал", "но"]
    #     },
    #     "class_to_probabilities": {
    #         "high": 0.25,
    #         "medium": 0.25,
    #         "low": 0.5
    #     }
    #     }""",
    # },
]


# Context: {context}
template = """
    Context: {context}
    Category: {category}
    Text: {text}
"""
# Ошибки в обработке: одни и те же слова в нескольких классах, иногда путает class с level (при установке predicted_level в примере), появление больших повторений в в одном классе
# из-за чего не хватает токенов для полного ответа, неточность в классификации, пытается отнести к классу даже то что не имеет значения, иногда отсутствуют вероятности,
# классифицирует как low хотя вероятность не наибольшая среди классов, иногда интерпретирует русские слова на английском и выдаёт мусор


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
            .where(~LLMConnection.is_annotating)
            .order_by(Articles.embeddings.cosine_distance(query_embedding))
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
