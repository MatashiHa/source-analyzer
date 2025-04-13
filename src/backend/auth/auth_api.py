import os
import secrets
from datetime import datetime, timedelta

import httpx
from auth.session_dao import SessionsDAO
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse

from backend.user_dao import UsersDAO

load_dotenv()


def generate_session_id() -> str:
    return secrets.token_urlsafe(32)


async def get_current_user(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = await SessionsDAO().is_session_valid(session_id=session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    user = await UsersDAO().find_one_or_none(user_id=session.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


async def get_user_info(code: str, provider: str):
    async with httpx.AsyncClient() as client:
        if provider == "github":
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": os.getenv(f"{provider.upper()}_CLIENT_ID"),
                    "client_secret": os.getenv(f"{provider.upper()}_CLIENT_SECRET"),
                    "code": code,
                    "redirect_uri": os.getenv(f"{provider.upper()}_REDIRECT_URI"),
                },
                headers={"Accept": "application/json"},
            )
        else:
            return {"error": "Invalid provider"}
        # Обмен кода на токен
        token_data = response.json()
        access_token = token_data.get("access_token")
        # Получение данных пользователя
        user_info = (
            await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"},
            )
        ).json()

        emails = (
            await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"},
            )
        ).json()

        # Поиск первичного email
        primary_email = next(
            (email["email"] for email in emails if email["primary"]), None
        )

        # Добавление email к информации о пользователе
        user_info["email"] = primary_email
        return user_info


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/google")
async def login_google():
    pass


@router.get("/yandex")
async def login_yandex():
    return {"message": "Hello"}


@router.get("/vk")
async def login_vk():
    pass


scope = "user:email"  # требуем от провайдера email


@router.get("/github")
async def login_github():
    return {
        "url": f"https://github.com/login/oauth/authorize?client_id={os.getenv('GITHUB_CLIENT_ID')}&redirect_uri={os.getenv('GITHUB_REDIRECT_URI')}&scope={scope}"
    }


@router.get("/github/callback")
async def auth_github_callback(code: str):
    user_info = await get_user_info(code, "github")
    user_record = {
        "login": user_info["login"],
        "provider": "github",
        "provider_id": str(user_info["id"]),
        "email": user_info["email"],
    }
    user = await UsersDAO().find_one_or_none(provider_id=user_record["provider_id"])
    if not user:
        await UsersDAO.add(**user_record)

    session_id = generate_session_id()
    await SessionsDAO.add(
        session_id=session_id,
        user_id=user.user_id,
        expires_at=datetime.now() + timedelta(days=1),  # сессия на 1 день
    )
    response = RedirectResponse(url="http://localhost:3000/")

    response.set_cookie(
        key="session_id", value=session_id, max_age=86400, secure=True, samesite="lax"
    )
    return response


@router.post("/logout")
async def logout(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    if session_id:
        await SessionsDAO.delete(session_id=session_id)
    response.delete_cookie("session_id")
    return {"redirect_url": "http://localhost:3000/auth/"}


@router.get("/check")
async def check_auth(request: Request):
    if request.url.path == "/auth":
        return {"status": "public"}

    try:
        user = await get_current_user(request)
        return {"user": user.login}
    except HTTPException as e:
        if e.status_code == 401:
            response = JSONResponse(
                status_code=401, content={"detail": "Not authenticated"}
            )
            response.headers["X-Redirect-Url"] = "http://localhost:3000/auth"
            return response
        raise
