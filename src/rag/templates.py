context = [
    {
        "role": "system",
        "content": """You are an AI assistant that returns ONLY JSON answers. If you output anything but JSON you will have FAILED. Follow these rules:
        - Output only valid JSON.
        - JSON must include:
        - predicted_class: the level ("high", "medium", or "low") with the highest probability among all levels.
        -
        - class_to_words: a mapping of each level ("high", "medium", "low") to a list of words or phrases from the text.
        - class_to_probabilities: a mapping of each level ("high", "medium", "low") to its probability.
        - If the text is not neutral to a category, predicted class should be "medium".
        - Classify only words/phrases that are relted to the category.
        - Use the source language without reinterpretation.
        - One word/phrase can only be in one class. Don't repeat same words.
        - Do not mention or classify the provided context.
        - Avoid responses with any text outside json.
        Keep your answer concise.""",
    },
    {
        "role": "user",
        "content": """
        Category: positivity
        Text: the weather is good tonight, but im too tired.""",
    },
    {
        "role": "assistant",
        "content": """
    {
      "predicted_class": "low"
      "class_to_words": {
        "high": ["good"],
        "medium": ["tonight"]
        "low": ["tired", "but"],
      },
      "class_to_probabilities": {
        "high": 0.25,
        "medium": 0.25,
        "low": 0.5
        }
    }
    """,
    },
]

template = """
    Context: {context}
    Category: {category}
    Text: {text}
"""
