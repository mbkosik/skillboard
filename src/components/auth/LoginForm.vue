<template>
  <Card class="max-w-md w-full">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your credentials to access your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            autocomplete="email"
            :aria-invalid="!!emailError"
            :aria-describedby="emailError ? 'email-error' : undefined"
            :disabled="isSubmitting"
            @blur="emailTouched = true"
          />
          <p v-if="emailError" id="email-error" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
        </div>
        <div class="mb-4">
          <Label for="password">Password</Label>
          <Input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            :aria-invalid="!!passwordError"
            :aria-describedby="passwordError ? 'password-error' : undefined"
            :disabled="isSubmitting"
            @blur="passwordTouched = true"
          />
          <p v-if="passwordError" id="password-error" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>
        <Button type="submit" class="w-full" :disabled="hasErrors || isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { isValidEmail } from '@/lib/validation'

const props = defineProps<{
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  login: [payload: { email: string; password: string }]
}>()

const email = ref('')
const password = ref('')
const emailTouched = ref(false)
const passwordTouched = ref(false)

const emailError = computed(() => {
  if (!emailTouched.value) return ''
  if (!email.value.trim()) return 'Email is required'
  if (!isValidEmail(email.value)) return 'Invalid email format'
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (!password.value.trim()) return 'Password is required'
  return ''
})

const hasErrors = computed(() => !!emailError.value || !!passwordError.value)

const handleSubmit = () => {
  emailTouched.value = true
  passwordTouched.value = true
  if (hasErrors.value) return
  emit('login', { email: email.value, password: password.value })
}
</script>
