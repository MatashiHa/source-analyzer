"use client"

import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileText } from "lucide-react"
import axios from "axios"


export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setError("")
    try {
      //получаем URL редиректа
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`)
        .then(response => redirect(response.data.url))
      // await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  // После возврата с провайдера обрабатываем callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    if (code) {
      // Отправляем код на бэкенд для получения токена
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/github/callback?code=${code}`)
        .then(response => {
          console.log("User data:", response.data.user);
          localStorage.setItem("token", response.data.token.access_token);
        });
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>Login to your account to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-50 hover:dark:text-black dark:bg-white/80 hover:dark:bg-white/70"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                    Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="bg-[#FFCC00] text-black hover:bg-[#FFCC00]/90 hover:dark:text-black dark:bg-[#FFCC00]/80 hover:dark:bg-[#FFCC00]/70"
                  onClick={() => handleSocialLogin("yandex")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 500 500" fill="none">
                    <path 
                      d="M278.55 309.727l-78.522 176.272h-57.23l86.249-188.49c-40.52-20.576-67.563-57.86-67.563-126.77 c-0.089-96.492 61.095-144.738 133.777-144.738h73.942v459.998h-49.504V309.727H278.55L278.55 309.727z M319.699 67.779h-26.416 c-39.891 0-78.522 26.413-78.522 102.96c0 73.94 35.398 97.748 78.522 97.748h26.416V67.779z"
                      fill="red"
                    />
                  </svg>
                  Continue with Yandex
                </Button>

                <Button
                  variant="outline"
                  className="bg-[#0077FF] text-white hover:bg-[#0077FF]/90 hover:text-white dark:bg-[#0077FF]/80 hover:dark:bg-[#0077FF]/70"
                  onClick={() => handleSocialLogin("vk")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 100 100" fill="none">
                    <g clipPath="url(#clip0_2_40)">
                      <path d="M0.5 48C0.5 25.3726 0.5 14.0589 7.52944 7.02944C14.5589 0 25.8726 0 48.5 0H52.5C75.1274 0 86.4411 0 93.4706 7.02944C100.5 14.0589 100.5 25.3726 100.5 48V52C100.5 74.6274 100.5 85.9411 93.4706 92.9706C86.4411 100 75.1274 100 52.5 100H48.5C25.8726 100 14.5589 100 7.52944 92.9706C0.5 85.9411 0.5 74.6274 0.5 52V48Z" fill="#0077FF"/>
                      <path d="M53.7085 72.042C30.9168 72.042 17.9169 56.417 17.3752 30.417H28.7919C29.1669 49.5003 37.5834 57.5836 44.25 59.2503V30.417H55.0004V46.8752C61.5837 46.1669 68.4995 38.667 70.8329 30.417H81.5832C79.7915 40.5837 72.2915 48.0836 66.9582 51.1669C72.2915 53.6669 80.8336 60.2086 84.0836 72.042H72.2499C69.7082 64.1253 63.3754 58.0003 55.0004 57.1669V72.042H53.7085Z" fill="white"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2_40">
                      <rect width="100" height="100" fill="white" transform="translate(0.5)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  
                  Continue with VK
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#24292E] text-white hover:bg-[#24292E]/90 dark:hover:bg-[#24292E]/80"
                  onClick={() => handleSocialLogin("github")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      fill="white"
                    />
                  </svg>
                  <div className="text-white">
                    Continue with GitHub
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to SourceAnalyzer's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

