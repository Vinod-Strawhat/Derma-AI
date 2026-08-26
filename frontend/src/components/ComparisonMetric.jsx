import { useLanguage } from '../context/LanguageContext'

function ComparisonMetric({ label, previousValue, currentValue, changeLabel, highlight }) {
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">{label}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-1">{t('comparisonmetric.previous')}</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">{previousValue ?? '—'}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-primary-500 mb-1">{t('comparisonmetric.current')}</p>
          <p className={`text-sm font-semibold break-words ${highlight ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
            {currentValue ?? '—'}
          </p>
        </div>
      </div>

      {changeLabel && (
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/10">
          <p className={`text-xs font-medium ${highlight ? 'text-primary-700 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {changeLabel}
          </p>
        </div>
      )}
    </div>
  )
}

export default ComparisonMetric
