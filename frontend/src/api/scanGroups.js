// Helpers that adapt the backend /api/scans response into the shapes
// the existing History UI and Results page already understand.
//
// The backend returns a flat list of ScanResponse objects. The History
// UI is organized around "skin concerns" (groups of scans on the same
// body region), so scans are grouped here by patient.region.

import { buildImageUrl } from './imageUrl'

// Build a PredictionResponse-shaped object for the Results page's
// real-result path from a backend ScanResponse.
export function toResultView(scan) {
  const topPredictions = Array.isArray(scan.prediction?.topPredictions)
    ? scan.prediction.topPredictions
    : []

  return {
    scanId: scan.scanId,
    isDemo: false,
    patient: {
      age: scan.patient?.age ?? 0,
      gender: scan.patient?.gender ?? '',
      region: scan.patient?.region ?? '',
    },
    image: {
      fileName: scan.image?.fileName ?? '',
      analyzedAt: scan.createdAt,
      imageUrl: scan.image?.imageUrl ?? '',
    },
    prediction: {
      className: scan.prediction?.className ?? '',
      confidence: scan.prediction?.confidence ?? 0,
      riskLevel: scan.prediction?.riskLevel ?? 'low',
      topPredictions,
    },
    gradcam: {
      available: Boolean(scan.gradcam?.available && scan.gradcam?.imageUrl),
      imageUrl: scan.gradcam?.imageUrl ?? null,
    },
    uncertainty: {
      isUncertain: Boolean(scan.uncertainty?.isUncertain),
      message: scan.uncertainty?.message ?? '',
    },
  }
}

// Absolute, authenticated URL for a scan's stored image, or '' when
// unavailable. Appends the owner's token so the private /static
// endpoint will serve the file.
export function toThumbnailUrl(scan) {
  return buildImageUrl(scan?.image?.imageUrl)
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

function formatHumanDate(iso) {
  try {
    const date = new Date(iso)
    const day = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const time = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })
    return `${day} · ${time}`
  } catch (err) {
    return iso || ''
  }
}

function regionLabel(region) {
  return capitalize(region || 'unspecified')
}

// Map a single backend ScanResponse into the display shape the
// existing History / Compare components consume. The raw backend
// record is kept in `raw` for building the real Results view and
// resolving real images.
export function toScanCard(scan, concernId, concernName) {
  return {
    id: `scan-${scan.scanId}`,
    scanId: scan.scanId,
    concernId,
    concernName,
    bodyRegion: scan.patient?.region || 'unspecified',
    createdAt: formatHumanDate(scan.createdAt),
    timestamp: scan.createdAt,
    image: {
      fileName: scan.image?.fileName ?? '',
      imageUrl: scan.image?.imageUrl ?? '',
    },
    prediction: scan.prediction?.className ?? '',
    confidence: scan.prediction?.confidence ?? 0,
    riskLevel: scan.prediction?.riskLevel ?? 'low',
    raw: scan,
  }
}

// Build a comparison concern + previous/current scan cards from two
// validated backend scans. The newer scan is always the current one.
export function buildCompareSet(previousRaw, currentRaw) {
  const ordered = [previousRaw, currentRaw].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const currentRawScan = ordered[0]
  const previousRawScan = ordered[1]

  const region = currentRawScan?.patient?.region || 'unspecified'
  const concernId = `concern-${region}`
  const concernName = regionLabel(region)

  const previous = toScanCard(previousRawScan, concernId, concernName)
  const current = toScanCard(currentRawScan, concernId, concernName)

  const concern = {
    id: concernId,
    concernName,
    bodyRegion: region,
    scans: [previous, current],
  }

  return { concern, previous, current }
}

// Group a flat list of backend scans into "skin concern" groups keyed
// by body region. Each group is shaped like the existing mock concern
// so the current UI components work unchanged. Scans keep their raw
// backend record in `raw` for building the real Results view.
export function groupScansIntoConcerns(scans) {
  const sorted = [...(scans ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const groups = new Map()

  for (const scan of sorted) {
    const region = scan.patient?.region || 'unspecified'
    if (!groups.has(region)) groups.set(region, [])
    groups.get(region).push(scan)
  }

  const concerns = []

  for (const [region, regionScans] of groups) {
    const concernId = `concern-${region}`
    const concernName = regionLabel(region)

    concerns.push({
      id: concernId,
      concernName,
      bodyRegion: region,
      createdAt: formatHumanDate(regionScans[0].createdAt),
      scans: regionScans.map((scan) => toScanCard(scan, concernId, concernName)),
    })
  }

  return concerns
}
