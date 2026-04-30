import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const token = localStorage.getItem('orxa_token')
  if (!token || !user) return <Navigate to="/login" replace />
  return children
}
