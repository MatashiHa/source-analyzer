import os
import secrets
from datetime import datetime, timedelta

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse

from backend.session_dao import SessionsDAO
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
    # response = RedirectResponse(url="http://localhost:3000/auth/", status_code=303)
    response.delete_cookie("session_id")
    return {"redirect_url": "http://localhost:3000/auth/"}


@router.get("/check-auth")
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
