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
        embeddings = []
        if hasattr(args, "feed_id"):
            src_type = "feed"
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
                embeddings.append(entry.embeddings)
            await session.commit()

        if hasattr(args, "document_id"):
            src_type = "document"
            # 1-й способ: для conn делим докумнент на отрывки,каждый отрывок берём и в цикле обрабатываем, а результаты обработки складываем в один response.
            # 2-й способ: для каждого отрывка создаём свой conn и обрабатываем в цикле, после чего результаты обработки кладём в один conn -- пока нет смысла без поля embeddings внутри conn.
            # for entry in entries:
            conn = LLMConnection(document_id=args.document_id, requset_id=args.req_id)
            session.add(conn)
            connections_to_process.append(conn)
            texts_to_process.append(entry.content)
            embeddings.append(entry.embeddings)
            await session.commit()

        for conn, text, embedding in zip(
            connections_to_process, texts_to_process, embeddings
        ):
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
                    query_embedding=embedding,
                    src_type=src_type,
                )
                # print(response)

                response = remove_json_markdown(response)
                if is_valid_json(response):
                    conn.response = response
            except Exception as e:
                print(e)
                conn.response = {"error": str(e)}
            finally:
                await session.commit()
                await session.refresh(conn)  # Получить актуальное `updated_at`

    # await session.execute(text("DELETE FROM llm_conn;"))
    # await session.commit()
    print("Processing complete!")
