import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Camera, History, BarChart3, Activity, AlertTriangle, ArrowRight, FileText, Eye, ShieldCheck, MapPin, ScanSearch, Brain, ArrowUpRight } from 'lucide-react'
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

  const latestScan = scans.length > 0 ? scans[0] : null
  const latestPrediction = latestScan?.prediction?.className ?? null
  const latestConfidence = latestScan?.prediction?.confidence ?? null

  function formatScanDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch { return iso || '' }
  }

  function getRiskConfig(risk) {
    const configs = {
      low: { label: t('risk.lowRisk'), badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100', Icon: ShieldCheck, dot: 'bg-emerald-400' },
      medium: { label: t('risk.mediumRisk'), badge: 'bg-amber-50 text-amber-700 border border-amber-100', Icon: AlertTriangle, dot: 'bg-amber-400' },
      high: { label: t('risk.highRisk'), badge: 'bg-red-50 text-red-700 border border-red-100', Icon: AlertTriangle, dot: 'bg-red-400' },
      uncertain: { label: t('risk.uncertainRisk'), badge: 'bg-gray-100 text-gray-600 border border-gray-200', Icon: ShieldCheck, dot: 'bg-gray-400' },
    }
    return configs[risk] || configs.low
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'

  const hasScans = scans.length > 0

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          SECTION A: PREMIUM WELCOME / HERO AREA
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-40" />

        {/* Abstract skin scan visualization */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Orbital scanning ring */}
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.07]">
            <div className="absolute inset-0 rounded-full border-2 border-primary-500 animate-orbital" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-6 rounded-full border border-primary-400 animate-orbital" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            <div className="absolute inset-12 rounded-full border border-accent-400 animate-orbital" style={{ animationDuration: '20s' }} />
          </div>

          {/* Floating particles */}
          <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-primary-400/20 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-32 right-[20%] w-1.5 h-1.5 rounded-full bg-accent-400/20 animate-float-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-16 left-[30%] w-2.5 h-2.5 rounded-full bg-medical-400/15 animate-float-slower" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-24 right-[35%] w-1 h-1 rounded-full bg-primary-300/25 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Welcome content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Status badge */}
              <div className="animate-hero-entrance opacity-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                  </span>
                  <span className="text-xs font-medium text-primary-700">
                    {realMode ? t('dashboard.realMode') : t('dashboard.demoMode')}
                  </span>
                </div>
              </div>

              {/* Welcome heading */}
              <div className="animate-hero-entrance-delay-1 opacity-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  {t('dashboard.welcome')},{' '}
                  <span className="text-gradient-medical">{displayName}</span>
                </h1>
                <p className="mt-3 text-lg text-gray-500 max-w-xl leading-relaxed">
                  {hasScans
                    ? t('dashboard.subtitleWithData')
                    : t('dashboard.subtitle')
                  }
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 animate-hero-entrance-delay-2 opacity-0">
                <button
                  onClick={() => navigate('/skin-check')}
                  className="group btn-primary !px-8 !py-4 text-base shadow-medical hover:shadow-medical-lg"
                >
                  <ScanSearch className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('dashboard.newScan')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                {hasScans && (
                  <button
                    onClick={() => navigate('/history')}
                    className="group btn-secondary !px-6 !py-4 text-base"
                  >
                    <History className="w-4 h-4 mr-2" />
                    {t('dashboard.viewHistory')}
                  </button>
                )}
              </div>
            </div>

            {/* Right: AI Visualization */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end animate-hero-entrance-delay-3 opacity-0">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Outer scan ring */}
                <div className="absolute inset-0 rounded-full border border-primary-200/40" />
                <div className="absolute inset-3 rounded-full border border-primary-100/30" />

                {/* Rotating orbital */}
                <svg className="absolute inset-0 w-full h-full animate-orbital" style={{ animationDuration: '20s' }} viewBox="0 0 320 320">
                  <defs>
                    <linearGradient id="dashRing" gradientTransform="rotate(90)">
                      <stop offset="0%" stopColor="rgba(52,97,247,0.3)" />
                      <stop offset="100%" stopColor="rgba(168,85,247,0.1)" />
                    </linearGradient>
                  </defs>
                  <circle cx="160" cy="160" r="150" fill="none" stroke="url(#dashRing)" strokeWidth="1" strokeDasharray="8 6" />
                </svg>

                {/* Center skin analysis visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-52 md:h-52 rounded-[2rem] overflow-hidden shadow-medical border border-primary-100/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f5e6d8] via-[#ecdcc8] to-[#e8d0b8]" />

                  {/* Skin texture */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.18]" viewBox="0 0 200 200">
                    <defs>
                      <pattern id="dermaCells" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M10 2 L16 6 L16 14 L10 18 L4 14 L4 6 Z" fill="none" stroke="rgba(140,110,90,0.5)" strokeWidth="0.5" />
                        <circle cx="10" cy="10" r="0.6" fill="rgba(130,100,80,0.3)" />
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#dermaCells)" />
                  </svg>

                  {/* Scanning line */}
                  <div className="absolute inset-x-0 h-[2px]">
                    <div
                      className="w-full h-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(52,97,247,0.0) 15%, rgba(52,97,247,0.6) 50%, rgba(52,97,247,0.0) 85%, transparent 100%)',
                        boxShadow: '0 0 20px 4px rgba(52,97,247,0.2)',
                        animation: 'scanLine 3.5s ease-in-out infinite',
                      }}
                    />
                  </div>

                  {/* Detection markers */}
                  <div className="absolute top-[25%] left-[20%] animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
                    <div className="w-8 h-8 rounded border border-primary-500/50 border-dashed flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500/70" />
                    </div>
                  </div>

                  <div className="absolute bottom-[22%] right-[18%] animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
                    <div className="w-7 h-7 rounded border border-accent-500/50 border-dashed flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-500/70" />
                    </div>
                  </div>

                  {/* Confidence label */}
                  <div className="absolute top-[18%] right-[10%] animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 shadow-sm border border-primary-100/60">
                      <span className="text-[9px] font-semibold text-primary-600 tracking-wide">AI Analysis</span>
                    </div>
                  </div>
                </div>

                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full border border-primary-300/20 animate-pulse-ring" />
                <div className="absolute inset-6 rounded-full border border-primary-200/15 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />

                {/* Status pill */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10">
                  <div className="glass-strong px-4 py-2 rounded-full shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" style={{ animationDuration: '2s' }} />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500" />
                      </span>
                      <span className="text-[10px] font-bold text-primary-700 tracking-[0.12em] uppercase">{t('scanvisual.status')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION B: HEALTH OVERVIEW / EMPTY STATE
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {loading ? (
          /* Loading state */
          <section className="animate-fade-in">
            <div className="card p-12 text-center">
              <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">{t('dashboard.loading')}</p>
            </div>
          </section>
        ) : error ? (
          /* Error state */
          <section className="animate-fade-in">
            <div className="card p-8 text-center border-2 border-rose-100 bg-rose-50/30">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <p className="text-sm text-rose-700 mb-3">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary text-sm !py-2">
                {t('dashboard.retry')}
              </button>
            </div>
          </section>
        ) : !hasScans ? (
          /* ═══ EMPTY STATE - "Your skin analysis journey starts here" ═══ */
          <section className="animate-fade-in-up">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50 border border-primary-100/60 p-8 md:p-12">
              {/* Background pattern */}
              <div className="absolute inset-0 pattern-dots opacity-30" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl" />
              <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-accent-100/20 rounded-full blur-3xl" />

              <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left visual */}
                <div className="flex-shrink-0">
                  <div className="relative w-28 h-28 md:w-36 md:h-36">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-10 animate-pulse-gentle" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-accent-500/5 flex items-center justify-center">
                      <ScanSearch className="w-12 h-12 md:w-16 md:h-16 text-primary-400/60" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary-200/60" />
                  </div>
                </div>

                {/* Right content */}
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {t('dashboard.noScansTitle')}
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-md leading-relaxed">
                    {t('dashboard.noScansDesc')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => navigate('/skin-check')}
                      className="group btn-primary !px-8 !py-3.5 shadow-medical"
                    >
                      <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {t('dashboard.startFirstScan')}
                    </button>
                    <button
                      onClick={() => navigate('/skin-check')}
                      className="btn-secondary !px-6 !py-3.5"
                    >
                      {t('dashboard.learnHow')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* ═══ HEALTH OVERVIEW ═══ */}
            <section className="animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Scans */}
                <div className="group card-interactive p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <Camera className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t('dashboard.totalScans')}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{scans.length}</p>
                </div>

                {/* Risk Scans */}
                <div className="group card-interactive p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t('dashboard.riskyScans')}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{dangerScans.length}</p>
                </div>

                {/* Last Scan Date */}
                <div className="group card-interactive p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t('dashboard.lastScan')}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {latestScan ? formatScanDate(latestScan.createdAt) : '\u2014'}
                  </p>
                </div>

                {/* Latest Prediction */}
                <div className="group card-interactive p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                      <Brain className="w-5 h-5 text-accent-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t('dashboard.latestPrediction')}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {latestPrediction || '\u2014'}
                  </p>
                  {latestConfidence !== null && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(latestConfidence * 100).toFixed(1)}% {t('scancard.aiConfidence').toLowerCase()}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ═══ RECENT ANALYSES ═══ */}
            <section className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t('dashboard.recentScans')}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{t('dashboard.recentScansSubtitle')}</p>
                </div>
                {scans.length > 3 && (
                  <button
                    onClick={() => navigate('/history')}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
                  >
                    {t('dashboard.viewAll')}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scans.slice(0, 6).map((scan, index) => {
                  const risk = scan.prediction?.riskLevel ?? 'low'
                  const rc = getRiskConfig(risk)
                  const RiskIcon = rc.Icon
                  const confidence = scan.prediction?.confidence ?? 0

                  return (
                    <div
                      key={scan.scanId}
                      className={`group card-interactive p-5 flex flex-col animate-stagger-${Math.min(index + 1, 6)} opacity-0`}
                    >
                      {/* Header: date + risk */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-medium text-gray-400">{formatScanDate(scan.createdAt)}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${rc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                          {rc.label}
                        </span>
                      </div>

                      {/* Prediction class */}
                      <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-1">
                        {scan.prediction?.className ?? '\u2014'}
                      </h3>

                      {/* Confidence bar */}
                      <div className="mt-auto space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-gray-400">{t('scancard.aiConfidence')}</span>
                            <span className="font-semibold text-primary-600">{(confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700"
                              style={{ width: `${confidence * 100}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to="/results"
                          state={{ result: scan }}
                          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary-100 text-sm font-medium text-primary-700 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200 group-hover:shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          {t('scancard.viewResult')}
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SECTION D: AI EXPLANATION / WORKFLOW
            ═══════════════════════════════════════════════════════════ */}
        <section className="animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 p-8 md:p-12 text-white">
            {/* Background elements */}
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {t('dashboard.aiWorkflowTitle')}
                </h2>
                <p className="text-gray-300 max-w-xl mx-auto">
                  {t('dashboard.aiWorkflowSubtitle')}
                </p>
              </div>

              {/* Process flow */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { step: '01', icon: Camera, label: t('dashboard.workflowStep1'), desc: t('dashboard.workflowStep1Desc') },
                  { step: '02', icon: Brain, label: t('dashboard.workflowStep2'), desc: t('dashboard.workflowStep2Desc') },
                  { step: '03', icon: Eye, label: t('dashboard.workflowStep3'), desc: t('dashboard.workflowStep3Desc') },
                  { step: '04', icon: ShieldCheck, label: t('dashboard.workflowStep4'), desc: t('dashboard.workflowStep4Desc') },
                ].map((item, index) => (
                  <div key={item.step} className="relative group">
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                          <item.icon className="w-5 h-5 text-primary-300" />
                        </div>
                        <span className="text-[10px] font-bold text-primary-300/60 tracking-widest uppercase">
                          {t('dashboard.step')} {item.step}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">{item.label}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                    {/* Connector arrow (desktop) */}
                    {index < 3 && (
                      <div className="hidden md:flex absolute top-1/2 -right-3 md:-right-4 -translate-y-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                {t('dashboard.aiDisclaimer')}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION E: QUICK ACTIONS
            ═══════════════════════════════════════════════════════════ */}
        <section className="animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Skin Check - visually dominant */}
            <button
              onClick={() => navigate('/skin-check')}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-left text-white shadow-medical hover:shadow-medical-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ScanSearch className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold mb-1">{t('dashboard.newScan')}</h3>
                <p className="text-xs text-primary-100 leading-relaxed">{t('dashboard.newScanDesc')}</p>
                <ArrowUpRight className="w-4 h-4 mt-3 text-primary-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </button>

            {/* View History */}
            <button
              onClick={() => navigate('/history')}
              className="group card-interactive p-6 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors group-hover:scale-110 transition-transform duration-300">
                <History className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{t('dashboard.viewHistory')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('dashboard.viewHistoryDesc')}</p>
              <ArrowUpRight className="w-4 h-4 mt-3 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>

            {/* Compare Scans */}
            <button
              onClick={() => navigate('/compare')}
              className="group card-interactive p-6 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4 group-hover:bg-accent-100 transition-colors group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{t('dashboard.compareScans')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('dashboard.compareScansDesc')}</p>
              <ArrowUpRight className="w-4 h-4 mt-3 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>

            {/* Find Dermatologists */}
            <button
              onClick={() => navigate('/results')}
              className="group card-interactive p-6 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-medical-50 flex items-center justify-center mb-4 group-hover:bg-medical-100 transition-colors group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-medical-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{t('dashboard.findDermatologists')}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{t('dashboard.findDermatologistsDesc')}</p>
              <ArrowUpRight className="w-4 h-4 mt-3 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
