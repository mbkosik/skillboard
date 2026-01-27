<template>
  <Input v-model="local" aria-label="Search skills" placeholder="Search skills" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import { useDebounce } from '@/composables/useDebounce'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const local = ref(props.modelValue ?? '')

watch(
  () => props.modelValue,
  (v) => {
    if (v !== local.value) local.value = v ?? ''
  }
)

const debounced = useDebounce(local, 300)

watch(
  debounced,
  (v) => {
    emit('update:modelValue', v)
  },
  { immediate: false }
)
</script>
