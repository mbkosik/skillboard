export interface Skill {
  id: string
  name: string
  progress: number
}

async function handleResponse<T>(res: Response, endpoint: string): Promise<T> {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} when requesting ${endpoint}`)
  }

  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON from ${endpoint}`)
  }

  const data = await res.json()

  return data as T
}

export async function getSkills(): Promise<Skill[]> {
  const endpoint = '/skills'
  const res = await fetch(endpoint)
  return handleResponse<Skill[]>(res, endpoint)
}

export async function getSkillById(id: string): Promise<Skill> {
  const endpoint = `/skills/${id}`
  const res = await fetch(endpoint)
  return handleResponse<Skill>(res, endpoint)
}

export type CreateSkillPayload = {
  name: string
  progress: number
}

export async function createSkill(payload: CreateSkillPayload): Promise<Skill> {
  const endpoint = '/skills'
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return handleResponse<Skill>(res, endpoint)
}

export type UpdateSkillPayload = {
  name: string
  progress: number
}

export async function updateSkill(id: string, payload: UpdateSkillPayload): Promise<Skill> {
  const endpoint = `/skills/${id}`
  const res = await fetch(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return handleResponse<Skill>(res, endpoint)
}

export async function deleteSkill(id: string): Promise<void> {
  const endpoint = `/skills/${id}`
  const res = await fetch(endpoint, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} when requesting ${endpoint}`)
  }
  return
}
