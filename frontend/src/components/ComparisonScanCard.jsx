import { Image as ImageIcon } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { useLanguage } from '../context/LanguageContext'

function ComparisonScanCard({ label, scan }) {
  const { t } = useLanguage()
  const date = scan?.createdAt.split('·')[0].trim()

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      </div>

      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-200 via-medical-200 to-accent-200">
        <ImageIcon className="w-8 h-8 text-primary-700/50 absolute inset-0 m-auto" />
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/80 text-[10px] font-medium text-gray-600">
          {t('comparisonscan.demoImage')}
        </span>
      </div>

      <div className="p-5 space-y-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{t('comparisonscan.date')}</p>
          <p className="text-sm font-medium text-gray-900 text-right">{date}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{t('comparisonscan.prediction')}</p>
          <p className="text-sm font-semibold text-gray-900 text-right">{scan?.prediction}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{t('comparisonscan.confidence')}</p>
          <p className="text-sm font-medium text-gray-700 text-right">
            {scan?.confidencePercent ?? ((scan?.confidence ?? 0) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{t('comparisonscan.risk')}</p>
          <RiskBadge riskLevel={scan?.riskLevel} />
        </div>
      </div>
    </div>
  )
}

export default ComparisonScanCard