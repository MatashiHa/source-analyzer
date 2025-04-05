import os
import sys

sys.path.insert(1, os.path.join(sys.path[0], ".."))


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# app.mount("/", StaticFiles(directory="src/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем запросы с любых источников. Можно ограничить
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)


# uvicorn backend.app:app --reload
@app.get("/")
async def hello():
    return "hello world"


# app.include_router(users_router)
