<script setup lang="ts">
definePageMeta({
  layout: 'client-default'
})

const { public: { apiBase } } = useRuntimeConfig()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 1 week

async function login() {
  loading.value = true
  error.value = ''
  
  // Debug: Log the API Base and intended request
  console.log('Attempting login to:', `${apiBase}/token`)
  
  try {
    // FastAPI /token expects application/x-www-form-urlencoded
    const formData = new URLSearchParams()
    formData.append('username', username.value)
    formData.append('password', password.value)

    console.log('Request body:', formData.toString())

    const data = await $fetch(`${apiBase}/token`, {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (data?.access_token) {
      console.log('Login successful! Storing token...')
      token.value = data.access_token
      
      if (username.value.includes('admin')) {
        router.push('/admin')
      } else {
        router.push('/client')
      }
    }
  } catch (err: any) {
    console.error('Login Error:', err)
    error.value = err.data?.detail || 'Authentication failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 pointer-events-none mix-blend-multiply opacity-50"></div>
    <UCard class="w-full max-w-md relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-xl shadow-primary-500/5 dark:shadow-none border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Portal Login</h2>
      </template>
      
      <UAlert
        v-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        :title="error"
        class="mb-4"
      />
      
      <form @submit.prevent="login" class="space-y-4">
        <UFormGroup label="Email / Username" name="username">
          <UInput v-model="username" placeholder="john@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        
        <UFormGroup label="Password" name="password">
          <UInput v-model="password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" />
        </UFormGroup>
        
        <UButton type="submit" color="primary" block :loading="loading" class="mt-4 transition-transform hover:-translate-y-0.5">
          Sign In
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


