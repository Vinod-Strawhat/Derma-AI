import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, GitCompareArrows, Sparkles } from 'lucide-react'
import ComparisonScanCard from '../components/ComparisonScanCard'
import ComparisonSummary from '../components/ComparisonSummary'
import ComparisonTimeline from '../components/ComparisonTimeline'
import LoadingState from '../components/LoadingState'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import {
  buildComparison,
  defaultScanSelection,
  getConcernById,
  sortScansByDateDesc,
} from '../data/comparison'
import { mockSkinConcerns } from '../data/mockHistory'
import { useLanguage } from '../context/LanguageContext'

function Compare() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const loading = useSimulatedLoading(400)
  const passedState = location.state

  const passedConcernId = passedState?.concernId ?? null

  const [browsing, setBrowsing] = useState(!passedConcernId)
  const [selectedConcernId, setSelectedConcernId] = useState(null)

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

  const [previousScanId, setPreviousScanId] = useState(initialSelection?.previousScanId ?? null)
  const [currentScanId, setCurrentScanId] = useState(initialSelection?.currentScanId ?? null)

  const previousScan = scans.find((scan) => scan.id === previousScanId) ?? defaultSelection?.previousScan ?? null
  const currentScan = scans.find((scan) => scan.id === currentScanId) ?? defaultSelection?.currentScan ?? null

  const comparison = useMemo(
    () => (activeConcern && previousScan && currentScan ? buildComparison({ concern: activeConcern, previousScan, currentScan }) : null),
    [activeConcern, previousScan, currentScan]
  )

  const canSelect = scans.length >= 2
  const scansForPrevious = scans.filter((scan) => scan.id !== currentScanId)
  const scansForCurrent = scans.filter((scan) => scan.id !== previousScanId)

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

  return (
    <div className="bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* Back */}
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('compare.back')}
        </button>

        {/* Header */}
        <section className="animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 mb-4">
            {t('compare.demoBadge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {t('compare.heading')}
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl">
            {t('compare.subtext')}
          </p>
        </section>

        {loading ? (
          <section className="animate-fade-in-up animation-delay-200">
            <div className="card">
              <LoadingState message={t('loading.compare')} />
            </div>
          </section>
        ) : (
          <>
            {!activeConcern && (
          /* Selection interface when no valid comparison is provided */
          <section className="animate-fade-in-up animation-delay-200">
            <div className="card p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <GitCompareArrows className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{t('compare.selectConcern')}</h2>
                  <p className="text-sm text-gray-500">{t('compare.selectConcernSubtext')}</p>
                </div>
              </div>
              <CompareSelection
                onSelect={handleSelectConcern}
                scanCountLabel={(item) => t('compare.scanCount', { n: item.scans.length })}
              />
            </div>
          </section>
        )}

        {activeConcern && (
          <>
            {/* Concern header */}
            <section className="animate-fade-in-up animation-delay-200">
              <div className="card p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
                      {t('compare.skinConcern')}
                    </p>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                      {activeConcern.concernName}
                    </h2>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
                      {t('compare.bodyRegion')}
                    </p>
                    <p className="text-base font-medium text-gray-700">
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
              /* Single-scan concern empty state */
              <section className="animate-fade-in-up animation-delay-300">
                <div className="card p-10 text-center max-w-2xl mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <GitCompareArrows className="w-7 h-7 text-primary-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {t('compare.needTwoScans')}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {t('compare.thisConcernHas', { n: scans.length })}
                  </p>
                  <button
                    onClick={() => navigate('/skin-check')}
                    className="btn-primary !px-8 !py-3.5 text-base"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('compare.startNew')}
                  </button>
                </div>
              </section>
            ) : comparison ? (
              <>
                {/* Scan selection */}
                <section className="animate-fade-in-up animation-delay-300">
                  <div className="card p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="previous-scan" className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('compare.previousScan')}
                        </label>
                        <select
                          id="previous-scan"
                          value={previousScan?.id ?? ''}
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
                        <label htmlFor="current-scan" className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('compare.currentScan')}
                        </label>
                        <select
                          id="current-scan"
                          value={currentScan?.id ?? ''}
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
                    <p className="text-xs text-gray-400 mt-3">
                      {t('compare.note')}
                    </p>
                  </div>
                </section>

                {/* Side-by-side image comparison */}
                <section className="animate-fade-in-up animation-delay-400">
                  <div className="grid md:grid-cols-2 gap-6">
                    <ComparisonScanCard
                      label={t('compare.previousScan')}
                      scan={previousScan}
                    />
                    <ComparisonScanCard
                      label={t('compare.currentScan')}
                      scan={currentScan}
                    />
                  </div>
                </section>

                {/* Summary */}
                <section className="animate-fade-in-up animation-delay-500">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-900">{t('compare.aiResultHeading')}</h2>
                    <p className="text-sm text-gray-500">{t('compare.aiResultSubtext')}</p>
                  </div>
                  <ComparisonSummary comparison={comparison} />
                </section>

                {/* Timeline */}
                <section className="animate-fade-in-up animation-delay-600">
                  <ComparisonTimeline comparison={comparison} />
                </section>

                {/* Grad-CAM comparison */}
                <section className="animate-fade-in-up animation-delay-600">
                  <div className="card p-6">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{t('compare.aiAttentionHeading')}</h3>
                        <p className="text-sm text-gray-500">{t('compare.aiAttentionSubtext')}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-5">
{[
                        { label: t('compare.prevScan'), accent: false },
                        { label: t('compare.curScan'), accent: true },
                      ].map((panel) => (
                        <div key={panel.label} className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-6 text-center">
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 px-3 py-1.5 rounded-full bg-white border border-gray-100">
                            <Sparkles className={`w-3.5 h-3.5 ${panel.accent ? 'text-accent-500' : 'text-primary-400'}`} />
                            {panel.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {t('compare.attentionDesc')}
                    </p>
                  </div>
                </section>

                {/* Navigation */}
                <section className="animate-fade-in-up animation-delay-600">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate(`/results`, {
                        state: {
                          scenario: currentScan.riskLevel === 'high' ? 'high-risk' : currentScan.riskLevel === 'uncertain' ? 'uncertain' : 'confident',
                          patient: { age: 48, gender: 'Female', region: currentScan.bodyRegion },
                        },
                      })}
                      className="btn-primary flex-1 !py-3"
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

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <GitCompareArrows className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {t('compare.disclaimer')}
          </p>
        </section>
      </div>
    </div>
  )
}

function CompareSelection({ onSelect, scanCountLabel }) {
  return (
    <div className="space-y-3">
      {mockSkinConcerns.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="card p-4 w-full text-left flex items-center justify-between gap-3 hover:border-primary-200 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{item.concernName}</p>
            <p className="text-xs text-gray-500">{scanCountLabel(item)}</p>
          </div>
          <GitCompareArrows className="w-5 h-5 text-primary-500 flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}

export default Compare