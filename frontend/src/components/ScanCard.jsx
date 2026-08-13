import { Link } from 'react-router-dom'
import { Eye, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ScanCard({ scan }) {
  const { t } = useLanguage()

  const riskConfig = {
    low: {
      label: t('risk.lowRisk'),
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      Icon: ShieldCheck,
    },
    medium: {
      label: t('risk.mediumRisk'),
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
      Icon: AlertTriangle,
    },
    high: {
      label: t('risk.highRisk'),
      badge: 'bg-red-50 text-red-700 border-red-100',
      Icon: AlertTriangle,
    },
    uncertain: {
      label: t('risk.uncertainRisk'),
      badge: 'bg-gray-100 text-gray-700 border-gray-200',
      Icon: ShieldCheck,
    },
  }

  const risk = riskConfig[scan.risk] ?? riskConfig.low
  const RiskIcon = risk.Icon
  const scenario =
    scan.risk === 'high' ? 'high-risk' : scan.risk === 'uncertain' ? 'uncertain' : 'confident'

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-medium text-gray-400">{scan.date}</span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${risk.badge}`}
        >
          <RiskIcon className="w-3.5 h-3.5" />
          {risk.label}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">{scan.condition}</h3>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-500">{t('scancard.aiConfidence')}</span>
          <span className="font-semibold text-primary-600">{scan.confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-medical-500"
            style={{ width: `${scan.confidence}%` }}
          />
        </div>

        <Link
          to="/results"
          state={{
            scenario,
            patient: { age: 48, gender: 'Female', region: scan.region },
          }}
          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary-200 text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors duration-200"
        >
          <Eye className="w-4 h-4" />
          {t('scancard.viewResult')}
        </Link>
      </div>
    </div>
  )
}

export default ScanCard