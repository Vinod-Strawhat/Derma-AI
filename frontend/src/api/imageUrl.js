// Builds absolute, authenticated URLs for scan / Grad-CAM images.
//
// The backend serves images only to their owner, so the current auth
// token is appended as an `access_token` query parameter (img tags
// cannot send Authorization headers). The token is never logged by
// the frontend.

import { API_URL } from './predictApi'
import { getStoredToken } from './authStorage'

export function buildImageUrl(relativeUrl) {
  if (!relativeUrl) return ''

  const base = relativeUrl.startsWith('http')
    ? relativeUrl
    : `${API_URL}${relativeUrl}`

  const token = getStoredToken()
  if (!token) return base

  const separator = base.includes('?') ? '&' : '?'

  return `${base}${separator}access_token=${encodeURIComponent(token)}`
}
