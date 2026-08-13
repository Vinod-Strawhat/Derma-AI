import { useState } from 'react'
import { User } from 'lucide-react'
import { languages } from '../data/languages'
import { useLanguage } from '../context/LanguageContext'

function PersonalInformation({ profile }) {
  const { t } = useLanguage()
  const [fullName, setFullName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [language, setLanguage] = useState(
    languages.find((lang) => lang.name === profile.preferredLanguage)?.code ?? 'en'
  )
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="card p-6 md:p-8">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{t('personal.heading')}</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('personal.fullName')}
          </label>
          <input
            id="profile-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('personal.email')}
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="profile-language" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('personal.preferredLanguage')}
          </label>
          <select
            id="profile-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button type="submit" className="btn-primary !px-6 !py-2.5 text-sm">
          {t('personal.saveChanges')}
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600 animate-fade-in">
            {t('personal.saved')}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        {t('personal.notPersisted')}
      </p>
    </form>
  )
}

export default PersonalInformation