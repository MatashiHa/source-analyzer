import os
import sys

sys.path.insert(1, os.path.join(sys.path[0], ".."))

from analysis import router as analysis_router
from auth.auth_api import router as auth_router
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from feed.feed_api import router as feed_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Разрешаем запросы с фронта
    allow_credentials=True,  # Разрешаем получение клиентской информации(куки и т.д.)
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
    expose_headers=["X-Redirect-Url"],  # Явно разрешаем кастомный заголовок
)


# uvicorn backend.main:app --reload
app.include_router(auth_router)
app.include_router(feed_router)
app.include_router(analysis_router)
