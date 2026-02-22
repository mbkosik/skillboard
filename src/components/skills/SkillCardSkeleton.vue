<template>
  <Card class="w-full p-4 h-40" aria-hidden="true">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <Skeleton class="h-6 w-3/4 mb-2" />
        <Skeleton class="h-4 w-1/3" />
      </div>

      <div class="flex items-center gap-2">
        <Skeleton class="h-8 w-16 rounded-md" />
        <Skeleton class="h-8 w-16 rounded-md" />
      </div>
    </div>

    <div class="mt-3">
      <Skeleton class="h-4 w-full" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>
