import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Bot, Download, Clock, FilePlus, Wrench, ChevronRight, Sparkles } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const TOOLS = [
  { to: '/create-pdf', icon: FilePlus, label: 'Create PDF', desc: 'Design custom PDFs' },
  { to: '/pdf-tools', icon: Wrench, label: 'PDF Tools', desc: 'Merge, split, compress' },
  { to: '/ai-assistant', icon: Bot, label: 'AI Assistant', desc: 'Chat with your PDFs' },
  { to: '/history', icon: Clock, label: 'File History', desc: 'View past files' },
]

const OPERATIONS = {
  create_pdf: 'Created PDF',
  merge_pdf: 'Merged PDFs',
  split_pdf: 'Split PDF',
  compress_pdf: 'Compressed PDF',
  pdf_to_images: 'PDF → Images',
  images_to_pdf: 'Images → PDF',
  word_to_pdf: 'Word → PDF',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/dashboard-stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const fade = (d = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.4 }
  })

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <motion.div {...fade(0)}>
        <h1 className="page-title">
          Welcome back, <span className="neon-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-white/40 mt-1">Here's your document activity at a glance.</p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.1)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Files Processed', val: stats?.files_processed ?? 0, color: 'text-cyan-400' },
          { icon: Bot, label: 'AI Queries Used', val: stats?.ai_usage_count ?? 0, color: 'text-purple-400' },
          { icon: Download, label: 'Downloads', val: stats?.files_processed ?? 0, color: 'text-green-400' },
          { icon: Sparkles, label: 'Current Plan', val: (stats?.plan || 'free').toUpperCase(), color: 'text-amber-400' },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="glass-card p-5">
            <div className={`${color} mb-3`}><Icon size={22} /></div>
            <p className={`font-display font-bold text-2xl ${color}`}>{val}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick access tools */}
      <motion.div {...fade(0.2)}>
        <h2 className="section-title mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOOLS.map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} className="glass-card-hover p-5 flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center group-hover:bg-cyan-500/25 transition-colors">
                <Icon size={22} className="text-cyan-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent files */}
      <motion.div {...fade(0.3)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Files</h2>
          <Link to="/history" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="glass-card overflow-hidden">
          {stats?.recent_files?.length > 0 ? (
            <div className="divide-y divide-white/8">
              {stats.recent_files.map((f) => (
                <div key={f.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{f.original_name || f.filename}</p>
                    <p className="text-xs text-white/40">{OPERATIONS[f.operation] || f.operation}</p>
                  </div>
                  <span className="text-xs text-white/30 font-mono">
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-white/30">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No files yet. Start by creating or uploading a PDF.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Plan banner */}
      {stats?.plan === 'free' && (
        <motion.div {...fade(0.4)}>
          <div className="glass-card p-6 border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(0,0,0,0))' }}>
            <div>
              <p className="font-display font-bold text-white">Upgrade to Premium</p>
              <p className="text-white/40 text-sm mt-1">Unlock unlimited AI queries, larger file sizes, and advanced PDF creation.</p>
            </div>
            <Link to="/pricing" className="btn-cyan whitespace-nowrap text-sm py-2.5 px-6 flex-shrink-0">View Plans</Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
