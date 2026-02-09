<template>
  <div
    v-if="message"
    role="alert"
    class="p-4 rounded-md bg-red-50 border border-red-200 text-red-700"
  >
    <p class="text-sm">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>
