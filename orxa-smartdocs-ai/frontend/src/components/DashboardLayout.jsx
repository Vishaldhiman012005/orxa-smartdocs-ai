import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import CircuitBackground from './CircuitBackground'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-navy-950 relative">
      <CircuitBackground />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:ml-64 relative z-10">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-white/10 bg-navy-900/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-white tracking-widest text-lg">ORXA</span>
        </div>

        <main className="p-6 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
