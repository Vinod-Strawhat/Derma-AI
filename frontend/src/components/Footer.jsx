import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import DermaAILogo from './DermaAILogo'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

function Footer() {
  const { t } = useLanguage()
  const { darkMode } = useTheme()

  return (
    <footer className={`${darkMode ? 'bg-[#0a1929] border-white/5' : 'bg-gray-50/80 border-gray-100'} border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <DermaAILogo size="sm" />
            </Link>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('footer.product')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.features')}</Link></li>
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.howItWorks')}</Link></li>
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.research')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.helpCenter')}</Link></li>
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.contactUs')}</Link></li>
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.terms')}</Link></li>
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.disclaimer')}</Link></li>
              <li><Link to="/" className={`text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>{t('footer.hipaa')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-10 pt-6 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              &copy; {new Date().getFullYear()} DermaAI. {t('footer.rights')}
            </p>
            <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {t('footer.builtPrefix')} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {t('footer.builtSuffix')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
