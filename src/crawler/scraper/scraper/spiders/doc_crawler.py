import scrapy
from scrapy.crawler import CrawlerProcess


class DocumentsSpider(scrapy.Spider):
    name = "documents"

    def __init__(self, urls, results, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_urls = urls or []
        self.results = results

    def parse(self, response):
        paragraphs = response.xpath("//p/text()").getall()
        text = " ".join(p.strip() for p in paragraphs if p.strip())
        if self.results is not None:
            self.results.append(text)


def import_data(urls):
    results = []
    process = CrawlerProcess()
    process.crawl(
        DocumentsSpider,
        urls=urls,
        results=results,
    )
    process.start()
    return results
