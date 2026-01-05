<template>
  <DefaultLayout>
    <header class="mb-6">
      <h2 class="text-3xl font-bold">My Skills</h2>
      <p class="mt-2 text-sm text-muted-foreground">Overview of your skills and progress.</p>
    </header>

    <section aria-labelledby="skills-heading" class="grid gap-4">
      <h3 id="skills-heading" class="text-lg font-medium mb-2">Skills list</h3>

      <div
        class="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-muted-foreground">Skills will appear here once implemented.</p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
