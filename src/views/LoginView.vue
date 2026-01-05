<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import LoginForm from '../components/auth/LoginForm.vue'
import { login, AuthError } from '@/api/auth'
import useAuthStore from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const handleLogin = async (payload: { email: string; password: string }) => {
  isSubmitting.value = true
  error.value = null
  try {
    const { user, token } = await login(payload.email, payload.password)
    auth.setSession({ user, token })
    await router.push({ name: 'dashboard' })
  } catch (err) {
    if (err instanceof AuthError) {
      error.value = err.message || 'Invalid credentials'
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = String(err)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <LoginForm :is-submitting="isSubmitting" @login="handleLogin" />
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </AuthLayout>
</template>
