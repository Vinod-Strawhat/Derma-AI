import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Clock,
  Crosshair,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import {
  DERM_PROVIDER_AVAILABLE,
  directionsUrl,
  haversineDistanceMeters,
  isLocationNotFoundError,
  openMapUrl,
  searchDermatologistsByText,
  searchNearbyDermatologists,
} from '../api/dermatologistsApi'

const STATUS = {
  INTRO: 'intro',
  LOCATING: 'locating',
  LOADING: 'loading',
  RESULTS: 'results',
  DENIED: 'denied',
  LOCATION_UNAVAILABLE: 'location-unavailable',
  NO_RESULTS: 'no-results',
  LOCATION_NOT_FOUND: 'location-not-found',
  ERROR: 'error',
  UNAVAILABLE: 'unavailable',
}

function NearbyDermatologistsModal({ isOpen, onClose }) {
  const { t } = useLanguage()
  const [status, setStatus] = useState(STATUS.INTRO)
  const [results, setResults] = useState([])
  const [searchPoint, setSearchPoint] = useState(null)
  const [query, setQuery] = useState('')
  const [lastQuery, setLastQuery] = useState('')
  const lastActionRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setStatus(STATUS.INTRO)
    setResults([])
    setSearchPoint(null)
    setQuery('')
    setLastQuery('')
    lastActionRef.current = null
  }, [isOpen])

  function requestLocation() {
    lastActionRef.current = { type: 'location' }
    setStatus(STATUS.LOCATING)

    if (!navigator.geolocation) {
      setStatus(STATUS.LOCATION_UNAVAILABLE)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        // The provider is only reached with the user's permission and
        // coordinates. When the search provider is not configured, do
        // not pretend a search happened — show the unavailable state.
        if (!DERM_PROVIDER_AVAILABLE) {
          setStatus(STATUS.UNAVAILABLE)
          return
        }
        setSearchPoint(point)
        runNearbySearch(point)
      },
      (err) => {
        // code 1 == PERMISSION_DENIED (denied by the user); any other
        // failure (position unavailable, timeout) is "location
        // unavailable" rather than a denial.
        if (err?.code === 1) {
          setStatus(STATUS.DENIED)
        } else {
          setStatus(STATUS.LOCATION_UNAVAILABLE)
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    )
  }

  async function runNearbySearch(point) {
    setStatus(STATUS.LOADING)
    try {
      const items = await searchNearbyDermatologists(point)
      setResults(items)
      setStatus(items.length > 0 ? STATUS.RESULTS : STATUS.NO_RESULTS)
    } catch (err) {
      setStatus(STATUS.ERROR)
    }
  }

  async function handleManualSearch(event, overrideQuery) {
    event?.preventDefault()
    const trimmed = String(overrideQuery ?? query).trim()
    if (!trimmed) return

    lastActionRef.current = { type: 'manual', query: trimmed }
    setLastQuery(trimmed)

    if (!DERM_PROVIDER_AVAILABLE) {
      setStatus(STATUS.UNAVAILABLE)
      return
    }

    setStatus(STATUS.LOADING)

    try {
      const { items, point } = await searchDermatologistsByText(trimmed)
      setSearchPoint(point)
      setResults(items)
      setStatus(items.length > 0 ? STATUS.RESULTS : STATUS.NO_RESULTS)
    } catch (err) {
      setStatus(
        isLocationNotFoundError(err) ? STATUS.LOCATION_NOT_FOUND : STATUS.ERROR
      )
    }
  }

  function handleRetry() {
    const action = lastActionRef.current
    if (action?.type === 'location') {
      requestLocation()
    } else if (action?.type === 'manual' && action.query) {
      setQuery(action.query)
      handleManualSearch(undefined, action.query)
    } else {
      requestLocation()
    }
  }

  function formatDistance(item) {
    if (!searchPoint) return null
    const meters = haversineDistanceMeters(searchPoint, {
      latitude: item.latitude,
      longitude: item.longitude,
    })
    if (meters == null) return null
    if (meters < 1000) {
      return t('dermatologists.distanceMeters', { n: Math.round(meters) })
    }
    return t('dermatologists.distanceKm', {
      n: (meters / 1000).toFixed(1),
    })
  }

  function openingLabel(item) {
    if (item.businessStatus === 'CLOSED_PERMANENTLY') {
      return { text: t('dermatologists.closedPermanently'), tone: 'red' }
    }
    if (item.businessStatus === 'CLOSED_TEMPORARILY') {
      return { text: t('dermatologists.closedTemporarily'), tone: 'amber' }
    }
    if (item.openNow === true) {
      return { text: t('dermatologists.openNow'), tone: 'green' }
    }
    if (item.openNow === false) {
      return { text: t('dermatologists.closedNow'), tone: 'amber' }
    }
    return { text: t('dermatologists.hoursUnknown'), tone: 'gray' }
  }

  const toneClasses = {
    green: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-700 bg-amber-50 border-amber-100',
    red: 'text-red-700 bg-red-50 border-red-100',
    gray: 'text-gray-500 bg-gray-50 border-gray-100',
  }

  const controlsVisible = [
    STATUS.INTRO,
    STATUS.RESULTS,
    STATUS.DENIED,
    STATUS.LOCATION_UNAVAILABLE,
    STATUS.NO_RESULTS,
    STATUS.LOCATION_NOT_FOUND,
    STATUS.ERROR,
  ].includes(status)

  const busy = status === STATUS.LOCATING || status === STATUS.LOADING

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('dermatologists.title')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-2xl max-h-[88vh] bg-white rounded-2xl shadow-xl flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {t('dermatologists.title')}
              </h2>
              <p className="text-xs text-gray-400">{t('dermatologists.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('dermatologists.close')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
          {/* Neutral medical-safety note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-medical-50 border border-medical-100">
            <ShieldCheck className="w-4 h-4 text-medical-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-medical-700 leading-relaxed">
              {t('dermatologists.neutralNote')}
            </p>
          </div>

          {status === STATUS.UNAVAILABLE && (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {t('dermatologists.unavailableTitle')}
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t('dermatologists.unavailableDesc')}
              </p>
            </div>
          )}

          {status !== STATUS.UNAVAILABLE && controlsVisible && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={requestLocation}
                  className="btn-primary flex-1 !py-2.5 text-sm"
                >
                  <Crosshair className="w-4 h-4 mr-2" />
                  {t('dermatologists.useMyLocation')}
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="h-px bg-gray-200 flex-1" />
                {t('dermatologists.searchByPlace')}
                <span className="h-px bg-gray-200 flex-1" />
              </div>

              <form onSubmit={handleManualSearch} className="flex gap-2">
                <label htmlFor="derm-place-search" className="sr-only">
                  {t('dermatologists.manualSearchAria')}
                </label>
                <input
                  id="derm-place-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('dermatologists.manualPlaceholder')}
                  className="input-field !py-2.5 text-sm"
                />
                <button type="submit" className="btn-secondary !px-4 !py-2.5 text-sm flex-shrink-0">
                  <Search className="w-4 h-4 mr-2" />
                  {t('dermatologists.manualButton')}
                </button>
              </form>
            </div>
          )}

          {busy && (
            <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
              <Loader2 className="w-9 h-9 text-primary-600 animate-spin" />
              <p className="mt-4 text-sm font-medium text-gray-700">
                {status === STATUS.LOCATING
                  ? t('dermatologists.locating')
                  : t('dermatologists.searching')}
              </p>
            </div>
          )}

          {status === STATUS.INTRO && (
            <div className="text-center py-6 px-2">
              <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
                {t('dermatologists.intro')}
              </p>
            </div>
          )}

          {status === STATUS.DENIED && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {t('dermatologists.deniedTitle')}
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-1">
                {t('dermatologists.deniedDesc')}
              </p>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-5">
                {t('dermatologists.deniedHint')}
              </p>
              <button onClick={handleRetry} className="btn-secondary !px-5 !py-2.5 text-sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('dermatologists.retryLocation')}
              </button>
            </div>
          )}

          {status === STATUS.LOCATION_UNAVAILABLE && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {t('dermatologists.locationUnavailableTitle')}
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t('dermatologists.locationUnavailableDesc')}
              </p>
            </div>
          )}

          {status === STATUS.NO_RESULTS && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {t('dermatologists.noResultsTitle')}
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t('dermatologists.noResultsDesc')}
              </p>
            </div>
          )}

          {status === STATUS.LOCATION_NOT_FOUND && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {t('dermatologists.locationNotFoundTitle')}
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t('dermatologists.locationNotFoundDesc')}
              </p>
            </div>
          )}

          {status === STATUS.ERROR && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {t('dermatologists.errorTitle')}
              </p>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
                {t('dermatologists.errorDesc')}
              </p>
              <button onClick={handleRetry} className="btn-secondary !px-5 !py-2.5 text-sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('errors.retry')}
              </button>
            </div>
          )}

          {status === STATUS.RESULTS && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('dermatologists.resultsHeading')}
                </h3>
                <span className="text-xs text-gray-400">
                  {t('dermatologists.resultCount', { n: results.length })}
                </span>
              </div>

              <ul className="space-y-3">
                {results.map((item, index) => {
                  const distance = formatDistance(item)
                  const opening = openingLabel(item)
                  const hasHours =
                    item.openNow !== null || item.businessStatus !== null
                  return (
                    <li
                      key={item.placeId || `${item.name}-${index}`}
                      className="card p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 break-words">
                            {item.name}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${
                              item.category === 'dermatology'
                                ? 'bg-medical-50 text-medical-700 border border-medical-100'
                                : 'bg-gray-50 text-gray-600 border border-gray-100'
                            }`}
                          >
                            {item.category === 'dermatology'
                              ? t('dermatologists.dermatologyProvider')
                              : t('dermatologists.healthcareProvider')}
                          </span>
                          {item.address && (
                            <p className="text-xs text-gray-500 mt-1 break-words">
                              {item.address}
                            </p>
                          )}
                        </div>
                        {distance && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium text-primary-700 flex-shrink-0">
                            <MapPin className="w-3 h-3" />
                            {distance}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {item.rating != null && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {item.rating.toFixed(1)}
                            {item.userRatingsTotal != null && (
                              <span className="text-gray-400">
                                ({t('dermatologists.reviews', {
                                  n: item.userRatingsTotal,
                                })})
                              </span>
                            )}
                          </span>
                        )}
                        {hasHours && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${toneClasses[opening.tone]}`}
                          >
                            <Clock className="w-3 h-3" />
                            {opening.text}
                          </span>
                        )}
                      </div>

                      {item.weekdayText && (
                        <details className="mt-2 group">
                          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 list-none">
                            {t('dermatologists.weeklyHours')}
                          </summary>
                          <ul className="mt-2 space-y-0.5 text-xs text-gray-500">
                            {item.weekdayText.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </details>
                      )}

                      {((item.latitude != null && item.longitude != null) || item.placeId) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.latitude != null && item.longitude != null && (
                            <a
                              href={directionsUrl(item.latitude, item.longitude)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary !px-3.5 !py-2 text-xs"
                            >
                              <Navigation className="w-3.5 h-3.5 mr-1.5" />
                              {t('dermatologists.directions')}
                            </a>
                          )}
                          <a
                            href={openMapUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary !px-3.5 !py-2 text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                            {t('dermatologists.openInMaps')}
                          </a>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>

              <p className="text-xs text-gray-400 text-center">
                {t('dermatologists.providedBy')}
              </p>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-100">
            <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              {t('dermatologists.privacyNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NearbyDermatologistsModal