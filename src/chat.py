from rag import rag_query


async def chat(args, tokenizer, model, embedding_model, device):
    """chat cycle with a set LLM

    Args:
        args (_type_): some args if passed
        model (_type_): LLM for answering the questions
        device (str): CUDA or CPU
        tokenizer (_type_): some tokenizer for a query
    """
    print("Chat started. Type 'exit' to end the chat.")

    while True:
        question = input("Ask a question: ")

        if question.lower() == "exit":
            break

        answer = await rag_query(
            tokenizer=tokenizer,
            model=model,
            embedding_model=embedding_model,
            device=device,
            query=question,
        )

        print(f"You Asked: {question}")
        print(f"Answer: {answer}")

    print("Chat ended.")
