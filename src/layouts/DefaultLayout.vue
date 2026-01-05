<template>
  <div class="min-h-screen">
    <header class="border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-lg font-semibold">Skillboard</h1>

        <div class="flex items-center space-x-4" aria-hidden="true">
          <!-- reserved for user actions (profile, logout, theme toggle) -->
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout-only component. No logic here.
</script>
