import datetime
import json
import os
import re

import nltk
import pandas as pd
import pytz
from bs4 import BeautifulSoup
from dateutil import parser as dateutil_parser
from delorean import parse as delorean_date_parse
from dotenv import load_dotenv
from sqlalchemy.engine.base import Engine
from sqlalchemy.ext.asyncio import create_async_engine

nltk.download("punkt")
nltk.download("punkt_tab")

load_dotenv()


def get_conn_string(
    user: str = os.getenv("USER"),
    pwd: str = os.getenv("PASSWORD"),
    dbname: str = os.getenv("DB"),
    host: str = os.getenv("HOST"),
) -> str:
    return f"postgresql+asyncpg://{user}:{pwd}@{host}/{dbname}"


def get_async_db_connection_engine() -> Engine:
    conn_string = get_conn_string()

    engine = create_async_engine(conn_string)

    return engine


def parse_time(ts: str, named_timezones=("EST", "GMT", "UTC")) -> datetime.datetime:
    """
    Parses a time string with either offsets like +0000 of timezones like EST, GMT, UTC.
    :param ts: a string formatted like 'Mon, 25 Apr 2022 13:47:46 +0000' or with time zone in the end
    :param named_timezones: a fixed tuple of timezones to map to those known to PyTZ
    :return: a timezone-aware datetime.datetime object
    """
    # if one of EST, GMT, UTC is specified as a timezone, parse it with dateutils
    tzinfos = {tz: pytz.timezone(tz) for tz in named_timezones}
    if ts[-3:] in named_timezones:
        dt = dateutil_parser.parse(ts, tzinfos=tzinfos)

    # if instead an offset is specified like +0100, we use the delorean parser
    elif re.match(pattern=r"[\+\-]\d{4}", string=ts[-5:]):
        dt = delorean_date_parse(ts).datetime

    # otherwise we return UTC time
    else:
        dt = delorean_date_parse(ts).datetime

    return dt.replace(tzinfo=None)


def parse_html(feed_data) -> str:
    """cleans text from html tags and uses lxml for faster processing

    Args:
        html_text (str): arbitrary text

    Returns:
        str: cleaned texts
    """
    if hasattr(feed_data, "entries"):
        # Извлекаем HTML-контент из всех записей
        html_parts = [
            entry.get("description", "") or entry.get("summary", "")
            for entry in feed_data.entries
        ]
        html_text = "".join(html_parts)
    # Если пришел список
    elif isinstance(feed_data, list):
        html_text = "".join(str(item) for item in feed_data)  # Приводим всё к строке
    # Если пришла строка
    else:
        html_text = str(feed_data)
    soup = BeautifulSoup(
        html_text, "lxml"
    )  # Используем lxml для более быстрого парсинга
    clean_text = soup.get_text(separator=" ")
    clean_text = " ".join(clean_text.split())
    return clean_text


def filter_on_publication_date(
    df: pd.DataFrame, min_date: str, pub_timestamp_col_name: str = "pub_date"
) -> pd.DataFrame:
    """
    Leave only texts in `text_col_name` column of the DataFrame `df` that are longer than
    `min_length_words` words.
    :param df: a DataFrame
    :param min_date: date formatted as YYYY-MM-DD
    :param pub_timestamp_col_name: column name to filter on
    :return: bool
    """
    return df.loc[df[pub_timestamp_col_name] >= min_date]


def remove_json_markdown(text):
    return re.sub(r"```json\s*([\s\S]*?)\s*```", r"\1", text)


def is_valid_json(json_string):
    """
    Проверяет, является ли строка валидным JSON.

    :param json_string: Строка для проверки
    :return: True если JSON валиден, False в противном случае
    """
    try:
        json.loads(json_string)
    except (ValueError, TypeError):
        return False
    return True


def split_text_into_paragraphs(text, target_length=500):
    sentences = nltk.sent_tokenize(text)  # разбиваем текст на предложения
    paragraphs = []
    current_paragraph = ""

    for sentence in sentences:
        # Если добавление нового предложения не превысит целевой размер
        if len(current_paragraph + sentence) <= target_length:
            current_paragraph += sentence + " "
        else:
            # Если абзац уже достаточно большой, сохраняем его
            if current_paragraph:
                paragraphs.append(current_paragraph.strip())
            current_paragraph = sentence + " "

    # Добавляем последний абзац
    if current_paragraph:
        paragraphs.append(current_paragraph.strip())

    return paragraphs


# def get_logger(name: str) -> logging.Logger:
#     """get logger instance for debugging

#     Args:
#         name (str): any string

#     Returns:
#         logging.Logger: logger instance
#     """

#     params = load_config_params()
#     log_config = params["logger"]
#     logging.config.dictConfig(config=log_config)

#     return logging.getLogger(name)
