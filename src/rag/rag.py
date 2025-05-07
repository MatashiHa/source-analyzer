import json

import pandas as pd
import torch
from templates import context, template
from transformers import pipeline

from backend.dao.article_dao import ArticlesDAO
from crawler.processor import get_embeddings
from utils import split_text_into_paragraphs

torch.random.manual_seed(42)

# Ошибки в обработке: одни и те же слова в нескольких классах, иногда путает class с level (при установке predicted_level в примере), появление больших повторений в в одном классе
# из-за чего не хватает токенов для полного ответа, неточность в классификации, пытается отнести к классу даже то что не имеет значения, иногда отсутствуют вероятности,
# классифицирует как low хотя вероятность не наибольшая среди классов, иногда интерпретирует русские слова на английском и выдаёт мусор


async def rag_processing(
    tokenizer: any,
    model: any,
    embedding_model: any,
    device: str,
    request: dict[str, str],
    query_embedding: any,
    src_type: str,
    document_id: str | None,
) -> str:
    """get embedding of a query, retrieve relevant context from database
    and generate the response

    Args:
        tokenizer (_type_): some tokenizer
        model (_type_): model to generate response
        device (_type_): cpu or cuda
        request (_type_): list containig category and text from the source
    """

    if not query_embedding:
        query_embedding, _ = get_embeddings(
            tokenizer=tokenizer,
            model=embedding_model,
            device=device,
            df=pd.DataFrame({request["text"]}),
        )
    query_embedding = query_embedding.tolist()[0]
    # print(shape)
    # if shape != 768:
    #     projection = nn.Linear(shape, 768).half().eval().to(device)
    #     query_embedding = projection(query_embedding)

    # making async request to database with set condition to get 5 max relevant examples
    if src_type == "feed":
        result = await ArticlesDAO.get_relevant_data_from_articles(
            query_embedding=query_embedding
        )
        # <text>:{title}. {description};
        combined_results = [
            f"<category>:{category};<result>:{json.dumps(response, ensure_ascii=False)}"
            if response
            else f"{title}.{description}"
            for title, description, category, response in result
        ]
        rag_query = " ".join(combined_results)

    # если обрабоатвается документ контектс должен состоять из фрагментов текста того же источника
    # сами ответы модели можно не брать, чтобы не перегружать
    if src_type == "document":
        # делим документ на части до 500 символов
        texts = split_text_into_paragraphs(request["text"], 500)

        # для каждого абзаца вычисляем косинусное расстояние

        # по циклу обрабатываем части документа, гдеберём 5 близких по тексту абзацев в контекст

        combined_results = [
            f"<category>:{category};<result>:{json.dumps(response, ensure_ascii=False)}"
            if response
            else f"{title}.{description}"
            for title, description, category, response in result
        ]
        rag_query = " ".join(combined_results)

    query_template = template.format(
        context=rag_query, category=request["category"], text=request["text"]
    )

    # добавляем запрос к контексту
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
    return output[0]["generated_text"]
