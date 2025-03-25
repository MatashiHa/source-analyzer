import pandas as pd
import torch


# Функция для получения эмбеддингов предложений
def get_embeddings(
    model: any,
    tokenizer: any,
    device: str,
    df: pd.DataFrame,
    col_name: str = "title",
) -> pd.DataFrame:
    """get dataframe with column {col_name}, gets embeddings
    on all entries and returns dataframe with embeddings

    Args:
        model (any): embedding model
        device (str): cpu or gpu(cuda)
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
            max_length=512,
        ).to(device)
    else:
        # case when a single string with no column is passed
        inputs = tokenizer(
            df[0][0],
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512,
        ).to(device)
        with torch.no_grad():
            model.to(device)
            outputs = model(**inputs)
        # Используем скрытые состояния последнего слоя
        last_hidden_states = outputs.last_hidden_state
        # Усредняем по токенам для получения одного вектора для каждого предложения
        embeddings = last_hidden_states.mean(dim=1)
        return embeddings
