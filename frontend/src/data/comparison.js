import { mockSkinConcerns } from './mockHistory'

export function getConcernById(concernId) {
  return mockSkinConcerns.find((concern) => concern.id === concernId) ?? null
}

export function getScanById(concern, scanId) {
  return concern?.scans.find((scan) => scan.id === scanId) ?? null
}

export function buildComparison({ concern, previousScan, currentScan }) {
  if (!concern || !previousScan || !currentScan) return null

  const previousTimestamp = new Date(previousScan.timestamp)
  const currentTimestamp = new Date(currentScan.timestamp)
  const elapsedMs = currentTimestamp - previousTimestamp
  const elapsedDays = Math.max(0, Math.round(elapsedMs / (1000 * 60 * 60 * 24)))

  const riskChanged = previousScan.riskLevel !== currentScan.riskLevel
  const predictionChanged = previousScan.prediction !== currentScan.prediction
  const confidenceDiff =
    ((currentScan.confidence ?? 0) - (previousScan.confidence ?? 0)) * 100

  const regionLabel =
    concern.bodyRegion.charAt(0).toUpperCase() + concern.bodyRegion.slice(1)

  return {
    concern: {
      id: concern.id,
      name: concern.concernName,
      bodyRegion: concern.bodyRegion,
      bodyRegionLabel: regionLabel,
      scanCount: concern.scans.length,
    },
    previousScan: {
      ...previousScan,
      confidencePercent: ((previousScan.confidence ?? 0) * 100).toFixed(1),
    },
    currentScan: {
      ...currentScan,
      confidencePercent: ((currentScan.confidence ?? 0) * 100).toFixed(1),
    },
    metrics: {
      riskChanged,
      predictionChanged,
      confidenceDiff,
      elapsedDays,
    },
  }
}

export function sortScansByDateDesc(scans = []) {
  return [...scans].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function defaultScanSelection(concern) {
  const sorted = sortScansByDateDesc(concern?.scans ?? [])
  if (sorted.length < 2) return null
  return {
    currentScan: sorted[0],
    previousScan: sorted[1],
  }
}