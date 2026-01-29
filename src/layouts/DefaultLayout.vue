<template>
  <div class="min-h-screen">
    <header class="border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <RouterLink
          to="/dashboard"
          :aria-current="isDashboard ? 'page' : undefined"
          class="text-lg font-semibold"
        >
          Skillboard
        </RouterLink>

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
import { RouterLink } from 'vue-router'
import { Switch } from '@/components/ui/switch'
import useUIStore from '@/stores/ui'
import { useRoute } from 'vue-router'

const route = useRoute()
const ui = useUIStore()

const isDark = computed({
  get: () => ui.theme === 'dark',
  set: (v: boolean) => ui.setTheme(v ? 'dark' : 'light'),
})

const isDashboard = computed(() => route.path === '/dashboard')
</script>
