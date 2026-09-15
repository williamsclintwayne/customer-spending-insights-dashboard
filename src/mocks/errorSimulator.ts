import { ref } from 'vue'

import { ApiError } from '@/services/apiError'

export interface ErrorScenario {
  label: string
  error: ApiError | null
}

export const ERROR_SCENARIOS: Record<string, ErrorScenario> = {
  none: { label: 'No error (default)', error: null },
  net: {
    label: 'Network error',
    error: new ApiError('NETWORK_ERROR', null, 'Network request failed. Check your connection.'),
  },
  s400: {
    label: '400 Bad Request',
    error: new ApiError('BAD_REQUEST', 400, 'The request contained invalid parameters.'),
  },
  s401: {
    label: '401 Unauthorized',
    error: new ApiError('UNAUTHORIZED', 401, 'Your session has expired. Please sign in again.'),
  },
  s403: {
    label: '403 Forbidden',
    error: new ApiError('FORBIDDEN', 403, 'You do not have permission to view this data.'),
  },
  s404: {
    label: '404 Not Found',
    error: new ApiError('NOT_FOUND', 404, 'The spending data service could not be found.'),
  },
  s429: {
    label: '429 Rate Limited',
    error: new ApiError('RATE_LIMITED', 429, 'Too many requests. Please wait before trying again.'),
  },
  s500: {
    label: '500 Server Error',
    error: new ApiError('SERVER_ERROR', 500, 'A server error occurred. Please try again.'),
  },
  s503: {
    label: '503 Unavailable',
    error: new ApiError('SERVICE_UNAVAILABLE', 503, 'The service is temporarily unavailable.'),
  },
}

export const selectedScenarioKey = ref<string>('none')

export function getSimulatedError(): ApiError | null {
  const scenario = ERROR_SCENARIOS[selectedScenarioKey.value]
  return scenario?.error ?? null
}
