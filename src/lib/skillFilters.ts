import type { Skill } from '@/api/skills'

export type SortParam = 'name_asc' | 'name_desc' | 'progress_asc' | 'progress_desc'
export type ProgressFilter = 'all' | '0-25' | '26-50' | '51-75' | '76-100'

export const VALID_SORTS = ['name_asc', 'name_desc', 'progress_asc', 'progress_desc'] as const
export const VALID_PROGRESS = ['all', '0-25', '26-50', '51-75', '76-100'] as const

export const PROGRESS_RANGES: Record<ProgressFilter, [number, number]> = {
  all: [0, 100],
  '0-25': [0, 25],
  '26-50': [26, 50],
  '51-75': [51, 75],
  '76-100': [76, 100],
}

export function filterSkills(skills: Skill[], progress: ProgressFilter) {
  const [low, high] = PROGRESS_RANGES[progress]
  return skills.filter((s) => s.progress >= low && s.progress <= high)
}

export function sortSkills(skills: Skill[], sort: SortParam) {
  const result = skills.slice()

  const compareByName = (a: Skill, b: Skill) => {
    const r = a.name.localeCompare(b.name)
    return r !== 0 ? r : a.id - b.id
  }

  const compareByProgress = (a: Skill, b: Skill) => {
    const r = a.progress - b.progress
    return r !== 0 ? r : a.id - b.id
  }

  switch (sort) {
    case 'name_asc':
      result.sort(compareByName)
      break
    case 'name_desc':
      result.sort((a, b) => -compareByName(a, b))
      break
    case 'progress_asc':
      result.sort(compareByProgress)
      break
    case 'progress_desc':
      result.sort((a, b) => -compareByProgress(a, b))
      break
    default:
      result.sort(compareByName)
  }

  return result
}
