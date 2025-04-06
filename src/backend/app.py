import os
import sys

sys.path.insert(1, os.path.join(sys.path[0], ".."))

from auth import router as auth_router
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
# app.mount("/", StaticFiles(directory="src/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Разрешаем запросы с фронта
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
    expose_headers=["X-Redirect-Url"],  # Явно разрешаем кастомный заголовок
)


# uvicorn backend.app:app --reload
app.include_router(auth_router)
