import argparse
import asyncio
import os
from enum import Enum

import torch
from dotenv import load_dotenv
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    logging,
)

from chat import chat
from crawler.rss_crawler import import_data

load_dotenv(override=True)
logging.set_verbosity_error()


def run_async_function(args, tokenizer, model):
    asyncio.run(args.func(args, tokenizer, model))


class Command(Enum):
    IMPORT_DATA = "import-data"
    CHAT = "chat"


def main():
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
    import_data_parser.add_argument("url", type=str, help="Specify the rss-feed url")
    import_data_parser.set_defaults(func=import_data)

    # chat command
    chat_parser = subparsers.add_parser(Command.CHAT.value, help="Use chat feature")
    chat_parser.set_defaults(func=chat)

    args = parser.parse_args()
    if hasattr(args, "func"):
        if torch.cuda.is_available():
            device = "cuda"
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.bfloat16,
            )
        else:
            device = "cpu"
            bnb_config = None

        tokenizer = AutoTokenizer.from_pretrained(
            os.getenv("TOKENIZER_NAME"),
            token=os.getenv("HF_TOKEN"),
        )
        embedding_model = AutoModelForCausalLM.from_pretrained(
            os.getenv("EMBEDDING_MODEL_NAME"),
            token=os.getenv("HF_TOKEN"),
        )
        if args.command == "import-data":
            run_async_function(args, tokenizer, embedding_model)
        elif args.command == "chat":
            model = AutoModelForCausalLM.from_pretrained(
                os.getenv("LLM_MODEL_NAME"),
                token=os.getenv("HF_TOKEN"),
                quantization_config=bnb_config,
                device_map=device,
                torch_dtype=torch.float16,
            )
            args.func(args, tokenizer, model, embedding_model, device)
        else:
            print("Hello! This is a RAG test program!")
    else:
        print("Invalid command. Use '--help' for assistance.")


if __name__ == "__main__":
    main()
