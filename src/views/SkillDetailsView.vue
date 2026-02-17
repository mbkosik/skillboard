<template>
  <DefaultLayout>
    <header class="mb-6 space-y-2">
      <Button variant="ghost" size="sm" @click="goBack"> ← Back to dashboard </Button>

      <h2 class="text-3xl font-bold">Skill details</h2>
      <p class="mt-2 text-sm text-muted-foreground">View and update progress for a single skill.</p>
    </header>

    <section>
      <!-- Loading -->
      <div
        v-if="isLoading"
        class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-muted-foreground">Loading skill…</p>
      </div>

      <!-- Error -->
      <div v-else-if="loadErrorMessage">
        <ErrorBox :message="loadErrorMessage" />
      </div>

      <!-- Content -->
      <div v-else class="grid gap-4">
        <div
          class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ skill?.name }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Current progress: <span class="font-medium">{{ skill?.progress }}%</span>
          </p>

          <div class="mt-3">
            <SkillProgressBar :value="skill?.progress ?? 0" :label="skill?.name" />
          </div>
        </div>

        <form
          @submit.prevent="onSubmit"
          class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-md"
        >
          <h4 class="text-lg font-medium mb-3">Update progress</h4>

          <Label for="progress" class="block text-sm mb-2">Progress (0–100)</Label>
          <Input
            id="progress"
            v-model="progressInput"
            type="number"
            min="0"
            max="100"
            :disabled="mutation.status.value === 'pending'"
            class="mb-2"
          />

          <p v-if="validationError" class="text-sm text-red-600 mb-2">{{ validationError }}</p>

          <div class="flex gap-2">
            <Button
              :disabled="mutation.status.value === 'pending' || !!validationError"
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              @click="resetInput"
              :disabled="mutation.status.value === 'pending'"
            >
              Reset
            </Button>
          </div>

          <p v-if="mutationError" class="text-sm text-red-600 mt-3">{{ mutationError }}</p>
        </form>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ref, computed, watch } from 'vue'
import ErrorBox from '@/components/ui/error/ErrorBox.vue'
import { mapErrorToMessage } from '@/lib/errorMapper'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Skill, SkillId } from '@/types/skill'
import { getSkillById, updateSkill } from '@/api/skills'
import Label from '@/components/ui/label/Label.vue'
import SkillProgressBar from '@/components/skills/SkillProgressBar.vue'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const rawId = route.params.id
const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '')

const {
  data: skillData,
  isLoading,
  error,
} = useQuery<Skill, Error>({
  queryKey: ['skills', id],
  queryFn: () => getSkillById(id),
})

const loadError = computed(() => {
  if (!id || typeof id !== 'string' || !id.trim()) return new Error('Invalid skill id')
  return error.value ?? null
})

const skill = computed(() => skillData.value ?? null)

const progressInput = ref<number | ''>('')

watch(
  skill,
  (s) => {
    progressInput.value = s ? s.progress : ''
  },
  { immediate: true }
)

const validationError = computed(() => {
  if (progressInput.value === '') {
    return 'Progress is required'
  }
  const n = Number(progressInput.value)
  if (!Number.isFinite(n)) return 'Progress must be a number'
  if (n < 0 || n > 100) return 'Progress must be between 0 and 100'
  return ''
})

const mutation = useMutation({
  mutationFn: async (newProgress: number) => {
    if (!skill.value) throw new Error('Skill not loaded')
    return updateSkill(id, { name: skill.value.name, progress: newProgress })
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['skills'] })
    await queryClient.invalidateQueries({ queryKey: ['skills', id] })
  },
})

const mutationError = ref<string | null>(null)

const loadErrorMessage = computed(() => {
  if (!loadError.value) return null
  return mapErrorToMessage(loadError.value)
})

async function onSubmit() {
  mutationError.value = null
  const err = validationError.value
  if (err) return
  const n = Number(progressInput.value)
  try {
    await mutation.mutateAsync(n)
  } catch (e: unknown) {
    mutationError.value = mapErrorToMessage(e)
  }
}

function resetInput() {
  if (skill.value) progressInput.value = skill.value.progress
}

function goBack() {
  router.push({ name: 'dashboard' })
}
</script>
