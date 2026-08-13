import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  Eye,
  GitCompareArrows,
  Lightbulb,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import ScanCard from '../components/ScanCard'
import HealthOverview from '../components/HealthOverview'
import RecentActivity from '../components/RecentActivity'
import Modal from '../components/Modal'
import { mockSkinConcerns } from '../data/mockHistory'
import { useLanguage } from '../context/LanguageContext'

const riskTxKey = { high: 'highRisk', medium: 'mediumRisk', low: 'lowRisk', uncertain: 'uncertainRisk' }

const sortedScans = mockSkinConcerns
  .flatMap((concern) => concern.scans.map((scan) => ({ ...scan, concernName: concern.concernName })))
  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

const comparisonConcern = mockSkinConcerns.find((concern) => concern.scans.length >= 2)
const lastComparisonDate = comparisonConcern
  ? [...comparisonConcern.scans]
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[1]
      .createdAt.split('·')[0].trim()
  : null

const recentScans = sortedScans.slice(0, 3).map((scan) => ({
  id: scan.id,
  date: scan.createdAt.split('·')[0].trim(),
  condition: scan.prediction,
  confidence: Math.round((scan.confidence ?? 0) * 100),
  risk: scan.riskLevel,
  region: scan.bodyRegion,
}))

function Dashboard() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  const latestScan = sortedScans[0]
  const latestRisk = latestScan?.riskLevel ?? 'low'
  const latestRiskLabel = t(`risk.${riskTxKey[latestRisk]}`)

  const overviewStats = [
    { icon: Activity, label: t('dashboard.totalScans'), value: String(sortedScans.length), subtext: t('dashboard.allTimeChecks') },
    { icon: Calendar, label: t('dashboard.latestScan'), value: latestScan ? latestScan.createdAt.split('·')[0].trim() : '—', subtext: latestScan?.prediction ?? '' },
    { icon: ShieldCheck, label: t('dashboard.currentRisk'), value: latestRiskLabel, subtext: t('dashboard.basedOnLatest') },
    { icon: GitCompareArrows, label: t('dashboard.lastComparison'), value: lastComparisonDate ?? '—', subtext: t('dashboard.twoCompared') },
  ]

  const activities = [
    { icon: CheckCircle2, title: t('dashboard.actScanCompleted'), time: sortedScans[0]?.createdAt ?? '', color: 'bg-primary-500' },
    { icon: Eye, title: t('dashboard.actResultViewed'), time: sortedScans[0]?.createdAt ?? '', color: 'bg-medical-500' },
    { icon: GitCompareArrows, title: t('dashboard.actPrevCompared'), time: lastComparisonDate ? `${lastComparisonDate}` : '', color: 'bg-accent-500' },
    { icon: CheckCircle2, title: t('dashboard.actScanCompleted'), time: sortedScans[1]?.createdAt ?? '', color: 'bg-primary-500' },
  ]

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  return (
    <div className="bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12 md:space-y-16">
        {/* Welcome */}
        <section className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">{t('dashboard.welcome')}</h1>
          <p className="text-base md:text-lg text-gray-500">{t('dashboard.subtitle')}</p>
        </section>

        {/* Main CTA */}
        <section className="animate-fade-in-up animation-delay-200">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-medical-700 p-8 md:p-12 text-white shadow-xl">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 mb-4 text-xs font-medium">
                  <Camera className="w-3.5 h-3.5" />
                  {t('dashboard.newScan')}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('dashboard.startHeading')}</h2>
                <p className="text-primary-100 leading-relaxed">
                  {t('dashboard.startSubtext')}
                </p>
              </div>

              <Link
                to="/skin-check"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group flex-shrink-0"
              >
                {t('dashboard.startSkinCheck')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features & How It Works */}
        <section className="grid md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
          <button
            type="button"
            onClick={() => setFeaturesOpen(true)}
            className="card p-6 text-left hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('featuresCard.title')}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{t('featuresCard.desc')}</p>
          </button>

          <button
            type="button"
            onClick={() => setHowItWorksOpen(true)}
            className="card p-6 text-left hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('howItWorksCard.title')}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{t('howItWorksCard.desc')}</p>
          </button>
        </section>

        {/* Recent Scans */}
        <section id="recent-scans" className="scroll-mt-24 animate-fade-in-up animation-delay-300">
          <div className="flex items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{t('dashboard.recentScans')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('dashboard.recentScansSubtext')}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 flex-shrink-0">
              {t('dashboard.demoData')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentScans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
        </section>

        {/* Overview + Compare */}
        <section className="grid lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{t('dashboard.overview')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('dashboard.overviewSubtext')}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 flex-shrink-0">
                {t('dashboard.demoData')}
              </span>
            </div>
            <HealthOverview stats={overviewStats} />
          </div>

          <div id="compare" className="scroll-mt-24 animate-fade-in-up animation-delay-500">
            <div className="card p-6 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4">
                <GitCompareArrows className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.compareScans')}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {t('dashboard.compareScansDesc')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/compare')}
                className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
              >
                <GitCompareArrows className="w-4 h-4" />
                {t('dashboard.compareScans')}
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="animate-fade-in-up animation-delay-600">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{t('dashboard.recentActivity')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('dashboard.recentActivitySubtext')}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 flex-shrink-0">
                  {t('dashboard.demoData')}
                </span>
              </div>
              <div className="card p-6">
                <RecentActivity activities={activities} />
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-6">{t('dashboard.dataAtGlance')}</h2>
                <div className="card p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <ShieldCheck className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <h3 className="text-base font-semibold text-gray-900">{t('dashboard.privacyFirst')}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t('dashboard.privacyDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medical disclaimer */}
        <section className="flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-amber-50/80 border border-amber-100">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {t('dashboard.disclaimer')}
          </p>
        </section>
      </div>

      {/* Features Modal */}
      <Modal
        isOpen={featuresOpen}
        onClose={() => setFeaturesOpen(false)}
        title={t('featuresModal.title')}
      >
        <div className="space-y-5">
          {[
            { icon: '🔬', key: 'aiSkinAnalysis' },
            { icon: '🧠', key: 'multimodalAnalysis' },
            { icon: '⚠️', key: 'riskAssessment' },
            { icon: '💡', key: 'explainableAI' },
            { icon: '📋', key: 'skinHistory' },
            { icon: '🔄', key: 'scanComparison' },
            { icon: '🏥', key: 'nearbyDermatologists' },
          ].map((feature) => (
            <div key={feature.key} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{feature.icon}</span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {t(`featuresModal.${feature.key}`)}
                  {feature.key === 'nearbyDermatologists' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-medium text-amber-700">
                      {t('featuresModal.comingSoon')}
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                  {t(`featuresModal.${feature.key}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* How It Works Modal */}
      <Modal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        title={t('howItWorksModal.title')}
      >
        <div className="space-y-4">
          {[
            { step: 1, key: 'step1', sub: null },
            { step: 2, key: 'step2', sub: ['step2Age', 'step2Gender', 'step2BodyRegion'] },
            { step: 3, key: 'step3', sub: null },
            { step: 4, key: 'step4', sub: null, note: 'step4Note' },
            { step: 5, key: 'step5', sub: null },
            { step: 6, key: 'step6', sub: null },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">{s.step}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {t(`howItWorksModal.${s.key}`)}
                </p>
                {s.sub && (
                  <ul className="mt-1 ml-1 space-y-0.5">
                    {s.sub.map((subKey) => (
                      <li key={subKey} className="text-xs text-gray-500 leading-relaxed">
                        - {t(`howItWorksModal.${subKey}`)}
                      </li>
                    ))}
                  </ul>
                )}
                {s.note && (
                  <p className="mt-1 text-xs text-amber-600 italic">
                    {t(`howItWorksModal.${s.note}`)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard