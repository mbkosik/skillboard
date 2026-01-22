<template>
  <div
    role="progressbar"
    :aria-label="label ?? 'progress'"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="clampedValue"
  >
    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div :class="['h-2 transition-all', colorClass]" :style="{ width: clampedValue + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  value: number
  label?: string
}>()

const clampedValue = computed(() => {
  const n = Number.isFinite(props.value) ? props.value : 0
  if (n < 0) return 0
  if (n > 100) return 100
  return Math.round(n * 100) / 100
})

const colorClass = computed(() => {
  if (clampedValue.value < 40) return 'bg-red-500'
  if (clampedValue.value < 70) return 'bg-yellow-500'
  return 'bg-green-500'
})
</script>
