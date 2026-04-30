import { motion } from 'framer-motion'
import { Check, Zap, Crown, X } from 'lucide-react'

const PLANS = [
  {
    name: 'Free', price: '₹0', period: 'forever',
    icon: Zap, color: 'text-cyan-400', border: 'border-white/15',
    badge: null,
    features: [
      { text: 'Create PDFs (up to 5MB)', ok: true },
      { text: 'PDF Merge & Split', ok: true },
      { text: 'PDF Compression', ok: true },
      { text: 'PDF ↔ Image conversion', ok: true },
      { text: '5 AI queries/month', ok: true },
      { text: 'File history (7 days)', ok: true },
      { text: 'Unlimited AI queries', ok: false },
      { text: 'Files up to 50MB', ok: false },
      { text: 'Priority processing', ok: false },
      { text: 'Advanced PDF layouts', ok: false },
    ],
    cta: 'Current Plan', ctaClass: 'btn-outline w-full',
  },
  {
    name: 'Premium', price: '₹299', period: '/month',
    icon: Crown, color: 'text-amber-400', border: 'border-amber-500/40',
    badge: 'Most Popular',
    features: [
      { text: 'Create PDFs (up to 50MB)', ok: true },
      { text: 'PDF Merge & Split', ok: true },
      { text: 'PDF Compression', ok: true },
      { text: 'PDF ↔ Image conversion', ok: true },
      { text: 'Unlimited AI queries', ok: true },
      { text: 'File history (90 days)', ok: true },
      { text: 'Priority processing', ok: true },
      { text: 'Advanced PDF layouts', ok: true },
      { text: 'Word to PDF conversion', ok: true },
      { text: 'API access (coming soon)', ok: true },
    ],
    cta: 'Upgrade Now', ctaClass: 'btn-cyan w-full',
  },
]

export default function Pricing() {
  return (
    <div className="max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="page-title mb-2">Simple, Honest Pricing</h1>
        <p className="text-white/40">Start free. Upgrade when you need more power.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {PLANS.map(({ name, price, period, icon: Icon, color, border, badge, features, cta, ctaClass }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-7 border ${border} relative ${badge ? 'ring-1 ring-amber-500/30' : ''}`}
            style={badge ? { boxShadow: '0 0 40px rgba(245,158,11,0.08)' } : {}}
          >
            {badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-navy-950 text-xs font-bold rounded-full font-display">
                {badge}
              </div>
            )}

            <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 ${color}`}>
              <Icon size={22} />
            </div>

            <h2 className="font-display font-bold text-2xl text-white">{name}</h2>
            <div className="flex items-end gap-1 mt-2 mb-6">
              <span className={`font-display font-bold text-4xl ${color}`}>{price}</span>
              <span className="text-white/30 text-sm mb-1">{period}</span>
            </div>

            <ul className="space-y-3 mb-7">
              {features.map(({ text, ok }) => (
                <li key={text} className={`flex items-center gap-3 text-sm ${ok ? 'text-white/70' : 'text-white/25'}`}>
                  {ok
                    ? <Check size={15} className={`${color} flex-shrink-0`} />
                    : <X size={15} className="text-white/20 flex-shrink-0" />
                  }
                  {text}
                </li>
              ))}
            </ul>

            <button className={ctaClass} disabled={name === 'Free'}>
              {cta}
            </button>
            {name === 'Premium' && (
              <p className="text-center text-white/25 text-xs mt-3 font-mono">Payment integration coming soon</p>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass-card p-6 text-center">
        <p className="text-white/50 text-sm">🔒 All plans include secure file handling, no ads, and full data privacy.</p>
        <p className="text-white/25 text-xs mt-2 font-mono">Your files are never stored permanently and are deleted after processing.</p>
      </motion.div>
    </div>
  )
}
