<template>
  <Card class="w-full p-4">
    <div class="flex items-start justify-between gap-4">
      <RouterLink
        :to="{ name: 'skillDetails', params: { id: skill.id } }"
        class="flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ skill.name }}</h4>
        <p class="mt-1 text-sm text-muted-foreground">
          Progress: <span class="font-medium">{{ skill.progress }}%</span>
        </p>
      </RouterLink>

      <div class="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          @click="onEdit"
          :disabled="isLocked"
          :class="isLocked ? 'opacity-50 cursor-not-allowed' : ''"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          @click="onDelete"
          :disabled="isLocked"
          :class="isLocked ? 'opacity-50 cursor-not-allowed' : ''"
        >
          Delete
        </Button>
      </div>
    </div>

    <div class="mt-3">
      <SkillProgressBar :value="skill.progress" :label="skill.name" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import SkillProgressBar from './SkillProgressBar.vue'
import type { Skill, SkillId } from '@/types/skill'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ skill: Skill; updatingId?: SkillId | null; deletingId?: SkillId | null }>(),
  { updatingId: null, deletingId: null }
)

const isLocked = computed(
  () => props.updatingId === props.skill.id || props.deletingId === props.skill.id
)

const emits = defineEmits<{
  (e: 'edit', payload: Skill): void
  (e: 'delete', id: SkillId): void
}>()

function onEdit() {
  emits('edit', props.skill)
}

function onDelete() {
  emits('delete', props.skill.id)
}
</script>
