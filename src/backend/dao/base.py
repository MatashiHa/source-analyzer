# DAO (Data Access Object)

from database.database import async_session_maker
from sqlalchemy import delete
from sqlalchemy.future import select


class BaseDAO:
    model = None

    @classmethod
    async def find_one_or_none_by_id(cls, data_id: int):
        """
        Асинхронно находит и возвращает один экземпляр модели по указанным критериям или None.

        Аргументы:
            data_id: Критерий фильтрации в виде идентификатора записи.

        Возвращает:
            Экземпляр модели или None, если ничего не найдено
        """

        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=data_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        """
        Асинхронно находит и возвращает один экземпляр модели по указанным критериям или None.

        Аргументы:
            **filter_by: Критерий фильтрации в виде именованных параметров.

        Возвращает:
            Экземпляр модели или None, если ничего не найдено
        """
        async with async_session_maker() as session:
            stmt = select(cls.model).filter_by(**filter_by)
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    @classmethod
    async def find_all(cls, **filter_by):
        """
        Асинхронно находит и возвращает все экземпляры модели, удовлетворяющие указанным критериям.

        Аргументы:
            **filter_by: Критерии фильтрации в виде именованных параметров.

        Возвращает:
            Список экземпляров модели.
        """
        async with async_session_maker() as session:
            stmt = select(cls.model).filter_by(**filter_by)
            result = await session.execute(stmt)
            return result.scalars().all()

    @classmethod
    async def add(cls, **values):
        """
        Асинхронно создает новый экземпляр модели с указанными значениями.

        Аргументы:
            **values: Именованные параметры для создания нового экземпляра модели.

        Возвращает:
            Созданный экземпляр модели.
        """
        async with async_session_maker() as session:
            new_instance = cls.model(**values)
            session.add(new_instance)
            try:
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise ValueError(f"Add failed: {str(e)}")
            return new_instance

    @classmethod
    async def update(
        cls, instance: any, partial: bool = True, **update_values: any
    ) -> any:
        """
        Обновляет экземпляр модели данными DTO

        :param session: Асинхронная сессия SQLAlchemy
        :param instance: Объект модели для обновления
        :param partial: Разрешить частичное обновление (только указанные поля)
        :param update_values: Значения для обновления
        :return: Обновлённый экземпляр модели
        """
        async with async_session_maker() as session:
            # Создаем DTO с переданными значениями
            dto = cls.model(**update_values)

            # Получаем только измененные поля
            update_data = dto.model_dump(exclude_unset=partial, exclude_none=True)

            # Применяем обновления
            for field, value in update_data.items():
                setattr(instance, field, value)

            session.add(instance)
            try:
                await session.commit()
                await session.refresh(instance)
                return instance
            except Exception as e:
                await session.rollback()
                raise ValueError(f"Update failed: {str(e)}")

    # async def update(cls, id: int, **values):
    #     """
    #     Асинхронно обновляет экземпляр модели с указанными значениями.

    #     Аргументы:
    #         id: Идентификатор экземпляра
    #         **values: Именованные параметры для обновления экземпляра модели.

    #     Возвращает:
    #         Обновлнный экземпляр модели.
    #     """

    # async with async_session_maker() as session:
    #     # async with session.begin():
    #     # Извлекаем существующий объект по ID
    #     query = select(cls.model).where(cls.model.id == id)
    #     result = await session.execute(query)
    #     instance = result.scalar_one_or_none()

    #     if instance is None:
    #         return None

    #     # Обновляем поля экземпляра
    #     for key, value in values.items():
    #         setattr(instance, key, value)

    #     await session.refresh(
    #         instance
    #     )  # Обновляем объект после commit для получения актуальных данных
    #     try:
    #         # Сохраняем изменения
    #         await session.commit()
    #     except SQLAlchemyError as e:
    #         await session.rollback()
    #         raise e

    #     return instance

    @classmethod
    async def delete(cls, **filters):
        """
        Асинхронно удаляет экземпляр модели с указанными значениями.

        Аргументы:
            **values: Именованные параметры для удаления экземпляра модели.

        Возвращает:
            ничего
        """
        async with async_session_maker() as session:
            stmt = delete(cls.model).filter_by(**filters)
            try:
                await session.execute(stmt)
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise ValueError(f"Delete failed: {str(e)}")
