import { useLanguage } from '../context/LanguageContext'

const RiskBadge = ({ riskLevel }) => {
  const { t } = useLanguage()

  const config = {
    low: {
      label: t('risk.lowRisk'),
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    medium: {
      label: t('risk.mediumRisk'),
      badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      dot: 'bg-amber-500',
    },
    high: {
      label: t('risk.highRisk'),
      badge: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
      dot: 'bg-red-500',
    },
    uncertain: {
      label: t('risk.uncertainRisk'),
      badge: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-400 dark:border-white/10',
      dot: 'bg-gray-400',
    },
  }

  const level = config[riskLevel] ?? config.uncertain

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${level.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
      {level.label}
    </span>
  )
}

export default RiskBadge
