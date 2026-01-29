<template>
  <AlertDialog v-model:open="openLocal">
    <AlertDialogContent class="max-w-md" :aria-disabled="props.loading">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete skill</AlertDialogTitle>
      </AlertDialogHeader>

      <div class="py-2">
        <AlertDialogDescription>
          Are you sure you want to delete
          <strong class="ml-1">{{ props.skill?.name ?? 'this skill' }}</strong
          >? This action cannot be undone.
        </AlertDialogDescription>
      </div>

      <AlertDialogFooter class="pt-4 border-t">
        <AlertDialogCancel>
          <Button variant="ghost" :disabled="props.loading">Cancel</Button>
        </AlertDialogCancel>

        <Button variant="destructive" :disabled="props.loading" @click="onConfirm">
          {{ props.loading ? 'Deleting…' : 'Delete' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import type { Skill } from '@/api/skills'

const props = withDefaults(
  defineProps<{ skill: Skill | null; open?: boolean; loading?: boolean }>(),
  {
    open: false,
    loading: false,
  }
)

const emits = defineEmits<{
  (e: 'confirm', id: string): void
  (e: 'update:open', open: boolean): void
}>()

const openLocal = computed({
  get: () => props.open ?? false,
  set: (v: boolean) => emits('update:open', v),
})

function onConfirm() {
  if (!props.skill) return
  emits('confirm', props.skill.id)
  emits('update:open', false)
}
</script>
