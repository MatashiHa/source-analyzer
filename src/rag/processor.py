from sqlalchemy import and_, or_, select, text

from backend.database.database import async_session_maker
from backend.database.models import Articles, LLMConnection
from rag.rag import rag_processing
from utils import remove_json_markdown


async def process(args, tokenizer, model, embedding_model, device):
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
        # TODO: изменить запрос добавив пользовательские параметры по времени и по источнику
        stmt = select(Articles).where(
            # на обработку берём только те статьи где либо ещё нет связи c llm_conn по той же категории или статья не имеет ответа на запрос,
            # не аннотируется в текущий момент
            or_(
                ~Articles.llm_conn.any(),
                Articles.llm_conn.any(
                    and_(
                        ~LLMConnection.is_annotating,
                        LLMConnection.response is None,
                        LLMConnection.category != args.category,
                    )
                ),
            )
        )
        entries = (await session.execute(stmt)).scalars().all()
        connections_to_process = []
        for entry in entries:
            llm_conn = LLMConnection(
                article_id=entry.article_id, category=args.category, is_annotating=False
            )
            session.add(llm_conn)
            connections_to_process.append(llm_conn)
        await session.commit()

        for llm_conn in connections_to_process:
            # print((await llm_conn.awaitable_attrs.article).title)
            try:
                response = await rag_processing(
                    tokenizer=tokenizer,
                    model=model,
                    embedding_model=embedding_model,
                    device=device,
                    request=[
                        args.category,
                        (await llm_conn.awaitable_attrs.article).title,
                    ],
                )
                print(response)
                llm_conn.is_annotating = False
                llm_conn.response = remove_json_markdown(response)
                # await session.commit()
            except Exception as e:
                print(e)
                llm_conn.response = {"error": str(e)}
                # await session.commit()
            finally:
                await session.commit()
                await session.refresh(llm_conn)  # Получить актуальное `updated_at`

        # for entry in entries:
        #     llm_conn = LLMConnection(
        #         article_id=entry.article_id, category=args.category
        #     )
        #     session.add(llm_conn)
        #     # await session.commit()

        #     try:
        #         response = await rag_processing(
        #             tokenizer=tokenizer,
        #             model=model,
        #             embedding_model=embedding_model,
        #             device=device,
        #             request=[llm_conn.category, entry.title],
        #         )
        #         print(response)
        #         llm_conn.response = remove_json_markdown(response)
        #         # await session.commit()
        #     except Exception as e:
        #         print(e)
        #         # llm_conn.response = {"error": str(e)}
        #         # await session.commit()
        #     finally:
        #         await session.commit()
        #         # await session.refresh(llm_conn)  # Получить актуальное `updated_at`

    await session.execute(text("DELETE FROM llm_conn;"))
    await session.commit()
    print("Processing complete!")
