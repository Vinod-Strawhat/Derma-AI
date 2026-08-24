import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, SearchX, Clock, Filter } from 'lucide-react'
import SkinConcernCard from '../components/SkinConcernCard'
import HistoryScanCard from '../components/HistoryScanCard'
import HistoryFilters from '../components/HistoryFilters'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import { mockSkinConcerns } from '../data/mockHistory'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { API_MODE } from '../api/predictApi'
import { fetchMyScans } from '../api/scansApi'
import { groupScansIntoConcerns } from '../api/scanGroups'

const riskOrder = { high: 3, medium: 2, low: 1, uncertain: 0 }

function History() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const realMode = API_MODE && isAuthenticated && user?.id > 0

  const demoLoading = useSimulatedLoading(450)
  const [realScans, setRealScans] = useState([])
  const [realLoading, setRealLoading] = useState(false)
  const [realError, setRealError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!realMode) return

    let cancelled = false
    setRealLoading(true)
    setRealError(false)

    fetchMyScans()
      .then((scans) => {
        if (!cancelled) setRealScans(scans)
      })
      .catch(() => {
        if (!cancelled) setRealError(true)
      })
      .finally(() => {
        if (!cancelled) setRealLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [realMode, reloadKey])

  const loading = realMode ? realLoading : demoLoading

  const concerns = useMemo(() => {
    if (realMode) return groupScansIntoConcerns(realScans)
    return mockSkinConcerns
  }, [realMode, realScans])

  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [expandedConcernId, setExpandedConcernId] = useState(null)

  const filteredConcerns = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = concerns
      .map((concern) => {
        let scans = concern.scans

        if (riskFilter !== 'all') {
          scans = scans.filter((scan) => scan.riskLevel === riskFilter)
        }

        if (query) {
          const matchesConcern =
            concern.concernName.toLowerCase().includes(query) ||
            concern.bodyRegion.toLowerCase().includes(query) ||
            scans.some((scan) =>
              scan.prediction.toLowerCase().includes(query)
            )
          if (!matchesConcern) return null
        }

        if (scans.length === 0) return null

        if (sort === 'oldest') {
          scans = [...scans].sort(
            (a, b) => a.timestamp.localeCompare(b.timestamp)
          )
        } else if (sort === 'recent') {
          scans = [...scans].sort(
            (a, b) => b.timestamp.localeCompare(a.timestamp)
          )
        } else if (sort === 'risk') {
          scans = [...scans].sort(
            (a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
          )
        }

        return { ...concern, scans }
      })
      .filter(Boolean)

    if (sort === 'oldest') {
      result = result.sort((a, b) =>
        a.scans[0].timestamp.localeCompare(b.scans[0].timestamp)
      )
    } else if (sort === 'recent') {
      result = result.sort((a, b) =>
        b.scans[0].timestamp.localeCompare(a.scans[0].timestamp)
      )
    } else if (sort === 'risk') {
      result = result.sort((a, b) => {
        const aRisk = riskOrder[a.scans[0]?.riskLevel] ?? 0
        const bRisk = riskOrder[b.scans[0]?.riskLevel] ?? 0
        return bRisk - aRisk
      })
    }

    return result
  }, [concerns, search, riskFilter, sort])

  const totalScans = useMemo(
    () => concerns.reduce((sum, concern) => sum + concern.scans.length, 0),
    [concerns]
  )

  function handleToggleConcern(id) {
    setExpandedConcernId((current) => (current === id ? null : id))
  }

  function handleCompare(scan) {
    const idOf = (item) => (realMode ? item.scanId : item.id)

    navigate('/compare', {
      state: {
        concernId: scan.concernId,
        concernName: scan.concernName,
        scanIds: [
          idOf(scan),
          ...filteredConcerns
            .find((c) => c.id === scan.concernId)
            ?.scans.filter((s) => idOf(s) !== idOf(scan))
            .map(idOf) ?? [],
        ],
      },
    })
  }

  const hasScanForUser = concerns.length > 0

  const badge = realMode ? t('history.realBadge') : t('history.demoBadge')
  const disclaimer = realMode
    ? t('history.realDisclaimer')
    : t('history.disclaimer')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        {/* Page header */}
        <section className="animate-fade-in-down">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium text-primary-700">
              {badge}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {t('history.heading')}
          </h1>
          <p className="text-base md:text-lg text-gray-500">
            {t('history.subtext')}
          </p>
        </section>

        {loading ? (
          <section className="animate-fade-in-up animation-delay-200">
            <div className="card">
              <LoadingState
                message={t('loading.history')}
                showDemoNote={!realMode}
              />
            </div>
          </section>
        ) : realError ? (
          <section className="animate-fade-in-up animation-delay-200">
            <div className="card">
              <ErrorState
                title={t('history.errorTitle')}
                message={t('history.errorDesc')}
                onRetry={() => setReloadKey((key) => key + 1)}
              />
            </div>
          </section>
        ) : hasScanForUser ? (
          <>
            {/* Filters */}
            <section className="animate-fade-in-up animation-delay-200">
              <HistoryFilters
                search={search}
                riskFilter={riskFilter}
                sort={sort}
                onSearchChange={setSearch}
                onRiskChange={setRiskFilter}
                onSortChange={setSort}
                resultCount={filteredConcerns.reduce((sum, c) => sum + c.scans.length, 0)}
              />
            </section>

            {/* Skin concern cards */}
            <section className="space-y-4 animate-fade-in-up animation-delay-300">
              {filteredConcerns.length === 0 ? (
                <div className="card p-8 text-center">
                  <SearchX className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">{t('history.noMatchTitle')}</p>
                  <p className="text-sm text-gray-500">
                    {t('history.noMatchDesc')}
                  </p>
                </div>
              ) : (
                filteredConcerns.map((concern, index) => (
                  <article
                    key={concern.id}
                    className="space-y-3 animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  >
                    <SkinConcernCard
                      concern={concern}
                      isExpanded={expandedConcernId === concern.id}
                      onToggle={() => handleToggleConcern(concern.id)}
                    />

                    {expandedConcernId === concern.id && (
                      <div className="grid md:grid-cols-2 gap-3 pl-0 md:pl-4 animate-fade-in-down">
                        {concern.scans.map((scan) => (
                          <HistoryScanCard
                            key={scan.id}
                            scan={scan}
                            onCompare={handleCompare}
                            disabled={concern.scans.length < 2}
                          />
                        ))}
                      </div>
                    )}
                  </article>
                ))
              )}
            </section>

            <p className="text-xs text-gray-400">
              {realMode
                ? t('history.realCount', { n: totalScans })
                : t('history.demoCount', { n: totalScans })}
            </p>
          </>
        ) : (
          /* Empty state */
          <section className="animate-fade-in-up animation-delay-200">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50 border border-primary-100/60 p-10 md:p-14 text-center max-w-2xl mx-auto">
              <div className="absolute inset-0 pattern-dots opacity-30" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-5">
                  <Camera className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('history.emptyTitle')}</h2>
                <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-7">
                  {t('history.emptyDesc')}
                </p>
                <button
                  onClick={() => navigate('/skin-check')}
                  className="btn-primary !px-8 !py-3.5 text-base shadow-medical"
                >
                  {t('history.startSkinCheck')}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <Camera className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {disclaimer}
          </p>
        </section>
      </div>
    </div>
  )
}

export default History
