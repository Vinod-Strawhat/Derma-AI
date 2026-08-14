// Auth API client.
//
// Only used in real API mode (VITE_API_URL set). Every request sends
// the stored token as: Authorization: Bearer <token>

import { API_URL } from './predictApi'
import { getStoredToken } from './authStorage'

const REQUEST_TIMEOUT_MS = 60000

export class AuthError extends Error {
  constructor(status, detail = '') {
    super(detail || 'Auth request failed.')
    this.name = 'AuthError'
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

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new AuthError(0, 'Request timed out.')
    }
    throw new AuthError(0, 'Failed to reach the server.')
  }
  clearTimeout(timeoutId)

  const detail = await readDetail(response)

  if (!response.ok) {
    throw new AuthError(response.status, detail || 'Request failed.')
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    throw new AuthError(0, 'Response was not valid JSON.')
  }

  return data
}

export function signup({ name, email, password, preferredLanguage }) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, preferredLanguage }),
  })
}

export function login({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchMe() {
  return request('/api/auth/me')
}