"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, FileText } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would initiate OAuth flow with the provider
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/")
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
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
                    className="bg-white text-black hover:bg-gray-50"
                    onClick={() => handleSocialLogin("Google")}
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
                    className="bg-[#FFCC00] text-black hover:bg-[#FFCC00]/90"
                    onClick={() => handleSocialLogin("Yandex")}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12Z"
                        fill="#FC3F1D"
                      />
                      <path d="M13.155 6.947H11.31V17.052H13.155V6.947Z" fill="white" />
                    </svg>
                    Continue with Yandex
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-[#0077FF] text-white hover:bg-[#0077FF]/90"
                    onClick={() => handleSocialLogin("VK")}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21.5793 15.2071C21.5793 15.2071 23.3193 16.9271 23.7593 17.7671C23.7719 17.7864 23.7793 17.8084 23.7809 17.8312C23.9409 18.1971 23.9909 18.4871 23.8909 18.7071C23.7209 19.0871 23.1109 19.2571 22.9309 19.2671H19.5009C19.2709 19.2671 18.7793 19.1971 18.1709 18.7771C17.6993 18.4471 17.2309 17.9071 16.7793 17.3771C16.0909 16.5671 15.5093 15.8971 14.9209 15.8971C14.8192 15.8966 14.7183 15.9147 14.6227 15.9505C14.1909 16.0971 13.6393 16.7171 13.6393 18.3371C13.6393 18.8171 13.2693 19.2671 12.7209 19.2671H11.2409C10.7309 19.2671 8.1709 19.0971 5.8709 16.6671C3.0509 13.6971 0.470902 7.5271 0.430902 7.4271C0.250902 6.9971 0.650902 6.7671 1.0809 6.7671H4.5409C4.9709 6.7671 5.1309 7.0271 5.2409 7.2671C5.3709 7.5471 5.7709 8.5571 6.3909 9.6971C7.4109 11.6071 8.0509 12.3971 8.5709 12.3971C8.7209 12.3958 8.8663 12.3485 8.9909 12.2601C9.6509 11.8771 9.5109 9.3371 9.4709 8.7671C9.4709 8.6171 9.4709 7.1171 8.8709 6.5371C8.4309 6.1171 7.7409 5.9871 7.3509 5.9371C7.4444 5.8221 7.5608 5.7292 7.6909 5.6571C8.1609 5.3971 8.9609 5.3571 9.7509 5.3571H10.3509C11.2009 5.3671 11.4509 5.4271 11.7909 5.5071C12.4709 5.6571 12.4909 6.3471 12.4309 8.0471C12.4109 8.5671 12.3909 9.1571 12.3909 9.8571C12.3909 10.0071 12.3809 10.1771 12.3809 10.3471C12.3609 11.1171 12.3309 11.9971 12.8309 12.2871C12.9353 12.3518 13.0563 12.3842 13.1793 12.3801C13.4793 12.3801 14.1093 12.3801 15.5693 9.7371C16.1893 8.5971 16.6793 7.2971 16.7193 7.1771C16.7593 7.0971 16.8593 6.9171 16.9793 6.8371C17.0609 6.7932 17.1529 6.7694 17.2459 6.7671H21.2459C21.7359 6.7671 22.0559 6.8371 22.1159 7.0171C22.2159 7.2971 22.1159 8.0471 20.5309 10.2171C20.2509 10.5971 19.9993 10.9271 19.7793 11.2171C18.3293 13.1171 18.3293 13.2171 19.8509 14.6371L19.8593 14.6471L19.8693 14.6571C20.3793 15.1171 20.9793 15.6571 21.5793 15.2071Z"
                        fill="white"
                      />
                    </svg>
                    Continue with VK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Sign up with your preferred provider</CardDescription>
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
                    className="bg-white hover:bg-gray-50"
                    onClick={() => handleSocialLogin("Google")}
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
                    Sign up with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-[#FFCC00] text-black hover:bg-[#FFCC00]/90"
                    onClick={() => handleSocialLogin("Yandex")}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12Z"
                        fill="#FC3F1D"
                      />
                      <path d="M13.155 6.947H11.31V17.052H13.155V6.947Z" fill="white" />
                    </svg>
                    Sign up with Yandex
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-[#0077FF] text-white hover:bg-[#0077FF]/90"
                    onClick={() => handleSocialLogin("VK")}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21.5793 15.2071C21.5793 15.2071 23.3193 16.9271 23.7593 17.7671C23.7719 17.7864 23.7793 17.8084 23.7809 17.8312C23.9409 18.1971 23.9909 18.4871 23.8909 18.7071C23.7209 19.0871 23.1109 19.2571 22.9309 19.2671H19.5009C19.2709 19.2671 18.7793 19.1971 18.1709 18.7771C17.6993 18.4471 17.2309 17.9071 16.7793 17.3771C16.0909 16.5671 15.5093 15.8971 14.9209 15.8971C14.8192 15.8966 14.7183 15.9147 14.6227 15.9505C14.1909 16.0971 13.6393 16.7171 13.6393 18.3371C13.6393 18.8171 13.2693 19.2671 12.7209 19.2671H11.2409C10.7309 19.2671 8.1709 19.0971 5.8709 16.6671C3.0509 13.6971 0.470902 7.5271 0.430902 7.4271C0.250902 6.9971 0.650902 6.7671 1.0809 6.7671H4.5409C4.9709 6.7671 5.1309 7.0271 5.2409 7.2671C5.3709 7.5471 5.7709 8.5571 6.3909 9.6971C7.4109 11.6071 8.0509 12.3971 8.5709 12.3971C8.7209 12.3958 8.8663 12.3485 8.9909 12.2601C9.6509 11.8771 9.5109 9.3371 9.4709 8.7671C9.4709 8.6171 9.4709 7.1171 8.8709 6.5371C8.4309 6.1171 7.7409 5.9871 7.3509 5.9371C7.4444 5.8221 7.5608 5.7292 7.6909 5.6571C8.1609 5.3971 8.9609 5.3571 9.7509 5.3571H10.3509C11.2009 5.3671 11.4509 5.4271 11.7909 5.5071C12.4709 5.6571 12.4909 6.3471 12.4309 8.0471C12.4109 8.5671 12.3909 9.1571 12.3909 9.8571C12.3909 10.0071 12.3809 10.1771 12.3809 10.3471C12.3609 11.1171 12.3309 11.9971 12.8309 12.2871C12.9353 12.3518 13.0563 12.3842 13.1793 12.3801C13.4793 12.3801 14.1093 12.3801 15.5693 9.7371C16.1893 8.5971 16.6793 7.2971 16.7193 7.1771C16.7593 7.0971 16.8593 6.9171 16.9793 6.8371C17.0609 6.7932 17.1529 6.7694 17.2459 6.7671H21.2459C21.7359 6.7671 22.0559 6.8371 22.1159 7.0171C22.2159 7.2971 22.1159 8.0471 20.5309 10.2171C20.2509 10.5971 19.9993 10.9271 19.7793 11.2171C18.3293 13.1171 18.3293 13.2171 19.8509 14.6371L19.8593 14.6471L19.8693 14.6571C20.3793 15.1171 20.9793 15.6571 21.5793 15.2071Z"
                        fill="white"
                      />
                    </svg>
                    Sign up with VK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to SourceAnalyzer's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

