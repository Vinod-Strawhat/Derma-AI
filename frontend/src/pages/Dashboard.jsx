import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Camera, History, BarChart3, Activity, AlertTriangle, ArrowRight, FileText, Eye, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_MODE } from '../api/predictApi'
import { fetchMyScans } from '../api/scansApi'

function Dashboard() {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const realMode = API_MODE && isAuthenticated && user?.id > 0

  useEffect(() => {
    if (!realMode) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchMyScans()
      .then((data) => {
        if (!cancelled) setScans(data)
      })
      .catch((err) => {
        console.error('Failed to load history:', err)
        if (!cancelled) setError(t('dashboard.loadError'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [realMode, t])

  const dangerScans = scans.filter(s => {
    const risk = s.prediction?.riskLevel
    return risk === 'high' || risk === 'medium'
  })

  const stats = [
    { label: t('dashboard.totalScans'), value: scans.length, icon: Camera, color: 'from-primary-500 to-primary-600', bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
    { label: t('dashboard.riskyScans'), value: dangerScans.length, icon: AlertTriangle, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: t('dashboard.lastScan'), value: scans.length ? new Date(scans[0].createdAt).toLocaleDateString() : '\u2014', icon: Activity, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ]

  function formatScanDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch { return iso || '' }
  }

  function getRiskConfig(risk) {
    const configs = {
      low: { label: t('risk.lowRisk'), badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', Icon: ShieldCheck },
      medium: { label: t('risk.mediumRisk'), badge: 'bg-amber-50 text-amber-700 border-amber-100', Icon: AlertTriangle },
      high: { label: t('risk.highRisk'), badge: 'bg-red-50 text-red-700 border-red-100', Icon: AlertTriangle },
      uncertain: { label: t('risk.uncertainRisk'), badge: 'bg-gray-100 text-gray-700 border-gray-200', Icon: ShieldCheck },
    }
    return configs[risk] || configs.low
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {t('dashboard.welcome')}, {user?.name || user?.email?.split('@')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm md:text-base">{t('dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card p-4 flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => navigate('/skin-check')}
            className="group card p-4 flex items-center gap-4 border-2 border-dashed border-primary-200 hover:border-primary-400 bg-primary-50/30 hover:bg-primary-50/60 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{t('dashboard.newScan')}</p>
              <p className="text-xs text-gray-500">{t('dashboard.newScanDesc')}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 ml-auto transition-colors" />
          </button>

          <button
            onClick={() => navigate('/history')}
            className="group card p-4 flex items-center gap-4 border-2 border-dashed border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-gray-50/80 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <History className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{t('dashboard.viewHistory')}</p>
              <p className="text-xs text-gray-500">{t('dashboard.viewHistoryDesc')}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto transition-colors" />
          </button>

          <button
            onClick={() => navigate('/compare')}
            className="group card p-4 flex items-center gap-4 border-2 border-dashed border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-gray-50/80 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{t('dashboard.compareScans')}</p>
              <p className="text-xs text-gray-500">{t('dashboard.compareScansDesc')}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto transition-colors" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentScans')}</h2>
            {scans.length > 3 && (
              <button
                onClick={() => navigate('/history')}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {t('dashboard.viewAll')}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t('dashboard.loading')}</p>
            </div>
          ) : error ? (
            <div className="card p-8 text-center border-2 border-rose-100 bg-rose-50/30">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <p className="text-sm text-rose-700 mb-3">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary text-sm !py-2">
                {t('dashboard.retry')}
              </button>
            </div>
          ) : scans.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('dashboard.noScansTitle')}</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">{t('dashboard.noScansDesc')}</p>
              <button onClick={() => navigate('/skin-check')} className="btn-primary text-sm !py-2.5">
                {t('dashboard.startFirstScan')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scans.slice(0, 6).map((scan) => {
                const risk = scan.prediction?.riskLevel ?? 'low'
                const rc = getRiskConfig(risk)
                const RiskIcon = rc.Icon
                const scenario =
                  risk === 'high' ? 'high-risk' : risk === 'uncertain' ? 'uncertain' : 'confident'

                return (
                  <div key={scan.scanId} className="card p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-medium text-gray-400">{formatScanDate(scan.createdAt)}</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${rc.badge}`}
                      >
                        <RiskIcon className="w-3.5 h-3.5" />
                        {rc.label}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{scan.prediction?.className ?? '\u2014'}</h3>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500">{t('scancard.aiConfidence')}</span>
                        <span className="font-semibold text-primary-600">{((scan.prediction?.confidence ?? 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-medical-500"
                          style={{ width: `${(scan.prediction?.confidence ?? 0) * 100}%` }}
                        />
                      </div>

                      <Link
                        to="/results"
                        state={{ result: scan }}
                        className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary-200 text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        {t('scancard.viewResult')}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
  )
}

export default Dashboard
