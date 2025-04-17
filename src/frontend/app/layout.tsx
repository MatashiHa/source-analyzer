import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import Link from "next/link"
import { FileText } from "lucide-react"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "SourceAnalyzer",
  description: "Source analysis and monitoring system",
    generator: 'v0.dev'
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
          <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-8">
                  <div className="mr-4 flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <Link href="/" className="text-xl font-bold">
                      SourceAnalyzer
                    </Link>
                  </div>
                  <div className="flex flex-1 items-center justify-end space-x-2">
                    <div className="flex items-center gap-2">
                      <AuthButtons />
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
import { AuthButtons } from "@/components/auth-buttons"
import axios from "axios"

