const FALLBACK_MESSAGE = 'Something went wrong.'
const NETWORK_MESSAGE = 'Network error. Please try again later.'
const NOT_FOUND_MESSAGE = 'Resource not found.'
const INVALID_INPUT_MESSAGE = 'Invalid input data.'

const NETWORK_REGEX = /failed to fetch|network error|network request/i

function mapStatusToMessage(status: number): string {
  switch (status) {
    case 404:
      return NOT_FOUND_MESSAGE
    case 400:
    case 422:
      return INVALID_INPUT_MESSAGE
    case 500:
      return NETWORK_MESSAGE
    default:
      return FALLBACK_MESSAGE
  }
}

function hasResponseWithStatus(err: unknown): err is { response: { status: number } } {
  if (typeof err !== 'object' || err === null) return false
  const rec = err as Record<string, unknown>
  if (!('response' in rec)) return false
  const resp = rec.response
  if (typeof resp !== 'object' || resp === null) return false
  const respRec = resp as Record<string, unknown>
  return 'status' in respRec && typeof respRec.status === 'number'
}

function extractStatus(error: unknown): number | null {
  if (hasResponseWithStatus(error)) return error.response.status

  if (error instanceof Error) {
    const message = error.message ?? ''
    const httpMatch = message.match(/HTTP\s*(\d{3})/i)
    if (httpMatch) return Number(httpMatch[1])
  }

  return null
}

export function mapErrorToMessage(error: unknown): string {
  if (!error) return FALLBACK_MESSAGE

  const status = extractStatus(error)
  if (status !== null) return mapStatusToMessage(status)

  if (error instanceof Error) {
    const message = error.message ?? ''
    if (NETWORK_REGEX.test(message)) return NETWORK_MESSAGE
  }

  return FALLBACK_MESSAGE
}
