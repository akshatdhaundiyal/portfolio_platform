<script setup>
definePageMeta({
  layout: 'default'
})

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

async function login() {
  loading.value = true
  // Mock login: route based on input
  setTimeout(() => {
    loading.value = false
    if (username.value.includes('admin')) {
      router.push('/admin')
    } else {
      router.push('/client')
    }
  }, 1000)
}
</script>


<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Portal Login</h2>
      </template>
      
      <form @submit.prevent="login" class="space-y-4">
        <UFormGroup label="Email / Username" name="username">
          <UInput v-model="username" placeholder="john@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        
        <UFormGroup label="Password" name="password">
          <UInput v-model="password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" />
        </UFormGroup>
        
        <UButton type="submit" color="primary" block :loading="loading" class="mt-4">
          Sign In
        </UButton>
      </form>
    </UCard>
  </div>
</template>


