import { Activity, Calendar, GitCompareArrows, MapPin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ProfileStats({ stats, isNewUser }) {
  const { t } = useLanguage()

  const items = [
    { icon: Activity, label: t('profilestats.totalScans'), value: stats.totalScans },
    { icon: MapPin, label: t('profilestats.concernsTracked'), value: stats.concernsTracked },
    { icon: Calendar, label: t('profilestats.lastScan'), value: stats.lastScan ?? '—' },
    { icon: GitCompareArrows, label: t('profilestats.comparisons'), value: stats.comparisons },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const ItemIcon = item.icon
        return (
          <div key={item.label} className="card p-5">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-3">
              <ItemIcon className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{item.value}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
          </div>
        )
      })}

      {isNewUser && (
        <div className="col-span-2 lg:col-span-4">
          <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-lg px-3 py-2.5">
            {t('profilestats.demoNote')}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProfileStats
