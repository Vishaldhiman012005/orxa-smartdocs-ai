import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orxa_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    const res = await api.post('/api/login', { email, password })
    localStorage.setItem('orxa_token', res.data.token)
    localStorage.setItem('orxa_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/api/register', { name, email, password })
    localStorage.setItem('orxa_token', res.data.token)
    localStorage.setItem('orxa_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    try { await api.post('/api/logout') } catch {}
    localStorage.removeItem('orxa_token')
    localStorage.removeItem('orxa_user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/api/me')
      setUser(res.data)
      localStorage.setItem('orxa_user', JSON.stringify(res.data))
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
