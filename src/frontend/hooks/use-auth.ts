'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'

export function useAuth() {
  const [isLogged, setIsLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Функция проверки авторизации
  const checkAuth = useCallback(async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
        withCredentials: true
      }).then(response => setIsLogged(true))
    } catch {
      setIsLogged(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Функция выхода
  const logout = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, 
        {}, 
        { withCredentials: true }
      )
      setIsLogged(false)
      router.push(response.data.redirect_url || '/auth')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error // Можно обработать ошибку в компоненте
    }
  }, [router])

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    isLogged,
    isLoading,
    logout,
    checkAuth // На случай ручной повторной проверки
  }
}