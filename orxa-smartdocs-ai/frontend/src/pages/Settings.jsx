import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Shield, Bell, Loader, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/api/settings', { name })
      await refreshUser()
      setSaved(true)
      toast.success('Settings saved!')
      setTimeout(() => setSaved(false), 2500)
    } catch {
      toast.error('Failed to save settings')
    } finally { setLoading(false) }
  }

  const INFO_ROWS = [
    { label: 'Email', value: user?.email },
    { label: 'Account Plan', value: (user?.plan || 'free').toUpperCase() },
    { label: 'Files Processed', value: user?.files_processed ?? 0 },
    { label: 'AI Queries Used', value: user?.ai_usage_count ?? 0 },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Settings className="text-cyan-400" size={26} />
          <h1 className="page-title">Settings</h1>
        </div>
        <p className="text-white/40 text-sm">Manage your account preferences.</p>
      </motion.div>

      {/* Profile settings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-cyan-400" />
          <h2 className="section-title">Profile</h2>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold font-display text-navy-950 text-2xl">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-white/40 text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Display Name</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <button type="submit" disabled={loading} className="btn-cyan flex items-center gap-2">
            {loading ? <Loader size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Account info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-cyan-400" />
          <h2 className="section-title">Account Information</h2>
        </div>
        <div className="space-y-3">
          {INFO_ROWS.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-white/8 last:border-0">
              <span className="text-white/50 text-sm">{label}</span>
              <span className="text-white font-mono text-sm">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-cyan-400" />
          <h2 className="section-title">App Info</h2>
        </div>
        <div className="space-y-3 text-sm">
          {[
            ['Version', 'Orxa SmartDocs AI v1.0'],
            ['AI Engine', 'Claude (Anthropic)'],
            ['PDF Engine', 'PyMuPDF + ReportLab'],
            ['Backend', 'Flask + SQLite'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-white/8 last:border-0">
              <span className="text-white/40">{k}</span>
              <span className="text-cyan-400 font-mono text-xs">{v}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-6 border border-red-500/15">
        <h2 className="font-display font-bold text-red-400 mb-3">Danger Zone</h2>
        <p className="text-white/40 text-sm mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        <button
          onClick={() => toast.error('Please contact support to delete your account.')}
          className="border border-red-500/30 text-red-400 hover:bg-red-500/10 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          Delete Account
        </button>
      </motion.div>
    </div>
  )
}
