import pandas as pd
from sqlalchemy import select

from backend.database.database import async_session_maker
from backend.database.models import Articles
from crawler.processor import get_embeddings

template = """[INST]
        You are a friendly documentation search bot.
        Use following piece of context to answer the question.
        If the context is empty, try your best to answer without it.
        Never mention the context.
        Try to keep your answers concise unless asked to provide details.
        
        Context: {context}
        Question: {question}
        [/INST]
        Answer:
        """


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

        input = tokenizer.encode(query_template, return_tensors="pt")

        # getting response from model by passing query with context
        generated_response = model.generate(
            input.to(device), max_new_tokens=200, pad_token_id=tokenizer.eos_token_id
        )

        return tokenizer.decode(
            generated_response[0][input.shape[-1] :], skip_special_tokens=True
        )
