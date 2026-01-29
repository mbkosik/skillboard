<template>
  <div class="min-h-screen">
    <header class="border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-lg font-semibold">Skillboard</h1>

        <div class="flex items-center space-x-4">
          <Switch v-model="isDark" aria-label="Toggle theme" />
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from '@/components/ui/switch'
import useUIStore from '@/stores/ui'

const ui = useUIStore()

const isDark = computed({
  get: () => ui.theme === 'dark',
  set: (v: boolean) => ui.setTheme(v ? 'dark' : 'light'),
})
</script>
