import re

from sqlalchemy import or_, select

from backend.database.database import async_session_maker
from backend.database.models import Articles, LLMConnection
from rag import rag_processing


def remove_json_markdown(text):
    return re.sub(r"```json\s*([\s\S]*?)\s*```", r"\1", text)


async def process(args, tokenizer, model, embedding_model, device):
    """chat cycle with a set LLM

    Args:
        args (_type_): some args if passed
        model (_type_): LLM for answering the questions
        device (str): CUDA or CPU
        tokenizer (_type_): some tokenizer for a query
    """
    print("Processing started.")
    # тут просто запускаем процесс обработки данных в БД до тех пор пока есть неразмеченные данные
    async with async_session_maker() as session:
        stmt = select(Articles).where(
            or_(Articles.llm_conn is None, Articles.llm_conn.has(is_annotating=False))
        )
        entries = session.execute(stmt).scalars().all()
        for entry in entries:
            llm_conn = LLMConnection(article_id=entry.id, category=args.category)
            session.add(llm_conn)
            await session.commit()

            try:
                response = await rag_processing(
                    tokenizer=tokenizer,
                    model=model,
                    embedding_model=embedding_model,
                    device=device,
                    request=[llm_conn.category, entry.title],
                )
                llm_conn.response = remove_json_markdown(response)
                await session.commit()
            except Exception as e:
                llm_conn.response = {"error": str(e)}
                await session.commit()

    print("Processing complete!")
