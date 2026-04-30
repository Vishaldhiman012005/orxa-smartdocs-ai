export default function CircuitBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 circuit-pattern opacity-60" />

      {/* Glowing orbs */}
      <div className="orb w-96 h-96 bg-cyan-500/10 top-[-8rem] left-[-8rem]" />
      <div className="orb w-80 h-80 bg-blue-600/8 bottom-[-6rem] right-[-6rem]" />
      <div className="orb w-64 h-64 bg-cyan-400/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* SVG circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00fff5" stopOpacity="0" />
            <stop offset="50%" stopColor="#00fff5" stopOpacity="1" />
            <stop offset="100%" stopColor="#00fff5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Horizontal lines */}
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#lineGrad)" strokeWidth="1" />
        <line x1="0" y1="45%" x2="60%" y2="45%" stroke="url(#lineGrad)" strokeWidth="1" />
        <line x1="40%" y1="70%" x2="100%" y2="70%" stroke="url(#lineGrad)" strokeWidth="1" />
        {/* Vertical lines */}
        <line x1="15%" y1="0" x2="15%" y2="100%" stroke="url(#lineGrad)" strokeWidth="1" />
        <line x1="60%" y1="0" x2="60%" y2="60%" stroke="url(#lineGrad)" strokeWidth="1" />
        <line x1="85%" y1="30%" x2="85%" y2="100%" stroke="url(#lineGrad)" strokeWidth="1" />
        {/* Junction dots */}
        <circle cx="15%" cy="20%" r="3" fill="#00fff5" opacity="0.8" />
        <circle cx="60%" cy="45%" r="3" fill="#00fff5" opacity="0.8" />
        <circle cx="85%" cy="70%" r="3" fill="#00fff5" opacity="0.8" />
        <circle cx="15%" cy="70%" r="2" fill="#00fff5" opacity="0.5" />
        <circle cx="60%" cy="20%" r="2" fill="#00fff5" opacity="0.5" />
      </svg>

      {/* Corner decorations */}
      <svg className="absolute top-4 left-4 w-24 h-24 opacity-20" viewBox="0 0 96 96" fill="none">
        <path d="M0 48 L48 0" stroke="#00fff5" strokeWidth="1" />
        <path d="M0 96 L96 0" stroke="#00fff5" strokeWidth="0.5" />
        <circle cx="48" cy="0" r="3" fill="#00fff5" />
        <circle cx="0" cy="48" r="3" fill="#00fff5" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-24 h-24 opacity-20" viewBox="0 0 96 96" fill="none">
        <path d="M96 48 L48 96" stroke="#00fff5" strokeWidth="1" />
        <path d="M96 0 L0 96" stroke="#00fff5" strokeWidth="0.5" />
        <circle cx="48" cy="96" r="3" fill="#00fff5" />
        <circle cx="96" cy="48" r="3" fill="#00fff5" />
      </svg>
    </div>
  )
}
