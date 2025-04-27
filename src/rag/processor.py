from backend.analysis.analysis_dao import AnalysesDAO
from backend.dao.article_dao import ArticlesDAO
from backend.database.database import async_session_maker
from backend.database.models import LLMConnection
from models.models import device, embedding_model, model, tokenizer
from rag.rag import rag_processing
from utils import is_valid_json, remove_json_markdown


async def process(
    args,
    tokenizer=tokenizer,
    model=model,
    embedding_model=embedding_model,
    device=device,
):
    """process cycle with a set LLM

    Args:
        args (_type_): some args if passed
        model (_type_): LLM for answering the questions
        device (str): CUDA or CPU
        tokenizer (_type_): some tokenizer for a query
    """
    print("Processing started.")
    # тут просто запускаем процесс обработки данных в БД до тех пор пока есть неразмеченные данные
    async with async_session_maker() as session:
        analysis = await AnalysesDAO.find_one_or_none_by_id(args.req_id)
        connections_to_process = []
        texts_to_process = []
        if hasattr(args, "feed_id"):
            entries = await ArticlesDAO.find_articles_without_analysis(
                args.feed_id, args.req_id
            )

            for entry in entries:
                conn = LLMConnection(
                    article_id=entry.article_id, requset_id=args.req_id
                )
                session.add(conn)
                connections_to_process.append(conn)
                texts_to_process.append(entry.title)
            await session.commit()

        if hasattr(args, "documenent_id"):
            pass

        for conn, text in zip(connections_to_process, texts_to_process):
            # print((await llm_conn.awaitable_attrs.article).title)
            try:
                response = await rag_processing(
                    tokenizer=tokenizer,
                    model=model,
                    embedding_model=embedding_model,
                    device=device,
                    request={
                        "category": analysis.category,
                        "text": text,
                    },
                )
                print(response)

                response = remove_json_markdown(response)
                if is_valid_json(response):
                    conn.response = response

                # await session.commit()
            except Exception as e:
                print(e)
                conn.response = {"error": str(e)}
                # await session.commit()
            finally:
                await session.commit()
                await session.refresh(conn)  # Получить актуальное `updated_at`

    # await session.execute(text("DELETE FROM llm_conn;"))
    # await session.commit()
    print("Processing complete!")
