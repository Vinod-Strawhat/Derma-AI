// Local auth state storage.
//
// Stores the JWT token + user object in localStorage. This is the
// reasonable frontend approach for a stateless JWT in local dev.

const AUTH_STORAGE_KEY = 'dermaai-auth'

export function getStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.token === 'string' && parsed.token) {
      return parsed
    }
    return null
  } catch (err) {
    return null
  }
}

export function getStoredToken() {
  return getStoredAuth()?.token ?? null
}

export function setStoredAuth(auth) {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  } catch (err) {
    // ignore storage errors
  }
}

export function clearStoredAuth() {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch (err) {
    // ignore storage errors
  }
}