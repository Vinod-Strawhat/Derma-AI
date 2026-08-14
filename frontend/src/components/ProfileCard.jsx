import { BadgeCheck, Mail, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ProfileCard({ profile }) {
  const { t } = useLanguage()
  const initials = profile.name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>

        <div className="text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{profile.name}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 w-fit mx-auto sm:mx-0">
              <BadgeCheck className="w-3.5 h-3.5" />
              {profile.isReal ? t('profile.realBadge') : t('profile.statusLabel')}
            </span>
          </div>

          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500 mb-1">
            <Mail className="w-4 h-4 text-gray-400" />
            {profile.email}
          </p>
          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500">
            <Globe className="w-4 h-4 text-gray-400" />
            {profile.preferredLanguage}
          </p>

          {profile.isDemo && (
            <p className="text-xs text-gray-400 mt-3">
              {t('profile.demoBadge')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard