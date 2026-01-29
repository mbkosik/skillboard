<template>
  <DefaultLayout>
    <header class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold">My Skills</h2>
        <p class="mt-2 text-sm text-muted-foreground">Overview of your skills and progress.</p>
      </div>

      <div>
        <CreateSkillModal
          :open="createOpen"
          @update:open="(v) => (createOpen = v)"
          :loading="isCreating"
          @create="handleCreate"
        />
      </div>
    </header>

    <section aria-labelledby="skills-heading" class="grid gap-4">
      <Card class="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div class="w-full sm:w-96">
          <Input v-model="rawSearch" aria-label="Search skills" placeholder="Search skills" />
        </div>
        <div class="ml-auto flex items-center gap-2">
          <SkillsFilters v-model:sort="sort" v-model:progress="progress" />
          <Button variant="ghost" size="sm" :disabled="!hasActiveFilters" @click="resetFilters">
            Reset
          </Button>
        </div>
      </Card>

      <h3 id="skills-heading" class="text-lg font-medium mb-2">Skills list</h3>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-muted-foreground">Loading skills…</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-6 border rounded-lg bg-red-50 text-red-700 border-red-200">
        <p class="text-sm">Failed to load skills: {{ error.message }}</p>
      </div>

      <!-- Empty state: no skills at all -->
      <div
        v-else-if="data && data.length === 0"
        class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-muted-foreground">
          No skills yet. Add your first skill to get started.
        </p>
      </div>

      <!-- Empty state: no skills match filters -->
      <div
        v-else-if="data && filteredAndSorted.length === 0"
        class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-muted-foreground">No skills match the selected filters.</p>
      </div>

      <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <SkillCard
          v-for="skill in filteredAndSorted"
          :key="skill.id"
          :skill="skill"
          @edit="openEditModal"
          @delete="openDeleteDialog"
        />
      </div>
    </section>

    <EditSkillModal
      :skill="selectedSkill"
      :open="editOpen"
      :loading="isUpdating"
      @update="handleUpdate"
      @update:open="(v) => (editOpen = v)"
    />

    <DeleteConfirmDialog
      :skill="deleteSkillCandidate"
      :open="deleteOpen"
      :loading="isDeleting"
      @confirm="handleDeleteConfirmed"
      @update:open="(v) => (deleteOpen = v)"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref, computed, watch } from 'vue'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import { useRouteQueryParam } from '@/composables/useRouteQueryParam'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/composables/useDebounce'
import { toastSuccess, toastError } from '@/lib/toast'
import SkillsFilters from '@/components/skills/SkillsFilters.vue'
import { Button } from '@/components/ui/button'
import {
  filterSkills,
  sortSkills,
  VALID_SORTS,
  VALID_PROGRESS,
  type SortParam,
  type ProgressFilter,
} from '@/lib/skillFilters'
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  type Skill,
  type CreateSkillPayload,
  type UpdateSkillPayload,
} from '@/api/skills'
import SkillCard from '@/components/skills/SkillCard.vue'
import CreateSkillModal from '@/components/skills/CreateSkillModal.vue'
import EditSkillModal from '@/components/skills/EditSkillModal.vue'
import DeleteConfirmDialog from '@/components/skills/DeleteConfirmDialog.vue'
import { Card } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const queryClient = useQueryClient()
const router = useRouter()

const { data, isLoading, error } = useQuery<Skill[], Error>({
  queryKey: ['skills'],
  queryFn: getSkills,
})

const createOpen = ref(false)

const { mutateAsync: mutateCreateSkill, isPending: isCreating } = useMutation({
  mutationFn: (payload: CreateSkillPayload) => createSkill(payload),
  onMutate: async (payload: CreateSkillPayload) => {
    await queryClient.cancelQueries({ queryKey: ['skills'] })
    const previous = queryClient.getQueryData<Skill[]>(['skills'])

    const optimisticId = `temp-${Date.now()}`
    const optimistic: Skill = { id: optimisticId, name: payload.name, progress: payload.progress }

    queryClient.setQueryData<Skill[] | undefined>(['skills'], (old) =>
      old ? [optimistic, ...old] : [optimistic]
    )

    return { previous, optimisticId }
  },
  onSuccess: (data: Skill, _vars, context: any) => {
    queryClient.setQueryData<Skill[] | undefined>(['skills'], (old) =>
      old ? old.map((s) => (s.id === context?.optimisticId ? data : s)) : old
    )
    toastSuccess('Skill created')
    createOpen.value = false
  },
  onError: (err: unknown, _vars, context: any) => {
    if (context?.previous) {
      queryClient.setQueryData(['skills'], context.previous)
    }
    const msg = (err as Error)?.message ?? 'Failed to create skill'
    toastError(msg)
  },
  onSettled: async () => {
    await queryClient.invalidateQueries({ queryKey: ['skills'] })
  },
})

const selectedSkill = ref<Skill | null>(null)
const editOpen = ref(false)
const deleteSkillCandidate = ref<Skill | null>(null)
const deleteOpen = ref(false)

const sort = useRouteQueryParam<SortParam>('sort', {
  default: 'name_asc',
  allowed: VALID_SORTS,
})

const progress = useRouteQueryParam<ProgressFilter>('progress', {
  default: 'all',
  allowed: VALID_PROGRESS,
})

const search = useRouteQueryParam<string>('q', {
  default: '',
})

const rawSearch = ref<string>(search.value ?? '')
const debouncedSearch = useDebounce(rawSearch, 300)

watch(debouncedSearch, (v) => {
  const val = (v ?? '') as string
  if (val !== search.value) search.value = val
})

watch(
  () => search.value,
  (v) => {
    const val = v ?? ''
    if (val !== rawSearch.value) rawSearch.value = val
  }
)

const hasActiveFilters = computed(
  () => search.value !== '' || sort.value !== 'name_asc' || progress.value !== 'all'
)

function resetFilters() {
  rawSearch.value = ''
  router.replace({ query: {} })
}

const skillsRaw = computed(() => data?.value ?? [])

const filteredAndSorted = computed(() => {
  const afterProgress = filterSkills(skillsRaw.value, progress.value as ProgressFilter)

  const q = search.value.trim().toLowerCase() ?? ''
  const afterSearch = q
    ? afterProgress.filter((s) => s.name.toLowerCase().includes(q))
    : afterProgress

  return sortSkills(afterSearch, sort.value as SortParam)
})

const { mutateAsync: mutateUpdateSkill, isPending: isUpdating } = useMutation({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateSkillPayload }) =>
    updateSkill(id, payload),
  onMutate: async ({ id, payload }) => {
    await queryClient.cancelQueries({ queryKey: ['skills'] })
    const previous = queryClient.getQueryData<Skill[]>(['skills'])

    queryClient.setQueryData<Skill[] | undefined>(['skills'], (old) =>
      old ? old.map((s) => (s.id === id ? { ...s, ...payload } : s)) : old
    )

    return { previous }
  },
  onError: (err, _vars, context) => {
    if (context?.previous) {
      queryClient.setQueryData(['skills'], context.previous)
    }
    const msg = (err as Error)?.message ?? 'Failed to update skill'
    toastError(msg)
  },
  onSuccess: async () => {
    toastSuccess('Skill updated')
  },
  onSettled: async () => {
    await queryClient.invalidateQueries({ queryKey: ['skills'] })
  },
})

const { mutateAsync: mutateDeleteSkill, isPending: isDeleting } = useMutation({
  mutationFn: (id: string) => deleteSkill(id),
  onMutate: async (id: string) => {
    await queryClient.cancelQueries({ queryKey: ['skills'] })
    const previous = queryClient.getQueryData<Skill[]>(['skills'])

    queryClient.setQueryData<Skill[] | undefined>(['skills'], (old) =>
      old ? old.filter((s) => s.id !== id) : old
    )

    return { previous }
  },
  onError: (err, _vars, context) => {
    if (context?.previous) {
      queryClient.setQueryData(['skills'], context.previous)
    }
    const msg = (err as Error)?.message ?? 'Failed to delete skill'
    toastError(msg)
  },
  onSuccess: async () => {
    toastSuccess('Skill deleted')
  },
  onSettled: async () => {
    await queryClient.invalidateQueries({ queryKey: ['skills'] })
  },
})

async function handleCreate(payload: CreateSkillPayload) {
  await mutateCreateSkill(payload)
}

function openEditModal(skill: Skill) {
  selectedSkill.value = skill
  editOpen.value = true
}

function openDeleteDialog(id: string) {
  const skill = data?.value?.find((s) => s.id === id) ?? null
  deleteSkillCandidate.value = skill
  deleteOpen.value = true
}

async function handleUpdate(payload: { id: string; name: string; progress: number }) {
  await mutateUpdateSkill({
    id: payload.id,
    payload: { name: payload.name, progress: payload.progress },
  })
}

async function handleDeleteConfirmed(id: string) {
  await mutateDeleteSkill(id)
}
</script>
