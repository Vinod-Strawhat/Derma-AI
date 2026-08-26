import { useTheme } from '../context/ThemeContext'

function DermaAILogo({ size = 'md', className = '' }) {
  const { darkMode } = useTheme()

  const sizes = {
    sm: { container: 'w-8 h-8', icon: 20, text: 'text-sm' },
    md: { container: 'w-9 h-9', icon: 22, text: 'text-lg' },
    lg: { container: 'w-12 h-12', icon: 28, text: 'text-xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.container} rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center shadow-md relative overflow-hidden`}>
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <svg viewBox="0 0 28 28" className={`${s.icon} text-white relative z-10`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer scan ring */}
          <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
          {/* Skin contour layers */}
          <path d="M7 14c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M9 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          {/* AI analysis crosshair */}
          <line x1="14" y1="4" x2="14" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="14" y1="20" x2="14" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="4" y1="14" x2="8" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="20" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          {/* Detection focal point */}
          <circle cx="14" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
          <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity="0.9" />
          {/* Detection markers */}
          <rect x="8" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
          <rect x="16" y="16" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
          {/* Neural connection dots */}
          <circle cx="10" cy="10" r="0.8" fill="currentColor" opacity="0.6" />
          <circle cx="18" cy="10" r="0.8" fill="currentColor" opacity="0.6" />
          <circle cx="10" cy="18" r="0.8" fill="currentColor" opacity="0.6" />
          <circle cx="18" cy="18" r="0.8" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      <span className={`${s.text} font-bold tracking-tight`}>
        <span className="text-primary-600 dark:text-primary-400">Derma</span>
        <span className={darkMode ? 'text-white' : 'text-gray-900'}>AI</span>
      </span>
    </div>
  )
}

export default DermaAILogo
