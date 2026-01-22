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
        <Button size="sm" variant="ghost" @click="onEdit">Edit</Button>
        <Button size="sm" variant="destructive" @click="onDelete">Delete</Button>
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
