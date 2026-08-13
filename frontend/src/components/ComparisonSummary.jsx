import { ArrowDown } from 'lucide-react'
import ComparisonMetric from './ComparisonMetric'
import { useLanguage } from '../context/LanguageContext'

function ComparisonSummary({ comparison }) {
  const { t } = useLanguage()
  const { previousScan, currentScan, metrics } = comparison
  const predictionChanged = metrics.predictionChanged
  const riskChanged = metrics.riskChanged

  const confidenceDiffLabel = t('comparisonsummary.confidenceDiff', {
    n: `${metrics.confidenceDiff >= 0 ? '+' : ''}${metrics.confidenceDiff.toFixed(1)}`,
  })
  const elapsedLabel = t(
    metrics.elapsedDays === 1 ? 'compare.dayBetween' : 'compare.daysBetween',
    { n: metrics.elapsedDays }
  )

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <ComparisonMetric
          label={t('comparisonsummary.prediction')}
          previousValue={previousScan.prediction}
          currentValue={currentScan.prediction}
          changeLabel={
            predictionChanged
              ? t('comparisonsummary.predChanged')
              : t('comparisonsummary.predSame')
          }
          highlight={predictionChanged}
        />

        <ComparisonMetric
          label={t('comparisonsummary.confidence')}
          previousValue={`${previousScan.confidencePercent}%`}
          currentValue={`${currentScan.confidencePercent}%`}
          changeLabel={confidenceDiffLabel}
        />

        <ComparisonMetric
          label={t('comparisonsummary.riskLevel')}
          previousValue={`${previousScan.riskLevel.charAt(0).toUpperCase()}${previousScan.riskLevel.slice(1)}`}
          currentValue={`${currentScan.riskLevel.charAt(0).toUpperCase()}${currentScan.riskLevel.slice(1)}`}
          changeLabel={
            riskChanged
              ? t('comparisonsummary.riskChanged')
              : t('comparisonsummary.riskUnchanged')
          }
          highlight={riskChanged}
        />

        <ComparisonMetric
          label={t('comparisonsummary.timeBetween')}
          previousValue={previousScan.createdAt.split('·')[0].trim()}
          currentValue={currentScan.createdAt.split('·')[0].trim()}
          changeLabel={elapsedLabel}
        />
      </div>

      {/* AI attention comparison */}
      <div className="rounded-xl border border-gray-100 bg-accent-50/40 p-4 mt-4">
        <p className="text-xs text-accent-700 leading-relaxed">
          {t('comparisonsummary.footnote')}
        </p>
      </div>
    </div>
  )
}

export default ComparisonSummary