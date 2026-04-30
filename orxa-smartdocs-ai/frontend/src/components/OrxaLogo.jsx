export default function OrxaLogo({ size = 40, showText = true }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="orxaGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00fff5" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer hexagon ring */}
        <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" stroke="url(#orxaGrad)" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />
        {/* Inner hexagon */}
        <polygon points="40,14 62,27 62,53 40,66 18,53 18,27" stroke="url(#orxaGrad)" strokeWidth="1" fill="rgba(0,255,245,0.04)" />
        {/* Circuit nodes */}
        <circle cx="40" cy="4" r="2.5" fill="#00fff5" filter="url(#glow)" />
        <circle cx="72" cy="22" r="2.5" fill="#00fff5" filter="url(#glow)" />
        <circle cx="72" cy="58" r="2.5" fill="#00fff5" filter="url(#glow)" />
        <circle cx="40" cy="76" r="2.5" fill="#00fff5" filter="url(#glow)" />
        <circle cx="8" cy="58" r="2.5" fill="#00fff5" filter="url(#glow)" />
        <circle cx="8" cy="22" r="2.5" fill="#00fff5" filter="url(#glow)" />
        {/* O shape */}
        <path d="M28 32 Q28 24 40 24 Q52 24 52 32 L52 48 Q52 56 40 56 Q28 56 28 48 Z" stroke="url(#orxaGrad)" strokeWidth="3" fill="none" filter="url(#glow)" />
        {/* X cross */}
        <line x1="32" y1="32" x2="48" y2="48" stroke="url(#orxaGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
        <line x1="48" y1="32" x2="32" y2="48" stroke="url(#orxaGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
        {/* Center dot */}
        <circle cx="40" cy="40" r="3" fill="#00fff5" filter="url(#glow)" />
        {/* Corner circuit lines */}
        <line x1="40" y1="4" x2="40" y2="14" stroke="#00fff5" strokeWidth="1" opacity="0.6" />
        <line x1="72" y1="22" x2="62" y2="27" stroke="#00fff5" strokeWidth="1" opacity="0.6" />
        <line x1="72" y1="58" x2="62" y2="53" stroke="#00fff5" strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="76" x2="40" y2="66" stroke="#00fff5" strokeWidth="1" opacity="0.6" />
        <line x1="8" y1="58" x2="18" y2="53" stroke="#00fff5" strokeWidth="1" opacity="0.6" />
        <line x1="8" y1="22" x2="18" y2="27" stroke="#00fff5" strokeWidth="1" opacity="0.6" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold tracking-[0.2em] text-white" style={{ fontSize: size * 0.45 }}>ORXA</span>
          <span className="font-mono text-cyan-400 tracking-widest uppercase" style={{ fontSize: size * 0.18 }}>SmartDocs AI</span>
        </div>
      )}
    </div>
  )
}
