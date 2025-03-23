import asyncio
from datetime import datetime
from typing import List, Set

import feedparser
import pandas as pd
from mmh3 import hash as mmh3_hash
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from tqdm import tqdm

from backend.database import async_session_maker
from backend.text_analysis.models import Articles
from utils import filter_on_publication_date, parse_html, parse_time


class RSSCrawler:
    # потенциально можно будет сделать API и связать с processor
    def __init__(self, session: AsyncSession, urls: Set[str], processor: None):
        """Class representing RSS crawler to read, process and update vector DB

        Args:
            session (AsyncSession): session to make transactions to DB
            urls (Set[str]): set of urls to get rss feed form
            processor (any): text preprocessing from processor.py
        """
        self.session = session
        self.urls = urls
        self.processor = processor

    async def parse_rss_feeds(self, urls) -> pd.DataFrame:
        """Goes through all rss-feeds, gets new articles

        Returns:
            pd.Dataframe: a Dataframe with title, publication time,
            link, description and content if exists
        """
        dataframes_per_url: List[pd.DataFrame] = []

        for url in tqdm(urls, total=len(urls)):
            feed: List[feedparser.util.FeedParserDict] = feedparser.parse(url)[
                "entries"
            ]
            curr_df: pd.DataFrame = await self.__parse_rss_feed(feed)
            dataframes_per_url.append(curr_df)
            print(f"Parsed {url} feed with {len(feed)} records.")

        df = pd.concat(dataframes_per_url).drop_duplicates(subset="article_id")
        df.set_index("article_id")
        print(f"Parsed {len(urls)} feeds with {len(df)} records in total.")
        return df

    @staticmethod
    async def __parse_rss_feed(
        feed: List[feedparser.util.FeedParserDict],
    ) -> pd.DataFrame:
        """Parses a single RSS feed and fetches titles, sources, publications timestamps and .

        Args:
            feed (List[feedparser.util.FeedParserDict]):
            a list of dict, output of feedparser.parse(url)['entries']

        Returns:
            pd.DataFrame: a Dataframe with title, publication time,
            link, description and content if exists
        """

        ids, parsed_titles, links, pub_dates, descriptions, contents = (
            [],
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

                if "content" in article_metadata.keys():
                    contents.append(parse_html(article_metadata.content))
                else:
                    contents.append("missing")

        print(article_metadata.keys())
        df = pd.DataFrame(
            {
                "article_id": ids,
                "title": parsed_titles,
                "link": links,
                "pub_date": pub_dates,
                "description": descriptions,
                "content": contents,
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
                insert(Articles)
                .values(**entry)  # Теперь entry — это словарь
                .on_conflict_do_update(
                    index_elements=["link"],  # Уникальный ключ для проверки
                    set_=entry,  # Обновляем все поля
                )
            )
            await session.execute(stmt)
        await session.commit()

    async def run(self):
        # прнимаем запрос от пользователя с url
        # эти url парсим, обрабатываем а потом обновляем БД
        df = await self.parse_rss_feeds(self.urls)
        print("data parsed")

        # we'll keep only today's news
        today = datetime.today().strftime("%Y-%m-%d")
        filtered_df = filter_on_publication_date(df=df, min_date=today)
        print("data processed")

        embedded_df = await self.processor.get_embedding(df=df, text_col_name="title")

        async with async_session_maker() as session:
            await self.update_db(session, filtered_df)
        print("DB updated!")


async def main():
    """creates and runs the crawler"""
    urls = [
        "https://habr.com/ru/rss/feed/9af9dfc74138343b34b7948a385d7713?fl=ru&types%5B%5D=article&types%5B%5D=post&types%5B%5D=news"
    ]

    async with async_session_maker() as session:
        crawler = RSSCrawler(session, urls, None)
        await crawler.run()


if __name__ == "__main__":
    asyncio.run(main())
