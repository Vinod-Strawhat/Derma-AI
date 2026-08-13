import { useNavigate } from 'react-router-dom'
import { ChevronRight, GitCompareArrows, Image as ImageIcon } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { useLanguage } from '../context/LanguageContext'

function HistoryScanCard({ scan, onCompare, disabled }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const percentage = ((scan.confidence ?? 0) * 100).toFixed(1)

  function handleViewResult() {
    navigate('/results', {
      state: {
        scenario: scan.riskLevel === 'high' ? 'high-risk' : scan.riskLevel === 'uncertain' ? 'uncertain' : 'confident',
        patient: { age: 48, gender: 'Female', region: scan.bodyRegion },
      },
    })
  }

  return (
    <div className="card p-4 md:p-5">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary-200 via-medical-200 to-accent-200 flex-shrink-0">
          <ImageIcon className="w-6 h-6 text-primary-700/50 absolute inset-0 m-auto" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{scan.prediction}</p>
              <p className="text-xs text-gray-400">{scan.createdAt}</p>
            </div>
            <RiskBadge riskLevel={scan.riskLevel} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{t('historyscan.confidence')}</span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden max-w-[120px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-medical-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-primary-600">{percentage}%</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={handleViewResult}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary-200 text-xs font-medium text-primary-700 hover:bg-primary-50 transition-colors"
            >
              {t('historyscan.viewResult')}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onCompare(scan)}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <GitCompareArrows className="w-3.5 h-3.5" />
              {t('historyscan.compare')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryScanCard