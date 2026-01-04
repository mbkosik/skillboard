<template>
  <AuthLayout>
    <LoginForm :is-submitting="isSubmitting" @login="handleLogin" />
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import LoginForm from '../components/auth/LoginForm.vue'

const isSubmitting = ref(false)

const handleLogin = async (payload: { email: string; password: string }) => {
  isSubmitting.value = true
  // TODO: Implement authentication logic
  console.log('Login attempt:', payload)
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isSubmitting.value = false
}
</script>
