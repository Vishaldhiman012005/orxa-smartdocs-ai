import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FilePlus, Wrench, Bot, History,
  CreditCard, Settings, LogOut, X, ChevronRight
} from 'lucide-react'
import OrxaLogo from './OrxaLogo'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/create-pdf', icon: FilePlus, label: 'Create PDF' },
  { to: '/pdf-tools', icon: Wrench, label: 'PDF Tools' },
  { to: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/history', icon: History, label: 'File History' },
  { to: '/pricing', icon: CreditCard, label: 'Pricing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <OrxaLogo size={36} showText={true} />
        <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold font-display text-navy-950">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
              user?.plan === 'premium'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {user?.plan?.toUpperCase() || 'FREE'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={18} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10 font-medium text-sm font-display tracking-wide">{label}</span>
                {isActive && <ChevronRight size={14} className="relative z-10 ml-auto text-cyan-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium font-display">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-navy-900/80 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="fixed left-0 top-0 h-screen w-64 bg-navy-900/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
