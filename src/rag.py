import re

import pandas as pd
import torch
from sqlalchemy import select
from transformers import pipeline

from backend.database.database import async_session_maker
from backend.database.models import Articles
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
        "content": "Provide positivity classification of the text: the weather is good tonight, but im too tired.",
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
    Question: {question}
"""


def remove_json_markdown(text):
    return re.sub(r"```json\s*([\s\S]*?)\s*```", r"\1", text)


async def rag_query(
    tokenizer: any, model: any, embedding_model: any, device: str, query: str
) -> str:
    """get embedding of a query, retrieve relevant context from database
    and generate the response

    Args:
        tokenizer (_type_): some tokenizer
        model (_type_): model to generate response
        device (_type_): cpu or cuda
        query (_type_): entry query from user
    """

    query_embedding, _ = get_embeddings(
        tokenizer=tokenizer,
        model=embedding_model,
        device=device,
        df=pd.DataFrame({query}),
    )
    query_embedding = query_embedding.tolist()[0]
    # print(shape)
    # if shape != 768:
    #     projection = nn.Linear(shape, 768).half().eval().to(device)
    #     query_embedding = projection(query_embedding)

    # making async request to database with set condition to get 5 max relevant examples
    async with async_session_maker() as session:
        stmt = (
            select(Articles.title)
            .order_by(Articles.embeddings.cosine_distance(query_embedding))
            .limit(5)
        )

        result = (await session.scalars(stmt)).all()

        rag_query = " ".join(result)

        query_template = template.format(context=rag_query, question=query)

        # добавляем в контекст вопрос
        context.append({"role": "user", "content": query_template})

        # context.append({
        # })

        # input = tokenizer.encode(query_template, return_tensors="pt")

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

        # TODO: сохранять ответы на запросы в бд.
        # sometimes output might contain json markdown
        return remove_json_markdown(output[0]["generated_text"])


# # getting response from model by passing query with context
# generated_response = model.generate(
#     input.to(device), max_new_tokens=150, pad_token_id=tokenizer.eos_token_id
# )

# return tokenizer.decode(
#     generated_response[0][input.shape[-1] :], skip_special_tokens=True
# )
