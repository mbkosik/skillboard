<template>
  <DefaultLayout>
    <header class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold">My Skills</h2>
        <p class="mt-2 text-sm text-muted-foreground">Overview of your skills and progress.</p>
      </div>

      <div>
        <CreateSkillModal :loading="isPending" @create="handleCreate" />
      </div>
    </header>

    <section aria-labelledby="skills-heading" class="grid gap-4">
      <Card class="p-4">
        <SkillsFilters v-model:sort="sort" v-model:progress="progress" />
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
import { ref, computed } from 'vue'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import SkillsFilters from '@/components/skills/SkillsFilters.vue'
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

const queryClient = useQueryClient()

const { data, isLoading, error } = useQuery<Skill[], Error>({
  queryKey: ['skills'],
  queryFn: getSkills,
})

const { mutateAsync: mutateCreateSkill, isPending } = useMutation({
  mutationFn: (payload: CreateSkillPayload) => createSkill(payload),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['skills'] })
  },
})

const selectedSkill = ref<Skill | null>(null)
const editOpen = ref(false)
const deleteSkillCandidate = ref<Skill | null>(null)
const deleteOpen = ref(false)

const route = useRoute()
const router = useRouter()

const sort = computed<SortParam>({
  get() {
    const q = route.query
    const s = Array.isArray(q.sort) ? q.sort[0] : (q.sort as string | undefined)
    return VALID_SORTS.includes(s as any) ? (s as SortParam) : 'name_asc'
  },
  set(v) {
    router.replace({ query: { ...(route.query || {}), sort: v } })
  },
})

const progress = computed<ProgressFilter>({
  get() {
    const q = route.query
    const p = Array.isArray(q.progress) ? q.progress[0] : (q.progress as string | undefined)
    return VALID_PROGRESS.includes(p as any) ? (p as ProgressFilter) : 'all'
  },
  set(v) {
    router.replace({ query: { ...(route.query || {}), progress: v } })
  },
})

const skillsRaw = computed(() => data?.value ?? [])

const filteredAndSorted = computed(() => {
  const filtered = filterSkills(skillsRaw.value, progress.value as ProgressFilter)
  return sortSkills(filtered, sort.value as SortParam)
})

const { mutateAsync: mutateUpdateSkill, isPending: isUpdating } = useMutation({
  mutationFn: ({ id, payload }: { id: number; payload: UpdateSkillPayload }) =>
    updateSkill(id, payload),
  onMutate: async ({ id, payload }) => {
    await queryClient.cancelQueries({ queryKey: ['skills'] })
    const previous = queryClient.getQueryData<Skill[]>(['skills'])

    queryClient.setQueryData<Skill[] | undefined>(['skills'], (old) =>
      old ? old.map((s) => (s.id === id ? { ...s, ...payload } : s)) : old
    )

    return { previous }
  },
  onError: (_err, _vars, context) => {
    if (context?.previous) {
      queryClient.setQueryData(['skills'], context.previous)
    }
  },
  onSettled: async () => {
    await queryClient.invalidateQueries({ queryKey: ['skills'] })
  },
})

const { mutateAsync: mutateDeleteSkill, isPending: isDeleting } = useMutation({
  mutationFn: (id: number) => deleteSkill(id),
  onMutate: async (id: number) => {
    await queryClient.cancelQueries({ queryKey: ['skills'] })
    const previous = queryClient.getQueryData<Skill[]>(['skills'])

    queryClient.setQueryData<Skill[] | undefined>(['skills'], (old) =>
      old ? old.filter((s) => s.id !== id) : old
    )

    return { previous }
  },
  onError: (_err, _vars, context) => {
    if (context?.previous) {
      queryClient.setQueryData(['skills'], context.previous)
    }
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

function openDeleteDialog(id: number) {
  const skill = data?.value?.find((s) => s.id === id) ?? null
  deleteSkillCandidate.value = skill
  deleteOpen.value = true
}

async function handleUpdate(payload: { id: number; name: string; progress: number }) {
  await mutateUpdateSkill({
    id: payload.id,
    payload: { name: payload.name, progress: payload.progress },
  })
}

async function handleDeleteConfirmed(id: number) {
  await mutateDeleteSkill(id)
}
</script>
