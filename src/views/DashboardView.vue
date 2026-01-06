<template>
  <DefaultLayout>
    <header class="mb-6">
      <h2 class="text-3xl font-bold">My Skills</h2>
      <p class="mt-2 text-sm text-muted-foreground">Overview of your skills and progress.</p>
    </header>

    <section aria-labelledby="skills-heading" class="grid gap-4">
      <h3 id="skills-heading" class="text-lg font-medium mb-2">Skills list</h3>

      <!-- TODO: optionally add skeleton card -->
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

      <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <SkillCard v-for="skill in data" :key="skill.id" :skill="skill" />
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useQuery } from '@tanstack/vue-query'
import { getSkills, type Skill } from '@/api/skills'
import SkillCard from '@/components/skills/SkillCard.vue'

const { data, isLoading, error } = useQuery<Skill[], Error>({
  queryKey: ['skills'],
  queryFn: getSkills,
})
</script>
