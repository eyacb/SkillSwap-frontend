import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type ProtectedRouteProps = { children: ReactNode }

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth()
  if (!auth.user) {
    return <Navigate to="/auth" replace />
  }
  return <>{children}</>
}
