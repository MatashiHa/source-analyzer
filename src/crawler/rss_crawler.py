from typing import Set

import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession


class RSSCrawler:
    def __init__(
        self, session: AsyncSession, urls_to_rss_feeds: Set[str], processor: any
    ):
        """Class representing RSS crawler to read, process and update vector DB

        Args:
            session (AsyncSession): session to make transactions to DB
            urls_to_rss_feeds (List[str]): list of urls to get rss feed form
            processor (any): text preprocessing from processor.py
        """
        self.session = session
        self.urls_to_rss_feeds = urls_to_rss_feeds
        self.processor = processor

    async def parse_rss_feeds(self) -> pd.Dataframe:
        pass


def main():
    crawler = RSSCrawler()

    crawler.run()


if __name__ == "__main__":
    main()
