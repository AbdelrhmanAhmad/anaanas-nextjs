export class LaravelApiError extends Error {
  readonly status: number

  readonly errorCode?: string

  readonly payload?: Record<string, unknown>

  constructor(status: number, message: string, errorCode?: string, payload?: Record<string, unknown>) {
    super(message)
    this.name = 'LaravelApiError'
    this.status = status
    this.errorCode = errorCode
    this.payload = payload
  }
}

export function isLaravelApiError(error: unknown): error is LaravelApiError {
  return error instanceof LaravelApiError
}

export function laravelErrorBody(error: unknown): { body: Record<string, unknown>; status: number } {
  if (isLaravelApiError(error)) {
    return {
      status: error.status,
      body: {
        success: false,
        message: error.message,
        ...(error.errorCode ? { error_code: error.errorCode } : {}),
        ...(error.payload ?? {}),
      },
    }
  }

  return {
    status: 500,
    body: {
      success: false,
      message: error instanceof Error ? error.message : 'Request failed',
    },
  }
}
