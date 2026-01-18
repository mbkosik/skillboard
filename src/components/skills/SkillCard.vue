<template>
  <Card class="w-full p-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ skill.name }}</h4>
        <p class="mt-1 text-sm text-muted-foreground">
          Progress: <span class="font-medium">{{ skill.progress }}%</span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button size="sm" variant="ghost" @click="onEdit">Edit</Button>
        <Button size="sm" variant="destructive" @click="onDelete">Delete</Button>
      </div>
    </div>

    <!-- TODO: derive progress color from value -->
    <div
      class="mt-3"
      role="progressbar"
      :aria-valuenow="skill.progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`${skill.name} progress`"
    >
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-2 bg-indigo-600 dark:bg-indigo-400"
          :style="{ width: skill.progress + '%' }"
        ></div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Skill } from '@/api/skills'

const { skill } = defineProps<{ skill: Skill }>()
const emits = defineEmits<{
  (e: 'edit', payload: Skill): void
  (e: 'delete', id: number): void
}>()

function onEdit() {
  emits('edit', skill)
}

function onDelete() {
  emits('delete', skill.id)
}
</script>
