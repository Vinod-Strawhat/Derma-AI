import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../data/translations'
import { languages } from '../data/languages'

const LANGUAGE_KEY = 'dermaai-language'
const DEFAULT_LANGUAGE = 'en'

const LanguageContext = createContext(null)

function getInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY)
    if (stored && languages.some((lang) => lang.code === stored)) {
      return stored
    }
  } catch (err) {
    // localStorage unavailable — fall back to default
  }
  return DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language)
    } catch (err) {
      // ignore storage errors
    }
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((code) => {
    if (languages.some((lang) => lang.code === code)) {
      setLanguageState(code)
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      const dict = translations[language] || translations[DEFAULT_LANGUAGE] || {}
      const fallback = translations[DEFAULT_LANGUAGE] || {}
      const path = String(key).split('.')

      let value = path.reduce((obj, part) => (obj == null ? undefined : obj[part]), dict)
      if (typeof value !== 'string' && !Array.isArray(value)) {
        value = path.reduce((obj, part) => (obj == null ? undefined : obj[part]), fallback)
      }

      if (Array.isArray(value)) return value

      if (typeof value === 'string' && vars) {
        Object.keys(vars).forEach((name) => {
          value = value.split(`{${name}}`).join(String(vars[name]))
        })
      }

      return value ?? key
    },
    [language]
  )

  const capitalize = useCallback(
    (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : ''),
    []
  )

  const value = useMemo(
    () => ({ language, setLanguage, t, capitalize }),
    [language, setLanguage, t, capitalize]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export { LANGUAGE_KEY }