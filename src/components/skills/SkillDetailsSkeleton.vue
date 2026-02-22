<template>
  <div class="grid gap-4" aria-hidden="true">
    <Card class="p-6">
      <div class="mb-4">
        <Skeleton class="h-8 w-1/2 mb-2" />
        <Skeleton class="h-4 w-1/3" />
      </div>

      <div class="mt-3">
        <Skeleton class="h-4 w-full mb-2" />
        <Skeleton class="h-4 w-3/4" />
      </div>
    </Card>

    <Card class="p-6 max-w-md">
      <h4 class="text-lg font-medium mb-3"><Skeleton class="h-6 w-1/3" /></h4>

      <div class="space-y-3">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>

      <div class="flex gap-2 mt-4">
        <Skeleton class="h-9 w-24" />
        <Skeleton class="h-9 w-24" />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
</script>
