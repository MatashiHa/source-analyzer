import os

import torch
from dotenv import load_dotenv
from transformers import (
    AutoModel,
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
)

load_dotenv()


if torch.cuda.is_available():
    device = "cuda"
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
    )
else:
    device = "cpu"
    bnb_config = None


def load_tokenizer():
    tokenizer = AutoTokenizer.from_pretrained(
        os.getenv("LLM_MODEL_NAME"),
        token=os.getenv("HF_TOKEN"),
        # device_map=device,
    )
    return tokenizer


def load_embedding_model(tokenizer):
    embedding_model = AutoModel.from_pretrained(
        os.getenv("EMBEDDING_MODEL_NAME"),
        token=os.getenv("HF_TOKEN"),
    )
    embedding_model.resize_token_embeddings(len(tokenizer), mean_resizing=False)
    return embedding_model


def load_model():
    model = AutoModelForCausalLM.from_pretrained(
        os.getenv("LLM_MODEL_NAME"),
        token=os.getenv("HF_TOKEN"),
        quantization_config=bnb_config,
        device_map=device,
    )
    return model


tokenizer = load_tokenizer()
embedding_model = load_embedding_model(tokenizer)
model = load_model()
