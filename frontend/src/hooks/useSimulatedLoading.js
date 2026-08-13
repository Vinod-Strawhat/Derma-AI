import { useEffect, useState } from 'react'

export function useSimulatedLoading(delayMs = 500) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), delayMs)
    return () => clearTimeout(id)
  }, [delayMs])

  return loading
}