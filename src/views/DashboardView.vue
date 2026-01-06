<template>
  <DefaultLayout>
    <header class="mb-6">
      <h2 class="text-3xl font-bold">My Skills</h2>
      <p class="mt-2 text-sm text-muted-foreground">Overview of your skills and progress.</p>
    </header>

    <section aria-labelledby="skills-heading" class="grid gap-4">
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

      <!-- Empty state -->
      <div
        v-else-if="data && data.length === 0"
        class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-muted-foreground">
          No skills yet. Add your first skill to get started.
        </p>
      </div>

      <!-- Data state -->
      <!-- TODO: replace with <SkillCard /> -->
      <ul v-else class="space-y-3">
        <li
          v-for="skill in data"
          :key="skill.id"
          class="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex justify-between items-center"
        >
          <div class="font-medium">{{ skill.name }}</div>
          <div class="text-sm text-gray-500">{{ skill.progress }}%</div>
        </li>
      </ul>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useQuery } from '@tanstack/vue-query'
import { getSkills, type Skill } from '@/api/skills'

const { data, isLoading, error } = useQuery<Skill[], Error>({
  queryKey: ['skills'],
  queryFn: getSkills,
})
</script>
