import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import DermaAILogo from './DermaAILogo'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

function Footer() {
  const { t } = useLanguage()
  const { darkMode } = useTheme()

  const linkClass = `text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`

  return (
    <footer className={`${darkMode ? 'bg-[#0a1929]' : 'bg-white'} relative`}>
      {/* Top decorative gradient band */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <DermaAILogo size="sm" />
            </Link>
            <p className={`text-sm leading-relaxed max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('footer.product')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/#features" className={linkClass}>{t('footer.features')}</Link></li>
              <li><Link to="/#how-it-works" className={linkClass}>{t('footer.howItWorks')}</Link></li>
              <li><Link to="/research" className={linkClass}>{t('footer.research')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('footer.support')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/help" className={linkClass}>{t('footer.helpCenter')}</Link></li>
              <li><span className={`${linkClass} opacity-50 cursor-default`}>{t('footer.contactUs')}</span></li>
              <li><Link to="/privacy-policy" className={linkClass}>{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('footer.legal')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms-of-service" className={linkClass}>{t('footer.terms')}</Link></li>
              <li><Link to="/disclaimer" className={linkClass}>{t('footer.disclaimer')}</Link></li>
              <li><Link to="/privacy-data-use" className={linkClass}>{t('footer.privacyDataUse')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-12 pt-6 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              &copy; 2026 DermaAI. {t('footer.rights')}
            </p>
            <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {t('footer.builtPrefix')} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {t('footer.builtSuffix')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
