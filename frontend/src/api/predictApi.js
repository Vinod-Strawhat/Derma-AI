// Predict API client.
//
// Uses VITE_API_URL to enable real API mode. When it is set, the
// Analyze flow calls the real FastAPI backend. When it is empty,
// the frontend stays in demo mode (mock data).

import { getStoredToken } from './authStorage'

export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const API_MODE = Boolean(API_URL)

const REQUEST_TIMEOUT_MS = 60000

const errorCodes = ['network', 'timeout', 'invalidInput', 'unauthorized', 'serverError', 'malformedResponse']

export class ApiError extends Error {
  constructor(code, detail = '') {
    super(detail || code)
    this.name = 'ApiError'
    this.code = errorCodes.includes(code) ? code : 'serverError'
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
export async function analyzeSkin({ file, age, gender, region }) {
  const form = new FormData()
  form.append('file', file)
  form.append('age', String(age))
  form.append('gender', gender)
  form.append('region', region)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const headers = {}
  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers,
      body: form,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new ApiError('timeout', 'Request timed out.')
    }
    throw new ApiError('network', 'Failed to reach the analysis service.')
  }
  clearTimeout(timeoutId)

  if (response.status === 400) {
    throw new ApiError('invalidInput', await readDetail(response))
  }
  if (response.status === 401) {
    throw new ApiError('unauthorized', await readDetail(response))
  }
  if (response.status === 422) {
    throw new ApiError('invalidInput', await readDetail(response))
  }
  if (response.status === 500 || !response.ok) {
    throw new ApiError('serverError', await readDetail(response))
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    throw new ApiError('malformedResponse', 'Response was not valid JSON.')
  }

  const ok =
    data &&
    typeof data === 'object' &&
    data.prediction &&
    typeof data.prediction.className === 'string' &&
    Array.isArray(data.prediction.topPredictions)

  if (!ok) {
    throw new ApiError('malformedResponse', 'Unexpected response structure.')
  }

  return data
}