from pathlib import Path

import scrapy


class DocumentsSpider(scrapy.Spider):
    name = "documents"

    def __init__(self, urls=None):
        super()
        self.start_urls = urls or []

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = f"article-{page}.html"
        Path(filename).write_bytes(response.body)
        self.log(f"Saved file {filename}")


if __name__ == "__main__":
    from scrapy.crawler import CrawlerProcess

    urls = ["https://habr.com/ru/companies/ods/articles/673376/"]
    process = CrawlerProcess()
    process.crawl(DocumentsSpider, urls=urls)
    process.start()
