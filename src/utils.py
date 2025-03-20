import os
import re
from datetime import datetime

import pytz
from dateutil import parser as dateutil_parser
from delorean import parse as delorean_date_parse
from dotenv import load_dotenv
from sqlalchemy.engine.base import Engine
from sqlalchemy.ext.asyncio import create_async_engine

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
        return dateutil_parser.parse(ts, tzinfos=tzinfos)

    # if instead an offset is specified like +0100, we use the delorean parser
    elif re.match(pattern=r"[\+\-]\d{4}", string=ts[-5:]):
        return delorean_date_parse(ts).datetime

    # otherwise we return UTC time
    else:
        return delorean_date_parse(ts).datetime


def parse_html():
    pass


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
