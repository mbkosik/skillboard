<template>
  <DefaultLayout>
    <header class="mb-6 space-y-2">
      <Button variant="ghost" size="sm" @click="goBack"> ← Back to dashboard </Button>

      <h2 class="text-3xl font-bold">Skill details</h2>
      <p class="mt-2 text-sm text-muted-foreground">View and update progress for a single skill.</p>
    </header>

    <section>
      <!-- Loading -->
      <div v-if="isLoading">
        <SkillDetailsSkeleton />
      </div>

      <!-- Errors -->
      <div v-else-if="!isValidId">
        <ErrorBox :message="'Invalid skill id'" />
      </div>

      <div v-else-if="loadErrorMessage">
        <ErrorBox :message="loadErrorMessage" />
      </div>

      <!-- Content -->
      <div v-else class="grid gap-4">
        <Card class="p-6">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ skill?.name }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Current progress: <span class="font-medium">{{ skill?.progress }}%</span>
          </p>

          <div class="mt-3">
            <SkillProgressBar :value="skill?.progress ?? 0" :label="skill?.name" />
          </div>
        </Card>

        <Card class="p-6 max-w-md">
          <form @submit.prevent="onSubmit">
            <h4 class="text-lg font-medium mb-3">Update progress</h4>

            <Label for="progress" class="block text-sm mb-2">Progress (0–100)</Label>
            <Input
              id="progress"
              v-model="progressInput"
              type="number"
              min="0"
              max="100"
              :disabled="isUpdating"
              class="mb-2"
            />

            <p v-if="validationError" class="text-sm text-red-600 mb-2">{{ validationError }}</p>

            <div class="flex gap-2">
              <Button :disabled="isUpdating || !!validationError" type="submit">Save</Button>
              <Button variant="ghost" @click="resetInput" :disabled="isUpdating">Reset</Button>
            </div>

            <p v-if="mutationError" class="text-sm text-red-600 mt-3">{{ mutationError }}</p>
          </form>
        </Card>
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
import SkillDetailsSkeleton from '@/components/skills/SkillDetailsSkeleton.vue'
import { Card } from '@/components/ui/card'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const rawId = route.params.id
const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '')

const isValidId = computed(() => !!id && !!id.trim())

const {
  data: skillData,
  isLoading,
  error,
} = useQuery<Skill, Error>({
  queryKey: ['skills', id],
  queryFn: () => getSkillById(id),
  enabled: isValidId.value,
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

const validationError = computed<string | null>(() => {
  if (progressInput.value === '') {
    return 'Progress is required'
  }
  const n = Number(progressInput.value)
  if (!Number.isFinite(n)) return 'Progress must be a number'
  if (n < 0 || n > 100) return 'Progress must be between 0 and 100'
  return null
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

const isUpdating = computed(() => mutation.status.value === 'pending')

const mutationError = ref<string | null>(null)

const loadErrorMessage = computed(() => {
  if (!error.value) return null
  return mapErrorToMessage(error.value)
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
