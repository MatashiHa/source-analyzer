from collections import namedtuple
from datetime import datetime

import feedparser
import pandas as pd
from mmh3 import hash as mmh3_hash
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from tqdm import tqdm

from backend.database.database import async_session_maker
from backend.database.models import Article
from models.models import device, embedding_model, tokenizer
from utils import filter_on_publication_date, parse_html, parse_time

from .processor import get_embeddings

Feed = namedtuple("Feed", ["id", "url"])


class RSSCrawler:
    # потенциально можно будет сделать API и связать с processor
    def __init__(self, session: AsyncSession, urls: list):
        """Class representing RSS crawler to read, process and update vector DB

        Args:
            session (AsyncSession): session to make transactions to DB
            urls (Set[str]): set of urls to get rss feed form
            embedding_model (any): text preprocessing from processor.py
        """
        self.session = session
        self.feeds = [Feed(*item) for item in urls]

    async def parse_rss_feeds(self, feeds) -> pd.DataFrame:
        """Goes through all rss-feeds, gets new articles

        Returns:
            pd.Dataframe: a Dataframe with title, publication time,
            link and description if exists
        """
        dataframes_per_url: list[pd.DataFrame] = []

        for feed in tqdm(feeds, total=len(feeds)):
            feed_data: list[feedparser.util.FeedParserDict] = feedparser.parse(
                feed.url
            )["entries"]
            if len(feed_data) == 0:
                print("Feed was empty.")
            curr_df: pd.DataFrame = await self.__parse_rss_feed(feed_data)
            dataframes_per_url.append(curr_df)
            print(f"Parsed {feed.url} feed with {len(feed_data)} records.")

        df = pd.concat(dataframes_per_url).drop_duplicates(subset="article_id")
        df.set_index("article_id")
        df["feed_id"] = feed.id
        print(f"Parsed {len(feeds)} feeds with {len(df)} records in total.")
        return df

    @staticmethod
    async def __parse_rss_feed(
        feed: list[feedparser.util.FeedParserDict],
    ) -> pd.DataFrame:
        """Parses a single RSS feed and fetches titles, sources, publications timestamps and .

        Args:
            feed (List[feedparser.util.FeedParserDict]):
            a list of dict, output of feedparser.parse(url)['entries']

        Returns:
            pd.DataFrame: a Dataframe with title, publication time,
            link, description and content if exists
        """
        ids, parsed_titles, links, pub_dates, descriptions = (
            [],
            [],
            [],
            [],
            [],
        )

        for article_metadata in feed:
            # "title", "published" are obligatory fields
            if ("title" not in article_metadata.keys()) or (
                "published" not in article_metadata.keys()
            ):
                continue
            else:
                # obligatory fields are there
                ids.append(mmh3_hash(article_metadata.title, seed=43))
                parsed_titles.append(article_metadata.title)
                pub_dates.append(parse_time(article_metadata.published))
                if "link" in article_metadata.keys():
                    links.append(article_metadata.link)
                else:
                    links.append("missing")

                if "summary" in article_metadata.keys():
                    descriptions.append(parse_html(article_metadata.summary))
                else:
                    descriptions.append("missing")

        print(article_metadata.keys())
        df = pd.DataFrame(
            {
                "article_id": ids,
                "title": parsed_titles,
                "link": links,
                "pub_date": pub_dates,
                "description": descriptions,
            }
        )

        return df

    async def update_db(self, session: AsyncSession, df: pd.DataFrame):
        """Writes scraped content into a table

        Args:
            df (pd.DataFrame): a pandas DataFrame output
            table_name (str): table name to write data to
        """

        # for entry in df:
        for _, row in df.iterrows():  # Итерируемся по строкам DataFrame
            entry = row.to_dict()  # Преобразуем строку в словарь
            stmt = (
                insert(Article)
                .values(**entry)  # Теперь entry — это словарь
                .on_conflict_do_update(
                    index_elements=["article_id"],  # Уникальный ключ для проверки
                    set_=entry,  # Обновляем все поля
                )
            )
            await session.execute(stmt)
        await session.commit()

    async def run(self, tokenizer, model, device):
        # прнимаем запрос от пользователя с url
        # эти url парсим, обрабатываем, а потом обновляем БД
        df = await self.parse_rss_feeds(self.feeds)
        print("data parsed")

        if not model or not tokenizer:
            raise ValueError("Model not found")
        # пока используем привязку к сегодняшнему дню, потом можно сделать пользовательскую настройку
        today = datetime.today().strftime("%Y-%m-%d")
        filtered_df = filter_on_publication_date(df=df, min_date=today).copy()
        count = len(filtered_df)
        if not count:  # Если список пуст
            return count
        df_with_embeddings, _ = get_embeddings(
            tokenizer=tokenizer,
            model=model,
            df=filtered_df,
            col_name="title",
            device=device,
        )
        filtered_df.loc[:, "embeddings"] = list(df_with_embeddings.numpy())
        print("data processed")

        async with async_session_maker() as session:
            await self.update_db(session, filtered_df)
        print("DB updated!")
        return count


async def import_data(
    args, tokenizer=tokenizer, embedding_model=embedding_model, device=device
):
    """creates and runs the crawler"""
    data = getattr(args, "urls", args)
    async with async_session_maker() as session:
        crawler = RSSCrawler(session, data)
        await crawler.run(tokenizer, embedding_model, device)


# if __name__ == "__main__":
#     asyncio.run(main())
