import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, GitCompareArrows, Sparkles, ArrowRightLeft } from 'lucide-react'
import ComparisonScanCard from '../components/ComparisonScanCard'
import ComparisonSummary from '../components/ComparisonSummary'
import ComparisonTimeline from '../components/ComparisonTimeline'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import {
  buildComparison,
  defaultScanSelection,
  getConcernById,
  sortScansByDateDesc,
} from '../data/comparison'
import { mockSkinConcerns } from '../data/mockHistory'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { API_MODE } from '../api/predictApi'
import {
  fetchCompareScans,
  fetchMyScans,
  ScansError,
} from '../api/scansApi'
import {
  buildCompareSet,
  groupScansIntoConcerns,
  toResultView,
} from '../api/scanGroups'
import { buildImageUrl } from '../api/imageUrl'

function Compare() {
  const { t } = useLanguage()
  const { darkMode } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const realMode = API_MODE && isAuthenticated && user?.id > 0

  const passedState = location.state
  const passedConcernId = passedState?.concernId ?? null
  const passedScanIds = Array.isArray(passedState?.scanIds)
    ? passedState.scanIds.filter((id) => id !== null && id !== undefined)
    : []

  const demoLoading = useSimulatedLoading(400)

  const [realLoading, setRealLoading] = useState(false)
  const [realError, setRealError] = useState(false)
  const [realErrorKind, setRealErrorKind] = useState('network')
  const [realConcerns, setRealConcerns] = useState([])
  const [activeRealConcern, setActiveRealConcern] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [insufficient, setInsufficient] = useState(false)
  const [realBrowsing, setRealBrowsing] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const [browsing, setBrowsing] = useState(!passedConcernId)
  const [selectedConcernId, setSelectedConcernId] = useState(null)
  const [previousScanId, setPreviousScanId] = useState(null)
  const [currentScanId, setCurrentScanId] = useState(null)

  async function applyPair(firstId, secondId) {
    setRealLoading(true)
    setRealError(false)
    setInsufficient(false)

    try {
      const data = await fetchCompareScans(firstId, secondId)
      const raw = data?.scans ?? []
      if (!raw[0] || !raw[1]) throw new ScansError(0, 'empty compare result')

      const compareSet = buildCompareSet(raw[0], raw[1])
      setActiveRealConcern(compareSet.concern)
      setComparison(
        buildComparison({
          concern: compareSet.concern,
          previousScan: compareSet.previous,
          currentScan: compareSet.current,
        })
      )
      setRealBrowsing(false)
    } catch (err) {
      const status = err instanceof ScansError ? err.status : 0
      setRealErrorKind(
        status === 400 ? 'invalid' : status === 404 ? 'missing' : 'network'
      )
      setRealError(true)
    } finally {
      setRealLoading(false)
    }
  }

  useEffect(() => {
    if (!realMode) return

    let cancelled = false

    async function run() {
      setRealLoading(true)
      setRealError(false)

      try {
        const scans = await fetchMyScans()
        if (cancelled) return

        const grouped = groupScansIntoConcerns(scans)
        setRealConcerns(grouped)

        if (passedScanIds.length >= 2) {
          await applyPair(passedScanIds[0], passedScanIds[1])
        } else {
          setRealBrowsing(true)
          setRealLoading(false)
        }
      } catch (err) {
        if (cancelled) return
        setRealErrorKind('network')
        setRealError(true)
        setRealLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [realMode, reloadKey])

  function handleSelectRealConcern(id) {
    const concern = realConcerns.find((item) => item.id === id)
    if (!concern) return

    setActiveRealConcern(concern)
    setComparison(null)
    setInsufficient(false)

    if (concern.scans.length < 2) {
      setInsufficient(true)
      setRealBrowsing(false)
      return
    }

    const selection = defaultScanSelection(concern)
    applyPair(selection.previousScan.scanId, selection.currentScan.scanId)
  }

  function handleChangeRealConcern() {
    setComparison(null)
    setInsufficient(false)
    setActiveRealConcern(null)
    setRealBrowsing(true)
  }

  function handleViewRealResult() {
    const current = comparison?.currentScan
    if (!current?.raw) return
    navigate('/results', { state: { result: toResultView(current.raw) } })
  }

  const activeConcernId = browsing ? null : (selectedConcernId ?? passedConcernId)
  const activeConcern = useMemo(
    () => (activeConcernId ? getConcernById(activeConcernId) : null),
    [activeConcernId]
  )
  const scans = useMemo(() => sortScansByDateDesc(activeConcern?.scans ?? []), [activeConcern])

  const defaultSelection = useMemo(() => defaultScanSelection(activeConcern), [activeConcern])

  const initialSelection = useMemo(() => {
    if (!activeConcern) return null
    const scanIds = passedState?.scanIds
    if (Array.isArray(scanIds) && scanIds.length >= 2) {
      const set = new Set(activeConcern.scans.map((scan) => scan.id))
      const present = scanIds.filter((id) => set.has(id))
      if (present.length >= 2) {
        return { currentScanId: present[0], previousScanId: present[1] }
      }
    }
    return null
  }, [activeConcern, passedState?.scanIds])

  const demoPreviousScanId = previousScanId ?? initialSelection?.previousScanId ?? null
  const demoCurrentScanId = currentScanId ?? initialSelection?.currentScanId ?? null

  const demoPreviousScan = scans.find((scan) => scan.id === demoPreviousScanId) ?? defaultSelection?.previousScan ?? null
  const demoCurrentScan = scans.find((scan) => scan.id === demoCurrentScanId) ?? defaultSelection?.currentScan ?? null

  const demoComparison = useMemo(
    () => (activeConcern && demoPreviousScan && demoCurrentScan
      ? buildComparison({ concern: activeConcern, previousScan: demoPreviousScan, currentScan: demoCurrentScan })
      : null),
    [activeConcern, demoPreviousScan, demoCurrentScan]
  )

  const canSelect = scans.length >= 2
  const scansForPrevious = scans.filter((scan) => scan.id !== demoCurrentScanId)
  const scansForCurrent = scans.filter((scan) => scan.id !== demoPreviousScanId)

  function handleBrowseConcerns() {
    setSelectedConcernId(null)
    setBrowsing(true)
  }

  function handleSelectConcern(id) {
    setSelectedConcernId(id)
    setPreviousScanId(null)
    setCurrentScanId(null)
    setBrowsing(false)
  }

  // ─── Real-mode render ──────────────────────────────────────
  if (realMode) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-[#07111F] via-[#0D1B2A] to-[#07111F]' : 'bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
          <button
            onClick={() => navigate('/history')}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('compare.back')}
          </button>

          <section className="animate-fade-in-down">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-accent-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-100 text-xs font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-800">
                {t('compare.realBadge')}
              </div>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('compare.heading')}
            </h1>
            <p className={`text-base md:text-lg max-w-2xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('compare.subtext')}
            </p>
          </section>

          {realLoading ? (
            <section className="animate-fade-in-up animation-delay-200">
              <div className="card">
                <LoadingState message={t('loading.compare')} showDemoNote={false} />
              </div>
            </section>
          ) : realError ? (
            <section className="animate-fade-in-up animation-delay-200">
              <div className="card">
                <ErrorState
                  title={
                    realErrorKind === 'invalid'
                      ? t('compare.invalidTitle')
                      : realErrorKind === 'missing'
                        ? t('compare.scanMissingTitle')
                        : t('compare.errorTitle')
                  }
                  message={
                    realErrorKind === 'invalid'
                      ? t('compare.invalidCombination')
                      : realErrorKind === 'missing'
                        ? t('compare.scanMissing')
                        : t('compare.errorDesc')
                  }
                  onRetry={() => setReloadKey((key) => key + 1)}
                />
              </div>
            </section>
          ) : insufficient ? (
            <section className="animate-fade-in-up animation-delay-200">
              <div className={`relative overflow-hidden rounded-3xl border p-10 text-center max-w-2xl mx-auto ${darkMode ? 'bg-gradient-to-br from-[#0D1B2A] via-[#111827] to-[#0D1B2A] border-white/5' : 'bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50 border-primary-100/60'}`}>
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <GitCompareArrows className="w-7 h-7 text-primary-600" />
                  </div>
                  <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('compare.needTwoScans')}
                  </h2>
                  <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('compare.thisConcernHas', { n: activeRealConcern?.scans.length ?? 0 })}
                  </p>
                  <button
                    onClick={() => navigate('/skin-check')}
                    className="btn-primary !px-8 !py-3.5 text-base shadow-medical"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('compare.startNew')}
                  </button>
                </div>
              </div>
            </section>
          ) : !comparison ? (
            <section className="animate-fade-in-up animation-delay-200">
              <div className="card p-8">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                    <GitCompareArrows className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('compare.selectConcern')}</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('compare.selectConcernSubtext')}</p>
                  </div>
                </div>
                <CompareSelection
                  concerns={realConcerns}
                  onSelect={handleSelectRealConcern}
                  scanCountLabel={(item) => t('compare.scanCount', { n: item.scans.length })}
                />
              </div>
            </section>
          ) : (
            <>
              <section className="animate-fade-in-up animation-delay-200">
                <div className="card p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('compare.skinConcern')}
                      </p>
                      <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activeRealConcern?.concernName}
                      </h2>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('compare.bodyRegion')}
                      </p>
                      <p className={`text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {activeRealConcern?.bodyRegion.charAt(0).toUpperCase() + activeRealConcern?.bodyRegion.slice(1)}
                      </p>
                    </div>
                    <button
                      onClick={handleChangeRealConcern}
                      className="btn-secondary !px-5 !py-2.5 text-sm"
                    >
                      {t('compare.changeConcern')}
                    </button>
                  </div>
                </div>
              </section>

              <section className="animate-fade-in-up animation-delay-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <ComparisonScanCard
                    label={t('compare.previousScan')}
                    scan={comparison.previousScan}
                  />
                  <ComparisonScanCard
                    label={t('compare.currentScan')}
                    scan={comparison.currentScan}
                  />
                </div>
              </section>

              <section className="animate-fade-in-up animation-delay-400">
                <div className="mb-4">
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('compare.aiResultHeading')}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('compare.aiResultSubtext')}</p>
                </div>
                <ComparisonSummary comparison={comparison} />
              </section>

              <section className="animate-fade-in-up animation-delay-500">
                <ComparisonTimeline comparison={comparison} />
              </section>

              <section className="animate-fade-in-up animation-delay-500">
                <div className="card p-6">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('compare.aiAttentionHeading')}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('compare.aiAttentionSubtext')}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    {[
                      { label: t('compare.prevScan'), scan: comparison.previousScan, accent: false },
                      { label: t('compare.curScan'), scan: comparison.currentScan, accent: true },
                    ].map((panel) => {
                      const grad = panel.scan?.raw?.gradcam
                      const available = Boolean(grad?.available && grad?.imageUrl)
                      const url = grad?.imageUrl ? buildImageUrl(grad.imageUrl) : ''
                      return (
                        <div key={panel.label}>
                          <div className="mb-2">
                            <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${panel.accent ? 'text-accent-700 bg-accent-50 border-accent-100 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-800' : 'text-primary-700 bg-primary-50 border-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800'}`}>
                              <Sparkles className={`w-3.5 h-3.5 ${panel.accent ? 'text-accent-500' : 'text-primary-400'}`} />
                              {panel.label}
                            </span>
                          </div>
                          {available ? (
                            <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                              <img
                                src={url}
                                alt={t('gradcam.availableAlt')}
                                loading="lazy"
                                className="w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={`rounded-xl border-2 border-dashed p-6 text-center ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50/60'}`}>
                              <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${darkMode ? 'text-gray-500 bg-white/10 border-white/10' : 'text-gray-400 bg-white border-gray-100'}`}>
                                <Sparkles className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                {t('gradcam.unavailable')}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('compare.attentionDescReal')}
                  </p>
                </div>
              </section>

              <section className="animate-fade-in-up animation-delay-500">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleViewRealResult}
                    className="btn-primary flex-1 !py-3 shadow-medical"
                  >
                    {t('compare.viewCurrentResult')}
                  </button>
                  <button
                    onClick={() => navigate('/history')}
                    className="btn-secondary flex-1 !py-3"
                  >
                    {t('compare.backToHistory')}
                  </button>
                </div>
              </section>
            </>
          )}

          <section className={`flex items-start gap-3 p-4 rounded-2xl border ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50/80 border-amber-100'}`}>
            <GitCompareArrows className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              {t('compare.realDisclaimer')}
            </p>
          </section>
        </div>
      </div>
    )
  }

  // ─── Demo-mode render ──────────────────────────────────────
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-[#07111F] via-[#0D1B2A] to-[#07111F]' : 'bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        <button
          onClick={() => navigate('/history')}
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('compare.back')}
        </button>

        <section className="animate-fade-in-down">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-accent-600" />
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${darkMode ? 'bg-amber-900/30 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
              {t('compare.demoBadge')}
            </div>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('compare.heading')}
          </h1>
          <p className={`text-base md:text-lg max-w-2xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('compare.subtext')}
          </p>
        </section>

        {demoLoading ? (
          <section className="animate-fade-in-up animation-delay-200">
            <div className="card">
              <LoadingState message={t('loading.compare')} />
            </div>
          </section>
        ) : (
          <>
            {!activeConcern && (
              <section className="animate-fade-in-up animation-delay-200">
                <div className="card p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                      <GitCompareArrows className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('compare.selectConcern')}</h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('compare.selectConcernSubtext')}</p>
                    </div>
                  </div>
                  <CompareSelection
                    concerns={mockSkinConcerns}
                    onSelect={handleSelectConcern}
                    scanCountLabel={(item) => t('compare.scanCount', { n: item.scans.length })}
                  />
                </div>
              </section>
            )}

            {activeConcern && (
              <>
                <section className="animate-fade-in-up animation-delay-200">
                  <div className="card p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('compare.skinConcern')}
                        </p>
                        <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activeConcern.concernName}
                        </h2>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('compare.bodyRegion')}
                        </p>
                        <p className={`text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {activeConcern.bodyRegion.charAt(0).toUpperCase() + activeConcern.bodyRegion.slice(1)}
                        </p>
                      </div>
                      <button
                        onClick={handleBrowseConcerns}
                        className="btn-secondary !px-5 !py-2.5 text-sm"
                      >
                        {t('compare.changeConcern')}
                      </button>
                    </div>
                  </div>
                </section>

                {!canSelect ? (
                  <section className="animate-fade-in-up animation-delay-300">
                    <div className={`relative overflow-hidden rounded-3xl border p-10 text-center max-w-2xl mx-auto ${darkMode ? 'bg-gradient-to-br from-[#0D1B2A] via-[#111827] to-[#0D1B2A] border-white/5' : 'bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50 border-primary-100/60'}`}>
                      <div className="absolute inset-0 pattern-dots opacity-30" />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                          <GitCompareArrows className="w-7 h-7 text-primary-600" />
                        </div>
                        <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('compare.needTwoScans')}
                        </h2>
                        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('compare.thisConcernHas', { n: scans.length })}
                        </p>
                        <button
                          onClick={() => navigate('/skin-check')}
                          className="btn-primary !px-8 !py-3.5 text-base shadow-medical"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {t('compare.startNew')}
                        </button>
                      </div>
                    </div>
                  </section>
                ) : demoComparison ? (
                  <>
                    <section className="animate-fade-in-up animation-delay-300">
                      <div className="card p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label htmlFor="previous-scan" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {t('compare.previousScan')}
                            </label>
                            <select
                              id="previous-scan"
                              value={demoPreviousScan?.id ?? ''}
                              onChange={(e) => setPreviousScanId(e.target.value)}
                              className="input-field text-sm appearance-none cursor-pointer"
                            >
                              {scansForPrevious.map((scan) => (
                                <option key={scan.id} value={scan.id}>
                                  {scan.createdAt.split('·')[0].trim()} — {scan.prediction}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="current-scan" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {t('compare.currentScan')}
                            </label>
                            <select
                              id="current-scan"
                              value={demoCurrentScan?.id ?? ''}
                              onChange={(e) => setCurrentScanId(e.target.value)}
                              className="input-field text-sm appearance-none cursor-pointer"
                            >
                              {scansForCurrent.map((scan) => (
                                <option key={scan.id} value={scan.id}>
                                  {scan.createdAt.split('·')[0].trim()} — {scan.prediction}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <p className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('compare.note')}
                        </p>
                      </div>
                    </section>

                    <section className="animate-fade-in-up animation-delay-400">
                      <div className="grid md:grid-cols-2 gap-6">
                        <ComparisonScanCard
                          label={t('compare.previousScan')}
                          scan={demoPreviousScan}
                        />
                        <ComparisonScanCard
                          label={t('compare.currentScan')}
                          scan={demoCurrentScan}
                        />
                      </div>
                    </section>

                    <section className="animate-fade-in-up animation-delay-500">
                      <div className="mb-4">
                        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('compare.aiResultHeading')}</h2>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('compare.aiResultSubtext')}</p>
                      </div>
                      <ComparisonSummary comparison={demoComparison} />
                    </section>

                    <section className="animate-fade-in-up animation-delay-600">
                      <ComparisonTimeline comparison={demoComparison} />
                    </section>

                    <section className="animate-fade-in-up animation-delay-600">
                      <div className="card p-6">
                        <div className="flex items-start gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-accent-600" />
                          </div>
                          <div>
                            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('compare.aiAttentionHeading')}</h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('compare.aiAttentionSubtext')}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-5">
                          {[
                            { label: t('compare.prevScan'), accent: false },
                            { label: t('compare.curScan'), accent: true },
                          ].map((panel) => (
                            <div key={panel.label} className={`rounded-xl border-2 border-dashed p-6 text-center ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50/60'}`}>
                              <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${darkMode ? 'text-gray-500 bg-white/10 border-white/10' : 'text-gray-400 bg-white border-gray-100'}`}>
                                <Sparkles className={`w-3.5 h-3.5 ${panel.accent ? 'text-accent-500' : 'text-primary-400'}`} />
                                {panel.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('compare.attentionDesc')}
                        </p>
                      </div>
                    </section>

                    <section className="animate-fade-in-up animation-delay-600">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => navigate(`/results`, {
                            state: {
                              scenario: demoCurrentScan.riskLevel === 'high' ? 'high-risk' : demoCurrentScan.riskLevel === 'uncertain' ? 'uncertain' : 'confident',
                              patient: { age: 48, gender: 'Female', region: demoCurrentScan.bodyRegion },
                            },
                          })}
                          className="btn-primary flex-1 !py-3 shadow-medical"
                        >
                          {t('compare.viewCurrentResult')}
                        </button>
                        <button
                          onClick={() => navigate('/history')}
                          className="btn-secondary flex-1 !py-3"
                        >
                          {t('compare.backToHistory')}
                        </button>
                      </div>
                    </section>
                  </>
                ) : null}
              </>
            )}
          </>
        )}

        <section className={`flex items-start gap-3 p-4 rounded-2xl border ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50/80 border-amber-100'}`}>
          <GitCompareArrows className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
            {t('compare.disclaimer')}
          </p>
        </section>
      </div>
    </div>
  )
}

function CompareSelection({ concerns, onSelect, scanCountLabel }) {
  const { darkMode } = useTheme()

  return (
    <div className="space-y-3">
      {concerns.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="card-interactive p-4 w-full text-left flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.concernName}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{scanCountLabel(item)}</p>
          </div>
          <GitCompareArrows className="w-5 h-5 text-primary-500 flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}

export default Compare
