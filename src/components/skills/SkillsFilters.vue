<template>
  <div class="flex flex-col sm:flex-row sm:justify-end gap-4">
    <div class="flex items-center gap-3">
      <Label :for="progressId" class="mb-1">Progress</Label>
      <Select
        :id="progressId"
        v-model="progressModel"
        class="w-48"
        aria-label="Filter skills by progress"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectSeparator />
          <SelectItem value="0-25">0–25%</SelectItem>
          <SelectItem value="26-50">26–50%</SelectItem>
          <SelectItem value="51-75">51–75%</SelectItem>
          <SelectItem value="76-100">76–100%</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex items-center gap-3">
      <Label :for="sortId" class="mb-1">Sort</Label>
      <Select :id="sortId" v-model="sortModel" class="w-56" aria-label="Sort skills">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name_asc">Name ↑</SelectItem>
          <SelectItem value="name_desc">Name ↓</SelectItem>
          <SelectSeparator />
          <SelectItem value="progress_asc">Progress ↑</SelectItem>
          <SelectItem value="progress_desc">Progress ↓</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select'
import type { SortParam, ProgressFilter } from '@/lib/skillFilters'

const props = defineProps<{
  sort: SortParam
  progress: ProgressFilter
}>()

const emit = defineEmits<{
  (e: 'update:sort', v: SortParam): void
  (e: 'update:progress', v: ProgressFilter): void
}>()

const baseId = useId()
const progressId = `skills-filters-progress-${baseId}`
const sortId = `skills-filters-sort-${baseId}`

const sortModel = computed<SortParam>({
  get: () => props.sort,
  set: (v: SortParam) => emit('update:sort', v),
})

const progressModel = computed<ProgressFilter>({
  get: () => props.progress,
  set: (v: ProgressFilter) => emit('update:progress', v),
})
</script>
