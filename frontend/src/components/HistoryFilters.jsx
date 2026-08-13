import { Search, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function HistoryFilters({ search, riskFilter, sort, onSearchChange, onRiskChange, onSortChange, resultCount }) {
  const { t } = useLanguage()

  const RISK_FILTERS = [
    { value: 'all', label: t('historyfilter.all') },
    { value: 'low', label: t('risk.lowRisk') },
    { value: 'medium', label: t('risk.mediumRisk') },
    { value: 'high', label: t('risk.highRisk') },
  ]

  const SORT_OPTIONS = [
    { value: 'recent', label: t('historyfilter.sortRecent') },
    { value: 'oldest', label: t('historyfilter.sortOldest') },
    { value: 'risk', label: t('historyfilter.sortRisk') },
  ]

  return (
    <div className="card p-4 md:p-5 space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('historyfilter.searchPlaceholder')}
            aria-label={t('historyfilter.searchAria')}
            className="input-field !pl-10 !py-2.5 text-sm"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label={t('historyfilter.sortLabel')}
            className="input-field !pl-10 !py-2.5 text-sm appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">{t('historyfilter.filter')}:</span>
        {RISK_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onRiskChange(filter.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              riskFilter === filter.value
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        {t('historyfilter.showing', { n: resultCount })}
      </p>
    </div>
  )
}

export default HistoryFilters