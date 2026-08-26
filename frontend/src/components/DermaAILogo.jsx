import { useTheme } from '../context/ThemeContext'

function DermaAILogo({ size = 'md', className = '' }) {
  const { darkMode } = useTheme()

  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'w-9 h-9', text: 'text-lg' },
    lg: { container: 'w-12 h-12', text: 'text-xl' },
  }

  const s = sizes[size] || sizes.md

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.container} rounded-xl overflow-hidden flex items-center justify-center`}>
        <img
          src="/derma-ai-icon.png"
          alt="DermaAI"
          className="w-full h-full object-cover"
        />
      </div>

      <span className={`${s.text} font-bold tracking-tight`}>
        <span className="text-primary-600 dark:text-primary-400">Derma</span>
        <span className={darkMode ? 'text-white' : 'text-gray-900'}>AI</span>
      </span>
    </div>
  )
}

export default DermaAILogo