import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const response = await fetch('http://localhost:8000/auth/check', {
      credentials: 'include',
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
      },
    })
    
    if (response.status === 401) {
      console.log(response.status)
      return NextResponse.redirect(new URL('/auth', request.url))
    }
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|auth).*)'
    ]
}