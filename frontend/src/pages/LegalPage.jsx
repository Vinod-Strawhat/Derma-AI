import { useTheme } from '../context/ThemeContext'

function LegalPage({ title, children }) {
  const { darkMode } = useTheme()

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className={`rounded-3xl border p-8 md:p-12 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h1>
          <div className={`prose max-w-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalPage
