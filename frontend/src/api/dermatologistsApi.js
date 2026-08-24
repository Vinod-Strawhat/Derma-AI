// Nearby Dermatologist search — free OpenStreetMap provider.
//
// Geocoding:  Nominatim (https://nominatim.openstreetmap.org)
// POI search: Overpass API (https://overpass-api.de)
//
// Both services are free, require no API key, and are well within the
// usage expectations of a low-volume college demo. Requests happen only
// on explicit user action and are kept small:
//
//   - Nominatim usage policy
//     https://operations.osmfoundation.org/policies/nominatim/
//     Max 1 request/second, no autocomplete, no bulk/systematic
//     queries, repeated queries must be cached. We comply by caching
//     geocode results in memory and throttling to one call per ~1.1s.
//
//   - Overpass API usage guidance
//     https://dev.overpass-api.de/overpass-doc/en/preface/commons.html
//     Modest per-day quotas, ~2 concurrent slots per IP. We issue one
//     small query at a time per search.
//
// The user's coordinates are sent ONLY to these search providers, are
// never transmitted to the DermaAI backend, and are never stored or
// logged. No API key is required for this feature.

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'

// The free providers always work when there is a network connection, so
// the feature never reports itself as "unavailable" the way it did when
// a paid API key was required.
export const DERM_PROVIDER_AVAILABLE = true

const DERMATOLOGY_RADIUS_METERS = 30000
const HEALTHCARE_RADIUS_METERS = 15000
const MAX_RESULTS = 50
const GEOCODE_MIN_INTERVAL_MS = 1100
const OVERPASS_QUERY_GAP_MS = 1000
const GEOCODE_CACHE_MAX = 50

const DERMATOLOGY_CLAUSES = [
  'nwr["healthcare:speciality"="dermatology"]',
  'nwr["healthcare"="dermatology"]',
  'nwr["clinic:speciality"="dermatology"]',
]

const HEALTHCARE_CLAUSES = [
  'nwr["amenity"="doctors"]',
  'nwr["healthcare"="doctor"]',
  'nwr["amenity"="clinic"]',
  'nwr["healthcare"="clinic"]',
]

// ---------------------------------------------------------------------------
// Geocoding (city / area -> coordinates) via Nominatim
// ---------------------------------------------------------------------------

const geocodeCache = new Map()
let lastGeocodeAt = 0

async function throttledFetch(url) {
  const waitMs = GEOCODE_MIN_INTERVAL_MS - (Date.now() - lastGeocodeAt)
  if (waitMs > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, waitMs))
  }
  lastGeocodeAt = Date.now()
  return fetch(url.toString())
}

function geocodeQuery(query) {
  const key = String(query || '').trim().toLowerCase()
  if (!key) {
    return Promise.reject(new Error('Empty location query.'))
  }

  if (geocodeCache.has(key)) {
    return Promise.resolve(geocodeCache.get(key))
  }

  const request = fetchGeocode(query).then((point) => {
    if (geocodeCache.size >= GEOCODE_CACHE_MAX) {
      const oldest = geocodeCache.keys().next().value
      geocodeCache.delete(oldest)
    }
    geocodeCache.set(key, point)
    return point
  })

  return request
}

async function fetchGeocode(query) {
  const url = new URL(NOMINATIM_ENDPOINT)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('accept-language', 'en')

  let res
  try {
    res = await throttledFetch(url)
  } catch (err) {
    throw new Error('Geocode request failed: network error.')
  }

  if (!res.ok) {
    throw new Error(`Geocode request failed: HTTP ${res.status}`)
  }

  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Location not found.')
  }

  const first = data[0]
  const latitude = parseFloat(first.lat)
  const longitude = parseFloat(first.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Location not found.')
  }

  return { latitude, longitude }
}

// ---------------------------------------------------------------------------
// Nearby places via Overpass
// ---------------------------------------------------------------------------

function buildQuery(clauses, radius, lat, lng, cap) {
  const body = clauses
    .map((clause) => `${clause}(around:${radius},${lat.toFixed(6)},${lng.toFixed(6)});`)
    .join('\n')
  return `[out:json][timeout:25];(${body});out center tags qt ${cap};`
}

async function runOverpass(clauses, radius, lat, lng, cap) {
  const url = new URL(OVERPASS_ENDPOINT)
  url.searchParams.set('data', buildQuery(clauses, radius, lat, lng, cap))

  let res
  try {
    res = await fetch(url.toString())
  } catch (err) {
    throw new Error('Search request failed: network error.')
  }

  if (!res.ok) {
    throw new Error(`Search request failed: HTTP ${res.status}`)
  }

  const data = await res.json()
  return (data.elements || []).map(toResultItem)
}

// Normalize an Overpass element into the shape the UI renders.
// OpenStreetMap does not supply ratings, review counts, or reliable
// live open/closed status, so those fields are intentionally null
// (the UI hides them rather than inventing values).
function toResultItem(el) {
  const tags = el.tags || {}
  const latitude = el.type === 'node' ? el.lat : el.center?.lat
  const longitude = el.type === 'node' ? el.lon : el.center?.lon

  const speciality = [
    tags['healthcare:speciality'],
    tags['clinic:speciality'],
    tags.healthcare,
  ]
    .filter(Boolean)
    .join(';')
    .toLowerCase()

  const isDermatology = /dermatolog|derma/i.test(speciality)

  return {
    name: tags.name || '',
    address: buildAddress(tags),
    // e.g. "node/9874558791" — unique and usable in OSM browse URLs.
    placeId: `${el.type}/${el.id}`,
    rating: null,
    userRatingsTotal: null,
    latitude: typeof latitude === 'number' ? latitude : null,
    longitude: typeof longitude === 'number' ? longitude : null,
    openNow: null,
    weekdayText: null,
    businessStatus: null,
    // Honest labeling: only tag a place as dermatology when the data
    // explicitly says so; everything else is a general healthcare place.
    category: isDermatology ? 'dermatology' : 'healthcare',
  }
}

function buildAddress(tags) {
  if (tags['addr:full']) return tags['addr:full']

  const parts = []
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber'])
  if (tags['addr:street']) parts.push(tags['addr:street'])
  const locality =
    tags['addr:city'] ||
    tags['addr:town'] ||
    tags['addr:suburb'] ||
    tags['addr:district'] ||
    tags['addr:county'] ||
    ''
  if (locality) parts.push(locality)
  if (tags['addr:postcode']) parts.push(tags['addr:postcode'])
  if (tags['addr:state']) parts.push(tags['addr:state'])
  return parts.filter(Boolean).join(', ')
}

function mergeResults(dermatology, healthcare, point) {
  const seen = new Set()
  const combined = []

  for (const item of [...dermatology, ...healthcare]) {
    if (!item.name || item.latitude == null || item.longitude == null) continue
    if (seen.has(item.placeId)) continue
    seen.add(item.placeId)
    combined.push(item)
  }

  combined.sort((a, b) => {
    const da = haversineDistanceMeters(point, a)
    const db = haversineDistanceMeters(point, b)
    return (da == null ? Infinity : da) - (db == null ? Infinity : db)
  })

  return combined.slice(0, MAX_RESULTS)
}

// ---------------------------------------------------------------------------
// Public API (unchanged — the UI depends on this contract)
// ---------------------------------------------------------------------------

// Search for dermatologists / healthcare places near coordinates.
// Requests run sequentially with a short gap between them (never more
// than one Overpass call at a time) to stay within public-instance
// fairness limits.
export async function searchNearbyDermatologists({ latitude, longitude }) {
  const point = { latitude, longitude }
  const dermatology = await runOverpass(
    DERMATOLOGY_CLAUSES,
    DERMATOLOGY_RADIUS_METERS,
    latitude,
    longitude,
    60
  )
  await new Promise((resolve) => window.setTimeout(resolve, OVERPASS_QUERY_GAP_MS))
  const healthcare = await runOverpass(
    HEALTHCARE_CLAUSES,
    HEALTHCARE_RADIUS_METERS,
    latitude,
    longitude,
    120
  )
  return mergeResults(dermatology, healthcare, point)
}

// Manual location search: geocode a city/area string, then search
// around the resolved point. No device location is required.
// Resolves with `{ items, point }` so the UI can show distances from
// the resolved point.
export async function searchDermatologistsByText(query) {
  const trimmed = String(query || '').trim()
  if (!trimmed) {
    return Promise.reject(new Error('Empty location query.'))
  }
  const point = await geocodeQuery(trimmed)
  const items = await searchNearbyDermatologists(point)
  return { items, point }
}

// Whether a geocode lookup failed because the place could not be
// resolved at all (vs. a transient provider error).
export function isLocationNotFoundError(err) {
  return /Location not found/i.test(err?.message || '')
}

// Great-circle distance between two lat/lng points, in meters.
export function haversineDistanceMeters(a, b) {
  if (
    a == null ||
    b == null ||
    a.latitude == null ||
    a.longitude == null ||
    b.latitude == null ||
    b.longitude == null
  ) {
    return null
  }
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Google Maps "Directions" link for a destination point. This is a
// plain web link, not an API call — it works without any key.
export function directionsUrl(latitude, longitude) {
  return (
    'https://www.google.com/maps/dir/?api=1&destination=' +
    `${latitude},${longitude}`
  )
}

// "Open this place on a map" link. Uses OpenStreetMap so the whole
// feature stays provider-neutral. Falls back to the OSM element browse
// page when coordinates are missing.
export function openMapUrl(item) {
  if (item.latitude != null && item.longitude != null) {
    return (
      `https://www.openstreetmap.org/?mlat=${item.latitude}` +
      `&mlon=${item.longitude}#map=17/${item.latitude}/${item.longitude}`
    )
  }
  if (item.placeId) {
    return `https://www.openstreetmap.org/${item.placeId}`
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    item.name || ''
  )}`
}