import pandas as pd
import torch


# Функция для получения эмбеддингов предложений
def get_embeddings(
    tokenizer: any,
    model: any,
    device: str,
    df: pd.DataFrame,
    col_name: str = "title",
) -> pd.DataFrame:
    """get dataframe with column {col_name}, gets embeddings
    on all entries and returns dataframe with embeddings

    Args:
        device (str): cpu or gpu(cuda)
        model (any): embedding model
        df (pd.DataFrame): dataframe with columns to get embedding from
        col_name (str, optional): column name of dataframe. Defaults to "title".

    Returns:
        pd.DataFrame: processed dataframe with embeddings column
    """
    if col_name in df.columns:
        # Токенизация и получение эмбеддингов
        inputs = tokenizer(
            df[col_name].to_list(),
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=1024,
        ).to(device)
    else:
        # case when a single string with no column is passed
        inputs = tokenizer(
            df[0].to_list(),
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=1024,
        ).to(device)

    with torch.no_grad():
        model.to(device)
        outputs = model(**inputs, output_hidden_states=True)
    # Используем скрытые состояния последнего слоя
    last_hidden_states = outputs.hidden_states[-1]
    # Усредняем по токенам для получения одного вектора для каждого предложения
    embeddings = last_hidden_states.mean(dim=1).cpu()
    shape = embeddings[0].numpy().shape[0]
    return embeddings, shape
