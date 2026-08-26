import { useEffect, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { useLanguage } from '../context/LanguageContext'
import { toThumbnailUrl } from '../api/scanGroups'

function ComparisonScanCard({ label, scan }) {
  const { t } = useLanguage()
  const [imageFailed, setImageFailed] = useState(false)
  const date = scan?.createdAt.split('·')[0].trim()

  const imageUrl = scan?.raw ? toThumbnailUrl(scan.raw) : ''

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
      </div>

      {/* Scan image: real for authenticated scans, placeholder for demo */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-200 via-medical-200 to-accent-200">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={scan?.prediction}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-primary-700/50 absolute inset-0 m-auto" />
        )}
        {!scan?.raw && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/80 dark:bg-[#0D1B2A]/80 text-[10px] font-medium text-gray-600 dark:text-gray-400">
            {t('comparisonscan.demoImage')}
          </span>
        )}
      </div>

      <div className="p-5 space-y-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('comparisonscan.date')}</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white text-right">{date}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('comparisonscan.prediction')}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white text-right">{scan?.prediction}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('comparisonscan.confidence')}</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
            {scan?.confidencePercent ?? ((scan?.confidence ?? 0) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('comparisonscan.risk')}</p>
          <RiskBadge riskLevel={scan?.riskLevel} />
        </div>
      </div>
    </div>
  )
}

export default ComparisonScanCard
