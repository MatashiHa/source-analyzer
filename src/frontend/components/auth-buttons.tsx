'use client'

import { useAuth } from '@/hooks/use-auth'
import Link from "next/link"

export function AuthButtons() {
  const { isLogged, logout } = useAuth()
  return (
    <div className="flex items-center gap-2">
        {isLogged ? (
            <Link onClick={logout} href="/auth" className="text-sm font-medium mr-2">
                Logout
            </Link>
            ) : (
            <Link href="/auth" className="text-sm font-medium mr-2">
                Login
            </Link>
        )}
    </div>
  )
}