import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { API_MODE } from '../api/predictApi'
import { fetchMe, login as apiLogin, signup as apiSignup } from '../api/authApi'
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../api/authStorage'

const AuthContext = createContext(null)

function demoUser(name, email) {
  return {
    id: 0,
    name: name || 'Demo User',
    email: email || 'demo@example.com',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Restore a stored session on mount. In API mode the token is
  // validated against /api/auth/me; in demo mode the stored session
  // is trusted without a network call.
  useEffect(() => {
    const stored = getStoredAuth()

    if (!stored) {
      setReady(true)
      return
    }

    setUser(stored.user ?? null)

    if (!API_MODE) {
      setReady(true)
      return
    }

    fetchMe()
      .then((meUser) => {
        setUser(meUser)
        setStoredAuth({ token: stored.token, user: meUser })
      })
      .catch(() => {
        clearStoredAuth()
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    if (!API_MODE) {
      const auth = { token: 'demo-token', user: demoUser('Demo User', email) }
      setStoredAuth(auth)
      setUser(auth.user)
      return auth.user
    }

    const data = await apiLogin({ email, password })
    setStoredAuth({ token: data.token, user: data.user })
    setUser(data.user)
    return data.user
  }, [])

  const signUp = useCallback(async ({ name, email, password, preferredLanguage }) => {
    if (!API_MODE) {
      const auth = { token: 'demo-token', user: demoUser(name, email) }
      setStoredAuth(auth)
      setUser(auth.user)
      return auth.user
    }

    await apiSignup({ name, email, password, preferredLanguage })
    // Auto sign-in after creating the account.
    const data = await apiLogin({ email, password })
    setStoredAuth({ token: data.token, user: data.user })
    setUser(data.user)
    return data.user
  }, [])

  const logOut = useCallback(() => {
    clearStoredAuth()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      ready,
      signIn,
      signUp,
      logOut,
    }),
    [user, ready, signIn, signUp, logOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}