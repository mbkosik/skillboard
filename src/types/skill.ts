export type SkillId = string

export interface Skill {
  id: SkillId
  name: string
  progress: number
}

export interface CreateSkillPayload {
  name: string
  progress: number
}

export interface UpdateSkillPayload {
  name?: string
  progress?: number
}
