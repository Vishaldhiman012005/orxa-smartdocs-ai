import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatePDF from './pages/CreatePDF'
import PDFTools from './pages/PDFTools'
import AIAssistant from './pages/AIAssistant'
import FileHistory from './pages/FileHistory'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#071029',
              color: '#e2e8f0',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '12px',
              fontFamily: "'Exo 2', sans-serif",
            },
            success: { iconTheme: { primary: '#22d3ee', secondary: '#020817' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#020817' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-pdf" element={<CreatePDF />} />
            <Route path="/pdf-tools" element={<PDFTools />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/history" element={<FileHistory />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
