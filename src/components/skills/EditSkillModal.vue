<template>
  <Dialog v-model:open="openLocal">
    <DialogContent class="max-w-md" :aria-disabled="props.loading">
      <DialogHeader>
        <DialogTitle>Edit skill</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
        <div>
          <Label for="name">Name</Label>
          <Input id="name" v-model="form.name" :disabled="props.loading" />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <div>
          <Label for="progress">Progress</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            v-model.number="form.progress"
            :disabled="props.loading"
          />
          <p v-if="errors.progress" class="mt-1 text-sm text-red-600">{{ errors.progress }}</p>
        </div>

        <DialogFooter class="pt-4 border-t">
          <Button type="button" variant="ghost" @click="onCancel" :disabled="props.loading">
            Cancel
          </Button>

          <Button type="submit" :disabled="props.loading">
            {{ props.loading ? 'Saving…' : 'Save changes' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import type { Skill } from '@/api/skills'

const props = withDefaults(
  defineProps<{ skill: Skill | null; open?: boolean; loading?: boolean }>(),
  { open: false, loading: false }
)

const emits = defineEmits<{
  (e: 'update', payload: { id: string; name: string; progress: number }): void
  (e: 'update:open', open: boolean): void
}>()

const openLocal = computed({
  get: () => props.open ?? false,
  set: (v: boolean) => emits('update:open', v),
})

const form = reactive<{ name: string; progress: number }>({ name: '', progress: 0 })
const errors = reactive<{ name?: string; progress?: string }>({})

watch(
  () => openLocal.value,
  (isOpen) => {
    if (isOpen && props.skill) {
      form.name = props.skill.name
      form.progress = props.skill.progress
      errors.name = undefined
      errors.progress = undefined
    }
  }
)

function validate() {
  errors.name = undefined
  errors.progress = undefined

  if (!form.name || !form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (form.progress == null || Number.isNaN(form.progress)) {
    errors.progress = 'Progress must be a number'
  } else if (form.progress < 0 || form.progress > 100) {
    errors.progress = 'Progress must be between 0 and 100'
  }

  return !errors.name && !errors.progress
}

function reset() {
  form.name = ''
  form.progress = 0
  errors.name = undefined
  errors.progress = undefined
}

function onCancel() {
  emits('update:open', false)
  reset()
}

function onSubmit() {
  if (!props.skill) return
  if (!validate()) return
  emits('update', { id: props.skill.id, name: form.name.trim(), progress: Number(form.progress) })
  emits('update:open', false)
  reset()
}
</script>
