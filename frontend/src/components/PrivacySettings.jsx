import { useState } from 'react'
import { Cpu, Info, Lock, MapPin, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function PrivacySettings() {
  const { t } = useLanguage()

  const settings = [
    { key: 'ai', icon: Cpu, title: t('privacy.aiHeading'), description: t('privacy.aiDesc'), toggled: false, demo: true },
    { key: 'medical', icon: ShieldCheck, title: t('privacy.medicalHeading'), description: t('privacy.medicalDesc'), toggled: false, demo: false },
    { key: 'image', icon: Lock, title: t('privacy.imageHeading'), description: t('privacy.imageDesc'), toggled: false, demo: true },
    { key: 'location', icon: MapPin, title: t('privacy.locationHeading'), description: t('privacy.locationDesc'), toggled: false, demo: false },
  ]

  const [states, setStates] = useState(
    settings.reduce((acc, s) => {
      acc[s.key] = s.toggled
      return acc
    }, {})
  )

  function handleToggle(key) {
    setStates((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4">
      {settings.map((item) => {
        const ItemIcon = item.icon
        const enabled = states[item.key]

        return (
          <div key={item.key} className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <ItemIcon className="w-5 h-5 text-primary-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                {!item.demo && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    <Info className="w-3 h-3" />
                    {t('privacy.informational')}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.description}</p>
            </div>

            <button
              onClick={() => handleToggle(item.key)}
              role="switch"
              aria-checked={enabled}
              aria-label={t('privacy.toggle', { title: item.title })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 mt-1 ${
                enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  enabled ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )
      })}

      <p className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
        {t('privacy.note')}
      </p>
    </div>
  )
}

export default PrivacySettings
