import argparse
import asyncio
import os
import sys
from enum import Enum

import torch
from dotenv import load_dotenv
from transformers import (
    AutoModel,
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    logging,
)

from crawler.rss_crawler import import_data
from processor import process

load_dotenv(override=True)
logging.set_verbosity_error()
# Получаем текущую рабочую директорию (PWD) и добавляем /src
project_src_path = os.path.join(os.getcwd(), "src")

# Добавляем путь в PYTHONPATH
sys.path.insert(0, project_src_path)


def run_async_function(args, tokenizer, model, embedding_model, device):
    asyncio.run(args.func(args, tokenizer, model, embedding_model, device))


class Command(Enum):
    IMPORT_DATA = "import-data"
    PROCESS_DATA = "process-data"


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

    import_data_parser.add_argument("url", type=str, help="Specify the rss-feed url")
    import_data_parser.set_defaults(func=import_data)

    # process-data command
    process_parser = subparsers.add_parser(
        Command.PROCESS_DATA.value, help="Process data available in DB"
    )
    process_parser.add_argument(
        "category", type=str, help="Specify the classification category"
    )
    process_parser.set_defaults(func=process)

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
            os.getenv("LLM_MODEL_NAME"),
            token=os.getenv("HF_TOKEN"),
        )
        embedding_model = AutoModel.from_pretrained(
            os.getenv("EMBEDDING_MODEL_NAME"),
            token=os.getenv("HF_TOKEN"),
        )
        embedding_model.resize_token_embeddings(len(tokenizer))
        if args.command == "import-data":
            run_async_function(args, tokenizer, embedding_model)
        elif args.command == "process":
            model = AutoModelForCausalLM.from_pretrained(
                os.getenv("LLM_MODEL_NAME"),
                token=os.getenv("HF_TOKEN"),
                quantization_config=bnb_config,
                device_map=device,
                torch_dtype=torch.float16,
            )
            run_async_function(args, tokenizer, model, embedding_model, device)
        else:
            print("Hello! This is a data classification program!")
    else:
        print("Invalid command. Use '--help' for assistance.")


if __name__ == "__main__":
    main()
