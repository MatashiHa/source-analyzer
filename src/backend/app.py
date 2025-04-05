import os
import sys

import httpx
from fastapi.responses import RedirectResponse

sys.path.insert(1, os.path.join(sys.path[0], ".."))

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.user_dao import UsersDAO

load_dotenv()

app = FastAPI()
# app.mount("/", StaticFiles(directory="src/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Разрешаем запросы с фронта
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)


# uvicorn backend.app:app --reload

scope = "user:email"  # требуем от провайдера email


@app.get("/auth/github")
async def login_github():
    return {
        "url": f"https://github.com/login/oauth/authorize?client_id={os.getenv('GITHUB_CLIENT_ID')}&redirect_uri={os.getenv('GITHUB_REDIRECT_URI')}&scope={scope}"
    }


@app.get("/auth/github/callback")
async def auth_github_callback(code: str):
    async with httpx.AsyncClient() as client:
        # Обмен кода на токен
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": os.getenv("GITHUB_CLIENT_ID"),
                "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
                "code": code,
                "redirect_uri": os.getenv("GITHUB_REDIRECT_URI"),
            },
            headers={"Accept": "application/json"},
        )
        token_data = response.json()

        # Получение данных пользователя
        userinfo = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        userinfo = userinfo.json()
        # return {"user": user, "token": token_data}
    user_record = {
        "login": userinfo["login"],
        "provider": "github",
        "provider_id": str(userinfo["id"]),
        "email": userinfo["email"],
    }
    user = await UsersDAO.find_one_or_none(provider_id=user_record["provider_id"])
    if not user:
        await UsersDAO.add(**user_record)

    return RedirectResponse(url="http://localhost:3000/")


# app.include_router(users_router)
