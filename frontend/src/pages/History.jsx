import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, SearchX } from 'lucide-react'
import SkinConcernCard from '../components/SkinConcernCard'
import HistoryScanCard from '../components/HistoryScanCard'
import HistoryFilters from '../components/HistoryFilters'
import LoadingState from '../components/LoadingState'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import { mockSkinConcerns } from '../data/mockHistory'
import { useLanguage } from '../context/LanguageContext'

const riskOrder = { high: 3, medium: 2, low: 1, uncertain: 0 }

function History() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const loading = useSimulatedLoading(450)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [expandedConcernId, setExpandedConcernId] = useState(null)

  const filteredConcerns = useMemo(() => {
    let concerns = [...mockSkinConcerns]

    if (riskFilter !== 'all') {
      concerns = concerns.filter((concern) =>
        concern.scans.some((scan) => scan.riskLevel === riskFilter)
      )
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase()
      concerns = concerns.filter((concern) => {
        const matchesName = concern.concernName.toLowerCase().includes(query)
        const matchesRegion = concern.bodyRegion.toLowerCase().includes(query)
        const matchesPrediction = concern.scans.some((scan) =>
          scan.prediction.toLowerCase().includes(query)
        )
        return matchesName || matchesRegion || matchesPrediction
      })
    }

    if (sort === 'oldest') {
      concerns = concerns.map((concern) => ({
        ...concern,
        scans: [...concern.scans].sort(
          (a, b) => a.timestamp.localeCompare(b.timestamp)
        ),
      }))
    }

    if (sort === 'recent') {
      concerns = concerns.map((concern) => ({
        ...concern,
        scans: [...concern.scans].sort(
          (a, b) => b.timestamp.localeCompare(a.timestamp)
        ),
      }))
    }

    if (sort === 'risk') {
      concerns = concerns.map((concern) => ({
        ...concern,
        scans: [...concern.scans].sort(
          (a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
        ),
      }))
      concerns.sort((a, b) => {
        const aRisk = riskOrder[a.scans[0]?.riskLevel] ?? 0
        const bRisk = riskOrder[b.scans[0]?.riskLevel] ?? 0
        return bRisk - aRisk
      })
    }

    return concerns
  }, [search, riskFilter, sort])

  const totalScans = useMemo(
    () => mockSkinConcerns.reduce((sum, concern) => sum + concern.scans.length, 0),
    []
  )

  function handleToggleConcern(id) {
    setExpandedConcernId((current) => (current === id ? null : id))
  }

  function handleCompare(scan) {
    navigate('/compare', {
      state: {
        concernId: scan.concernId,
        concernName: scan.concernName,
        scanIds: [
          scan.id,
          ...filteredConcerns
            .find((c) => c.id === scan.concernId)
            ?.scans.filter((s) => s.id !== scan.id)
            .map((s) => s.id) ?? [],
        ],
      },
    })
  }

  const hasScanForUser = mockSkinConcerns.length > 0

  return (
    <div className="bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* Page header */}
        <section className="animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 mb-4">
            {t('history.demoBadge')}
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
              <LoadingState message={t('loading.history')} />
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
                filteredConcerns.map((concern) => (
                  <article key={concern.id} className="space-y-3">
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
              {t('history.demoCount', { n: totalScans })}
            </p>
          </>
        ) : (
          /* Empty state for a new user with no scans */
          <section className="animate-fade-in-up animation-delay-200">
            <div className="card p-10 md:p-14 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
                <Camera className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('history.emptyTitle')}</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-7">
                {t('history.emptyDesc')}
              </p>
              <button
                onClick={() => navigate('/skin-check')}
                className="btn-primary !px-8 !py-3.5 text-base"
              >
                {t('history.startSkinCheck')}
              </button>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <Camera className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {t('history.disclaimer')}
          </p>
        </section>
      </div>
    </div>
  )
}

export default History