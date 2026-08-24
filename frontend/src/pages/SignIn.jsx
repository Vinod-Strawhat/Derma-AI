import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle } from 'lucide-react'
import DermaAILogo from '../components/DermaAILogo'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { AuthError } from '../api/authApi'

function SignIn() {
  const { t } = useLanguage()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function authErrorMessage(err) {
    if (err instanceof AuthError) {
      const map = {
        'Invalid email or password.': t('auth.invalidCredentials'),
        'Email must be a valid email address.': t('auth.emailInvalid'),
      }
      return map[err.detail] ?? t('auth.loginFailed')
    }
    return t('auth.loginFailed')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await signIn({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <DermaAILogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('signin.welcome')}</h1>
          <p className="text-sm text-gray-500">{t('signin.subtitle')}</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 animate-fade-in-up">
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 p-4 flex items-start gap-3 animate-fade-in-up">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('signin.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('signin.emailPlaceholder')}
                  className="input-field !pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('signin.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('signin.passwordPlaceholder')}
                  className="input-field !pl-11 !pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? t('signin.hidePassword') : t('signin.showPassword')}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">{t('signin.rememberMe')}</span>
              </label>
              <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                {t('signin.forgotPassword')}
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="btn-primary w-full !py-3 group">
              <LogIn className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
              {t('signin.signIn')}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in-up animation-delay-200">
          {t('signin.noAccount')}{' '}
          <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            {t('signin.createOne')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
