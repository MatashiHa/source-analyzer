import os
import secrets

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from backend.session_dao import SessionsDAO
from backend.user_dao import UsersDAO

load_dotenv()


def generate_session_id() -> str:
    return secrets.token_urlsafe(32)


async def get_current_user(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = SessionsDAO().is_session_valid(session_id=session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    user = UsersDAO().find_one(user_id=session["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


router = APIRouter(prefix="/auth", tags=["Auth"])
scope = "user:email"  # требуем от провайдера email


@router.get("/github")
async def login_github():
    return {
        "url": f"https://github.com/login/oauth/authorize?client_id={os.getenv('GITHUB_CLIENT_ID')}&redirect_uri={os.getenv('GITHUB_REDIRECT_URI')}&scope={scope}"
    }


@router.get("/github/callback")
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
