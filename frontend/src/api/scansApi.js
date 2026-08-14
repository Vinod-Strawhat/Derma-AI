// Scans API client (authenticated).
//
// GET /api/scans returns only the current user's scans; the Bearer
// token is attached automatically from stored auth state.

import { API_URL } from './predictApi'
import { getStoredToken } from './authStorage'

const REQUEST_TIMEOUT_MS = 60000

export class ScansError extends Error {
  constructor(status, detail = '') {
    super(detail || 'Failed to load scans.')
    this.name = 'ScansError'
    this.status = status
    this.detail = detail
  }
}

async function readDetail(response) {
  try {
    const data = await response.json()
    if (typeof data?.detail === 'string') return data.detail
    if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      return data.detail[0].msg
    }
  } catch (err) {
    // ignore parse failures
  }
  return ''
}

export async function fetchMyScans() {
  const token = getStoredToken()
  if (!token) return []

  const response = await fetch(`${API_URL}/api/scans`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('Failed to load scans.')
  }

  const data = await response.json()
  return data.scans ?? []
}

// Fetch a validated pair of scans for comparison.
//
// The backend validates ownership, that the two scans are different,
// and that both belong to the same body region. The response is
// ordered newest-first. Rejects with ScansError carrying the HTTP
// status so callers can show the right message.
export async function fetchCompareScans(firstId, secondId) {
  const token = getStoredToken()
  if (!token) throw new ScansError(401, 'Not authenticated.')

  const params = new URLSearchParams({
    first_id: String(firstId),
    second_id: String(secondId),
  })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response
  try {
    response = await fetch(`${API_URL}/api/scans/compare?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new ScansError(0, 'Request timed out.')
    }
    throw new ScansError(0, 'Failed to reach the server.')
  }
  clearTimeout(timeoutId)

  if (!response.ok) {
    throw new ScansError(response.status, await readDetail(response))
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    throw new ScansError(0, 'Response was not valid JSON.')
  }

  return data
}