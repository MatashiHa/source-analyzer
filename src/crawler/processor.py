import pandas as pd
import torch
from transformers import BertModel, BertTokenizer

# Загрузка модели и токенизатора
model_name = "bert-base-multilingual-cased"
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertModel.from_pretrained(model_name)


# Функция для получения эмбеддингов предложений
def get_embeddings(
    model: any, device: str, df: pd.DataFrame, col_name: str = "title"
) -> pd.DataFrame:
    """get dataframe with column {col_name}, gets embeddings
       on all entries and returns dataframe with embeddings

    Args:
        model (any): embedding model
        device (str): cpu or gpu(cuda)
        df (_type_): dataframe with columns to get embedding from
        col_name (str, optional): column name of dataframe. Defaults to "title".

    Returns:
        _type_: processed dataframe with embeddings column
    """
    # Токенизация и получение эмбеддингов
    inputs = tokenizer(
        df[col_name].to_list(),
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512,
    ).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
    # Используем скрытые состояния последнего слоя
    last_hidden_states = outputs.last_hidden_state
    # Усредняем по токенам для получения одного вектора для каждого предложения
    embeddings = last_hidden_states.mean(dim=1)
    return embeddings


def main():
    sentances = pd.DataFrame(
        [
            "Привет, как дела?",
            "Здравствуйте, как у вас дела?",
            "Что нового?",
            "Как поживаете?",
        ]
    )

    if torch.cuda.is_available():
        device = "cuda"
    get_embeddings(model, device, sentances)


if __name__ == "__main__":
    main()
