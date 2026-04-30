import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bot, FileText, Merge, Scissors, Zap, Shield, ChevronRight, Star } from 'lucide-react'
import OrxaLogo from '../components/OrxaLogo'
import CircuitBackground from '../components/CircuitBackground'

const FEATURES = [
  { icon: Bot, title: 'AI PDF Assistant', desc: 'Ask questions, summarize, extract notes and translate documents using advanced AI.' },
  { icon: FileText, title: 'Create PDFs', desc: 'Design professional PDFs with custom fonts, layouts, images and live preview.' },
  { icon: Merge, title: 'Merge & Split', desc: 'Combine multiple PDFs or split pages with precision — in seconds.' },
  { icon: Scissors, title: 'Compress PDFs', desc: 'Reduce file size dramatically without losing quality.' },
  { icon: Zap, title: 'Convert Files', desc: 'PDF ↔ Images, Word to PDF — all format conversions in one place.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Files are processed securely and never shared with third parties.' },
]

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-950 relative overflow-hidden">
      <CircuitBackground />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/8">
        <OrxaLogo size={38} showText={true} />
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-outline text-sm py-2 px-4 hidden sm:inline-flex">Sign In</Link>
          <Link to="/register" className="btn-cyan text-sm py-2 px-5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div
          initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono mb-8"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          AI-Powered Document Intelligence
        </motion.div>

        <motion.h1
          initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight max-w-4xl"
        >
          Smarter Documents.<br />
          <span className="neon-text">Powered by AI.</span>
        </motion.h1>

        <motion.p
          initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-white/60 text-lg max-w-2xl leading-relaxed"
        >
          Orxa SmartDocs AI combines professional PDF tools with cutting-edge artificial intelligence.
          Create, analyze, translate, and manage documents — all in one platform.
        </motion.p>

        <motion.div
          initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link to="/register" className="btn-cyan text-base py-3.5 px-8 flex items-center gap-2">
            Start Free <ChevronRight size={18} />
          </Link>
          <Link to="/login" className="btn-outline text-base py-3.5 px-8">Sign In</Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center"
        >
          {[['10+ Tools', 'PDF & AI combined'], ['100% Secure', 'End-to-end private'], ['Free to Start', 'No credit card']].map(([val, label]) => (
            <div key={val}>
              <p className="font-display font-bold text-2xl text-cyan-400">{val}</p>
              <p className="text-white/40 text-sm mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-12 pb-24">
        <motion.h2
          initial="hidden" whileInView="show" variants={fade} viewport={{ once: true }}
          className="text-center font-display font-bold text-3xl text-white mb-12"
        >
          Everything You Need
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial="hidden" whileInView="show" variants={fade} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-4">
                <Icon size={22} className="text-cyan-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial="hidden" whileInView="show" variants={fade} viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-card p-12 text-center"
          style={{ boxShadow: '0 0 60px rgba(0,255,245,0.08)' }}
        >
          <Star className="text-cyan-400 mx-auto mb-4" size={32} />
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to get started?</h2>
          <p className="text-white/50 mb-8">Create your free account and access all PDF tools and AI features instantly.</p>
          <Link to="/register" className="btn-cyan text-base py-3.5 px-10 inline-flex items-center gap-2">
            Create Free Account <ChevronRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-8 text-center text-white/30 text-sm font-mono">
        © 2025 Orxa SmartDocs AI · Built with intelligence
      </footer>
    </div>
  )
}
