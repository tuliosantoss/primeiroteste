'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    if (!isClient) return

    // Se não está logado, redireciona para login
    if (!isLoggedIn || !user) {
      router.push('/auth')
      return
    }

    // Se há role específica requerida, verifica permissão
    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (!allowedRoles.includes(user.role)) {
        router.push('/dashboard')
        return
      }
    }
  }, [isClient, isLoggedIn, user, requiredRole, router])

  if (!isClient || !isLoggedIn || !user) {
    return null
  }

  // Verificar role
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!allowedRoles.includes(user.role)) {
      return null
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
