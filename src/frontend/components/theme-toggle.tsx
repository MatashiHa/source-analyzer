"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  // Only show the toggle after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="min-w-[100px]">
        <span>{t("common.theme")}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="min-w-[100px] gap-2"
    >
      {resolvedTheme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          <span>{t("common.light")}</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span>{t("common.dark")}</span>
        </>
      )}
    </Button>
  )
}

