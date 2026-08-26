import { CheckCircle2, ShieldAlert, Stethoscope } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function GuidanceCard({ dos, avoid, donts, whenToSeekCare, source }) {
  const { t } = useLanguage()
  const dontsList = donts ?? avoid

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('guidance.dosTitle')}</h3>
          </div>
          <ul className="space-y-2.5">
            {dos.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('guidance.avoidTitle')}</h3>
          </div>
          <ul className="space-y-2.5">
            {dontsList.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {whenToSeekCare && whenToSeekCare.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-medical-50 dark:bg-medical-500/10 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-medical-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('guidance.whenToSeekTitle')}</h3>
          </div>
          <ul className="space-y-2.5">
            {whenToSeekCare.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-medical-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {source && source.url && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
          {t('results.learnMore')}:{' '}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            {source.name}
          </a>
        </p>
      )}
    </div>
  )
}

export default GuidanceCard
