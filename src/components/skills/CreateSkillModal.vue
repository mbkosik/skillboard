<template>
  <Dialog v-model:open="open" @update:open="reset">
    <DialogTrigger asChild>
      <Button>Add skill</Button>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Add skill</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
        <div>
          <Label for="name">Name</Label>
          <Input id="name" v-model="form.name" :disabled="props.loading" />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <!-- TODO: progress slider instead number input -->
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
          <p v-if="errors.progress" class="mt-1 text-sm text-red-600">
            {{ errors.progress }}
          </p>
        </div>

        <DialogFooter class="pt-4 border-t">
          <Button type="button" variant="ghost" @click="onCancel" :disabled="props.loading">
            Cancel
          </Button>

          <Button type="submit" :disabled="props.loading">
            {{ props.loading ? 'Adding…' : 'Add skill' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import type { CreateSkillPayload } from '@/api/skills'

const props = withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })

const emits = defineEmits<{
  (e: 'create', payload: CreateSkillPayload): void
}>()

const open = ref(false)

const form = reactive<{ name: string; progress: number }>({ name: '', progress: 0 })
const errors = reactive<{ name?: string; progress?: string }>({})

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
  open.value = false
  reset()
}

function onSubmit() {
  if (!validate()) return
  const payload: CreateSkillPayload = { name: form.name.trim(), progress: Number(form.progress) }
  emits('create', payload)
  open.value = false
  reset()
}
</script>
