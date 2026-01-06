export interface Skill {
  id: number
  name: string
  progress: number
}

async function handleResponse<T>(res: Response, endpoint: string): Promise<T> {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} when requesting ${endpoint}`)
  }

  const data = await res.json()

  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON from ${endpoint}`)
  }

  return data as T
}

export async function getSkills(): Promise<Skill[]> {
  const endpoint = '/skills'
  const res = await fetch(endpoint)
  return handleResponse<Skill[]>(res, endpoint)
}

export async function getSkillById(id: number): Promise<Skill> {
  const endpoint = `/skills/${id}`
  const res = await fetch(endpoint)
  return handleResponse<Skill>(res, endpoint)
}
