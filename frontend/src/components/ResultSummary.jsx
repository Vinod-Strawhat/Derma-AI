import { Stethoscope } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { useLanguage } from '../context/LanguageContext'

function ResultSummary({ result }) {
  const { t } = useLanguage()
  const { prediction, uncertainty } = result
  const isUncertain = uncertainty?.isUncertain
  const isHighRisk = prediction.riskLevel === 'high'
  const confidence = prediction.confidence

  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('resultsummary.prediction')}</p>
            {isUncertain ? (
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{t('resultsummary.resultUncertain')}</h2>
            ) : (
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{prediction.className}</h2>
            )}
          </div>
        </div>
        <RiskBadge riskLevel={prediction.riskLevel} />
      </div>

      {isUncertain ? (
        <div className="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 mb-5">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('resultsummary.uncertainMessage')}</p>
        </div>
      ) : (
        <div className="mb-5">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('resultsummary.modelConfidence')}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {t('resultsummary.preliminary')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {(confidence * 100).toFixed(1)}%
            </span>
            <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 via-medical-500 to-accent-500"
                style={{ width: `${(confidence * 100).toFixed(1)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {isHighRisk && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 mb-5">
          <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">{t('resultsummary.highRiskSignal')}</p>
          <p className="text-sm text-red-700/80 dark:text-red-400/80 leading-relaxed">
            {t('resultsummary.highRiskDesc')}
          </p>
        </div>
      )}

      {isUncertain && (
        <div className="rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 p-4">
          <p className="text-sm text-primary-800 dark:text-primary-400 leading-relaxed">
            {t('resultsummary.uncertainRec')}
          </p>
        </div>
      )}
    </div>
  )
}

export default ResultSummary
