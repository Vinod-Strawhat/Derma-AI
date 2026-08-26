import { ArrowDown, CalendarDays } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ComparisonTimeline({ comparison }) {
  const { t } = useLanguage()
  const { previousScan, currentScan, metrics } = comparison

  const elapsedLabel = t(
    metrics.elapsedDays === 1 ? 'compare.dayBetween' : 'compare.daysBetween',
    { n: metrics.elapsedDays }
  )

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-primary-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('comparisontimeline.heading')}</h3>
      </div>

      <div className="flex items-stretch justify-center gap-4">
        <div className="flex-1 text-center rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 px-3 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">{t('comparisontimeline.previous')}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{previousScan.createdAt.split('·')[0].trim()}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 py-2 flex-shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-xs font-medium text-primary-700 dark:text-primary-400">
            {elapsedLabel}
          </span>
          <ArrowDown className="w-4 h-4 text-gray-300 dark:text-gray-600" />
        </div>

        <div className="flex-1 text-center rounded-xl border border-primary-100 dark:border-primary-500/20 bg-primary-50/40 dark:bg-primary-500/10 px-3 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-primary-400 dark:text-primary-500 mb-1">{t('comparisontimeline.current')}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentScan.createdAt.split('·')[0].trim()}</p>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTimeline
