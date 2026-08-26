import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import DermaAILogo from './DermaAILogo'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Header({ variant = 'public' }) {
  const { t } = useLanguage()
  const { logOut } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isDashboard = variant === 'dashboard'

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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
    const base = `rounded-lg text-sm font-medium transition-all duration-200 ${
      mobile ? 'px-4 py-3 w-full text-left' : 'px-3.5 py-2'
    }`
    if (link.disabled) {
      return `${base} text-gray-300 cursor-not-allowed`
    }
    const active = isActive(link)
    return `${base} ${
      active
        ? 'text-primary-600 bg-primary-50/80 dark:text-primary-400 dark:bg-primary-900/30'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5'
    }`
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-[#07111F]/90 backdrop-blur-xl shadow-sm border-b border-white/5'
            : 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/60'
          : darkMode
            ? 'bg-[#07111F]/60 backdrop-blur-lg border-b border-transparent'
            : 'bg-white/60 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          {/* Logo */}
          <Link to={isDashboard ? '/dashboard' : '/'} className="flex-shrink-0 group">
            <DermaAILogo size="md" />
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
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/10 transition-all duration-200"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <LanguageSelector />
            {isDashboard ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200/80 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 dark:text-gray-400 dark:border-white/10 dark:hover:text-gray-100 dark:hover:bg-white/5"
                aria-label={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5"
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
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
              aria-label={t('nav.toggleMenu')}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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
              <div className="border-t border-gray-100 dark:border-white/10 mt-2 pt-2">
                <LanguageSelector />
              </div>
              {isDashboard ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200/80 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:border-white/10 dark:hover:bg-white/5"
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
                    className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200/80 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:border-white/10 dark:hover:bg-white/5"
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
