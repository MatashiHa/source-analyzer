'use client'

import { useAuth } from '@/hooks/use-auth'
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export function AuthButtons() {
  const { isLogged, logout } = useAuth()
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-2">
        {isLogged ? (
            <Link onClick={logout} href="/auth" className="text-sm font-medium mr-2">
                {t("common.logout")}
            </Link>
            ) : (
            <Link href="/auth" className="text-sm font-medium mr-2">
                {t("common.login")}
            </Link>
        )}
    </div>
  )
}