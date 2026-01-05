export interface AuthUser {
  id: number | string
  email: string
}

export class AuthError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'AuthError'
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseAuthUser(record: unknown): { id: number | string; email: string; password: string } {
  if (!isObject(record)) {
    throw new Error('Malformed user record: not an object')
  }

  const { id, email, password } = record as Record<string, unknown>

  if (typeof id !== 'string' && typeof id !== 'number') {
    throw new Error('Malformed user record: invalid id')
  }

  if (typeof email !== 'string') {
    throw new Error('Malformed user record: missing email')
  }

  if (typeof password !== 'string' && typeof password !== 'number') {
    throw new Error('Malformed user record: missing password')
  }

  return { id, email, password: String(password) }
}

function generateAuthToken(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)
}

export async function login(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string }> {
  const url = `/users?email=${encodeURIComponent(email)}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    throw new Error(`Network error while contacting auth endpoint: ${String(err)}`)
  }

  if (!res.ok) {
    throw new Error(`Auth API returned HTTP ${res.status}`)
  }

  let data: unknown
  try {
    data = await res.json()
  } catch (err) {
    throw new Error(`Failed to parse auth response: ${String(err)}`)
  }

  if (!Array.isArray(data)) {
    throw new Error('Unexpected auth response format')
  }

  const record = data[0]
  if (!record) {
    throw new AuthError('User not found')
  }

  const parsed = parseAuthUser(record)

  if (parsed.password !== String(password)) {
    throw new AuthError('Invalid credentials')
  }

  const user: AuthUser = { id: parsed.id, email: parsed.email }
  const token = generateAuthToken()

  return { user, token }
}

export default { login }
