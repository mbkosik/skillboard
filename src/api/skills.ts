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
