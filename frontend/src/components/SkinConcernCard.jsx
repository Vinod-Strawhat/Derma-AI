import { ChevronDown, MapPin, ScanLine } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { useLanguage } from '../context/LanguageContext'

function SkinConcernCard({ concern, isExpanded, onToggle }) {
  const { t } = useLanguage()
  const totalScans = concern.scans.length
  const latestScan = concern.scans[0]
  const latestDate = latestScan.createdAt.split('·')[0].trim()
  const regionLabel = concern.bodyRegion.charAt(0).toUpperCase() + concern.bodyRegion.slice(1)

  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      className={`card p-5 md:p-6 w-full text-left transition-colors ${
        isExpanded ? 'border-primary-200 shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium text-primary-700">
              <MapPin className="w-3 h-3 mr-1" />
              {regionLabel}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
              <ScanLine className="w-3 h-3 mr-1" />
              {t('historyxc.scanCount', { n: totalScans })}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">{concern.concernName}</h3>
          <p className="text-sm text-gray-500 mb-3">{t('historyxc.latest')} {latestDate}</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">
              {t('historyxc.latestPrediction')} <span className="font-medium text-gray-900">{latestScan.prediction}</span>
            </span>
            <RiskBadge riskLevel={latestScan.riskLevel} />
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>
    </button>
  )
}

export default SkinConcernCard