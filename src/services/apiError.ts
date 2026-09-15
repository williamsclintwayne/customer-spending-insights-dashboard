export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'UNKNOWN'

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly statusCode: number | null,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
