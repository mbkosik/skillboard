function mapStatusToMessage(status: number): string {
  if (status === 404) return 'Resource not found.'
  if (status === 400 || status === 422) return 'Invalid input data.'
  if (status >= 500) return 'Network error. Please try again later.'
  return 'Something went wrong.'
}

export function mapErrorToMessage(error: unknown): string {
  const fallback = 'Something went wrong.'

  if (!error) return fallback

  if (error instanceof Error) {
    const message = error.message ?? ''

    if (/failed to fetch|network error|network request/i.test(message)) {
      return 'Network error. Please try again later.'
    }

    const httpMatch = message.match(/HTTP\s*(\d{3})/i)
    if (httpMatch) {
      return mapStatusToMessage(Number(httpMatch[1]))
    }

    return fallback
  }

  try {
    const anyErr = error as any
    const status = anyErr?.response?.status

    if (typeof status === 'number') {
      return mapStatusToMessage(status)
    }
  } catch {}

  return fallback
}
