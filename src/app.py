import argparse
from enum import Enum

from dotenv import load_dotenv

from chat import chat
from crawler.rss_crawler import import_data

load_dotenv()


class Command(Enum):
    IMPORT_DATA = "import-data"
    CHAT = "chat"


async def main():
    parser = argparse.ArgumentParser()

    subparsers = parser.add_subparsers(
        title="Subcommands",
        dest="command",
        help="Display available subcommands",
    )

    # import-data command
    import_data_parser = subparsers.add_parser(
        Command.IMPORT_DATA.value, help="Import data"
    )

    # пока захардкодили
    import_data_parser.add_argument(
        "data_source", type=str, help="Specify the data source"
    )
    import_data_parser.set_defaults(func=import_data)

    # chat command
    chat_parser = subparsers.add_parser(Command.CHAT.value, help="Use chat feature")
    chat_parser.set_defaults(func=chat)

    args = parser.parse_args()


if __name__ == "__main__":
    main()
