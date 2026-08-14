import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

function Header({ variant = 'public' }) {
  const { t } = useLanguage()
  const { logOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isDashboard = variant === 'dashboard'

  function handleLogout() {
    setMobileOpen(false)
    logOut()
    navigate('/')
  }

  const PUBLIC_LINKS = [
    { to: '/', label: t('nav.home') },
    { to: '/#features', label: t('nav.features') },
    { to: '/#how-it-works', label: t('nav.howItWorks') },
  ]

  const DASHBOARD_LINKS = [
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/history', label: t('nav.history') },
    { to: '/compare', label: t('nav.compare') },
    { to: '/profile', label: t('nav.profile') },
  ]

  const navLinks = isDashboard ? DASHBOARD_LINKS : PUBLIC_LINKS

  function isActive(link) {
    if (link.disabled) return false
    const [path, hash] = link.to.split('#')
    if (location.pathname !== path) return false
    return hash ? location.hash === `#${hash}` : true
  }

  function linkClasses(link, mobile) {
    const base = `rounded-lg text-sm font-medium transition-colors duration-200 ${
      mobile ? 'px-4 py-2.5 w-full text-left' : 'px-3.5 py-2'
    }`
    if (link.disabled) {
      return `${base} text-gray-300 cursor-not-allowed`
    }
    const active = isActive(link)
    return `${base} ${
      active
        ? 'text-primary-600 bg-primary-50'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          {/* Logo */}
          <Link to={isDashboard ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <circle cx="9" cy="9" r="1" fill="currentColor" />
                <circle cx="15" cy="9" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary-600">Derma</span>
              <span className="text-gray-900">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isHashLink = link.to.startsWith('/#')
              if (isHashLink) {
                return (
                  <a
                    key={link.label}
                    href={link.to}
                    className={linkClasses(link)}
                  >
                    {link.label}
                  </a>
                )
              }
              return link.disabled ? (
                <span key={link.label} className={linkClasses(link)} title={t('nav.comingSoon')}>
                  {link.label}
                </span>
              ) : (
                <Link key={link.label} to={link.to} className={linkClasses(link)}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSelector />
            {isDashboard ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                aria-label={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm !px-5 !py-2"
                >
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={t('nav.toggleMenu')}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in-down">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => {
                const isHashLink = link.to.startsWith('/#')
                if (isHashLink) {
                  return (
                    <a
                      key={link.label}
                      href={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={linkClasses(link, true)}
                    >
                      {link.label}
                    </a>
                  )
                }
                return link.disabled ? (
                  <span key={link.label} className={linkClasses(link, true)} title={t('nav.comingSoon')}>
                    {link.label}
                  </span>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={linkClasses(link, true)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <LanguageSelector />
              </div>
              {isDashboard ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link
                    to="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {t('nav.signIn')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center btn-primary text-sm !py-2.5"
                  >
                    {t('nav.getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header