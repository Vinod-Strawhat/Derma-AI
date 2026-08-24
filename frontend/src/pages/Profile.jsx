import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Camera, ShieldCheck, User } from 'lucide-react'
import ProfileCard from '../components/ProfileCard'
import ProfileStats from '../components/ProfileStats'
import PersonalInformation from '../components/PersonalInformation'
import PrivacySettings from '../components/PrivacySettings'
import AccountActions from '../components/AccountActions'
import { mockProfile } from '../data/mockProfile'
import { languages } from '../data/languages'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { API_MODE } from '../api/predictApi'
import { fetchMyScans } from '../api/scansApi'

function languageName(code) {
  return languages.find((lang) => lang.code === code)?.name ?? code
}

function Profile() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [scans, setScans] = useState([])
  const [statsReady, setStatsReady] = useState(false)

  useEffect(() => {
    if (isAuthenticated && API_MODE) {
      fetchMyScans()
        .then(setScans)
        .catch(() => setScans([]))
        .finally(() => setStatsReady(true))
    } else {
      setStatsReady(true)
    }
  }, [isAuthenticated])

  const profile = isAuthenticated
    ? {
        isDemo: false,
        isReal: true,
        isNewUser: scans.length === 0,
        name: user.name,
        email: user.email,
        preferredLanguage: languageName(user.preferredLanguage),
        stats: {
          totalScans: scans.length,
          concernsTracked: 0,
          lastScan: scans.length
            ? new Date(scans[0].createdAt).toLocaleDateString()
            : null,
          comparisons: 0,
        },
      }
    : mockProfile

  const isNewUser = profile.isNewUser
  const hasAnyActivity = profile.stats.totalScans > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        {/* Page header */}
        <section className="animate-fade-in-down">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium text-primary-700">
              {t(isAuthenticated ? 'profile.realBadge' : 'profile.demoBadge')}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {t('profile.heading')}
          </h1>
          <p className="text-base md:text-lg text-gray-500">
            {t('profile.subtext')}
          </p>
        </section>

        {/* Profile card */}
        <section className="animate-fade-in-up animation-delay-200">
          <ProfileCard profile={profile} />
        </section>

        {/* New user CTA */}
        {isNewUser && (
          <section className="animate-fade-in-up animation-delay-300">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50 border border-primary-100/60 p-8 text-center">
              <div className="absolute inset-0 pattern-dots opacity-30" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-7 h-7 text-primary-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {t('profile.newUserCta')}
                </h2>
                <button
                  onClick={() => navigate('/skin-check')}
                  className="btn-primary !px-8 !py-3.5 text-base mt-4 shadow-medical"
                >
                  {t('profile.startSkinCheck')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Personal information */}
        <section className="animate-fade-in-up animation-delay-300">
          <PersonalInformation profile={profile} />
        </section>

        {/* Scan statistics */}
        <section className="animate-fade-in-up animation-delay-400">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t('profile.activity')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('profile.activitySubtext')}</p>
            </div>
            {!isAuthenticated && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 flex-shrink-0">
                {t('profile.demoData')}
              </span>
            )}
          </div>

          {statsReady && <ProfileStats stats={profile.stats} isNewUser={isNewUser} />}

          {!hasAnyActivity && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 mt-4">
              {t('profile.newUserNoScans')}
            </p>
          )}
        </section>

        {/* Privacy & Safety */}
        <section className="animate-fade-in-up animation-delay-500">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t('profile.privacyHeading')}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('profile.privacySubtext')}
            </p>
          </div>
          <PrivacySettings />
        </section>

        {/* Account actions */}
        <section className="animate-fade-in-up animation-delay-600">
          <AccountActions />
        </section>

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {t('profile.disclaimer')}
          </p>
        </section>
      </div>
    </div>
  )
}

export default Profile
