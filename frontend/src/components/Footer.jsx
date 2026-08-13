import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <circle cx="9" cy="9" r="1" fill="currentColor" />
                  <circle cx="15" cy="9" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="text-base font-bold">
                <span className="text-primary-600">Derma</span>
                <span className="text-gray-900">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.product')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.features')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.howItWorks')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.research')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.helpCenter')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.disclaimer')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{t('footer.hipaa')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} DermaAI. {t('footer.rights')}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              {t('footer.builtPrefix')} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {t('footer.builtSuffix')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
