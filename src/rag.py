import pandas as pd
from sqlalchemy import text

from backend.database.database import async_session_maker
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


def get_retrieval_condition(query_embedding, threshold=0.7) -> str:
    # Convert query embedding to a string format for SQL query
    query_embedding_str = ",".join(map(str, query_embedding))

    # SQL condition for cosine similarity (<=>), ordered in relevancy
    condition = f"(embeddings <=> '{query_embedding_str}') > {threshold} \
                    ORDER BY embeddings <=> '{query_embedding_str}'"

    return condition


async def rag_query(model: any, tokenizer: any, device: str, query: str) -> str:
    """get embedding of a query, retrieve relevant context from database
    and generate the response

    Args:
        tokenizer (_type_): some tokenizer
        model (_type_): model to generate response
        device (_type_): cpu or cuda
        query (_type_): entry query from user
    """

    # getting an embedding of the query
    query_embedding = get_embeddings(
        model=model,
        tokenizer=tokenizer,
        device=device,
        df=pd.DataFrame({query}),
    ).to_list()

    # passing query to get retrieval condition
    retrieval_condition = get_retrieval_condition(query_embedding=query_embedding)

    # making async request to database with set condition to get 5 max relevant examples
    async with async_session_maker() as session:
        result = await session.execute(
            text(f"""
                SELECT titles 
                FROM Articles 
                WHERE {retrieval_condition} 
                LIMIT 5
            """)
        )

        retrieved = result.scalars().all()

        rag_query = " ".join(retrieved)
        query_template = template.format(context=rag_query, question=query)

        input = tokenizer.encode(query_template, return_tensors="pt")

        # getting response from model by passing query with context
        generated_response = model.generate(
            input.to(device), max_new_tokens=50, pad_token_id=tokenizer.eos_token_id
        )

        return tokenizer.decode(
            generated_response[0][input.shape[-1] :], skip_special_tokens=True
        )
