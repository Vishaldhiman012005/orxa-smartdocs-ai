import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orxa_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('orxa_token')
      localStorage.removeItem('orxa_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
