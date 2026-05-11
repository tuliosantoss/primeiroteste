'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import ProtectedRoute from '@/components/ProtectedRoute'

const DashboardRedirect = () => {
  const { user, isLoggedIn } = useAuthStore()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push('/auth')
      return
    }

    // Redirecionar para o dashboard correto baseado no role
    switch (user.role) {
      case 'student':
        router.push('/dashboard/student')
        break
      case 'teacher':
        router.push('/dashboard/teacher')
        break
      case 'admin':
        router.push('/dashboard/admin')
        break
      default:
        router.push('/dashboard/student')
    }
  }, [user, isLoggedIn, router])

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-primary-300 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardRedirect

