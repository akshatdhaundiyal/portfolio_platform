<script setup lang="ts">
definePageMeta({
  layout: 'client-default'
})

const { public: { apiBase } } = useRuntimeConfig()
const isRegistering = ref(false)
const username = ref('')
const password = ref('')
const fullname = ref('')
const inviteCode = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 1 week

async function login() {
  loading.value = true
  error.value = ''
  
  try {
    const formData = new URLSearchParams()
    formData.append('username', username.value)
    formData.append('password', password.value)

    const data = await $fetch(`${apiBase}/token`, {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (data?.access_token) {
      token.value = data.access_token
      if (data.username?.includes('admin')) {
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

async function register() {
  loading.value = true
  error.value = ''

  try {
    const data = await $fetch(`${apiBase}/users/register`, {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
        fullname: fullname.value,
        email: username.value.includes('@') ? username.value : `${username.value}@temp.com`, // Basic fallback
        invite_code: inviteCode.value
      }
    })

    if (data?.id) {
      // Registration successful, switch to login
      isRegistering.value = false
      error.value = 'Registration successful! Please login with your new credentials.'
    }
  } catch (err: any) {
    console.error('Registration Error:', err)
    error.value = err.data?.detail || 'Registration failed. Please verify your invite code.'
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  isRegistering.value = !isRegistering.value
  error.value = ''
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full px-4">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 pointer-events-none mix-blend-multiply opacity-50"></div>
    
    <UCard class="w-full max-w-md relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-xl border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
      <template #header>
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
            {{ isRegistering ? 'Join Workspace' : 'Portal Login' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ isRegistering ? 'Enhance your project collaboration experience' : 'Access your dashboard and project status' }}
          </p>
        </div>
      </template>
      
      <UAlert
        v-if="error"
        icon="i-heroicons-information-circle"
        :color="error.includes('successful') ? 'green' : 'red'"
        variant="soft"
        :title="error"
        class="mb-6"
      />
      
      <form @submit.prevent="isRegistering ? register() : login()" class="space-y-4">
        <template v-if="isRegistering">
          <UFormGroup label="Full Name" name="fullname">
            <UInput v-model="fullname" placeholder="John Doe" icon="i-heroicons-user" />
          </UFormGroup>
        </template>

        <UFormGroup :label="isRegistering ? 'Username / Email' : 'Email / Username'" name="username">
          <UInput v-model="username" placeholder="john@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>
        
        <UFormGroup label="Password" name="password">
          <UInput v-model="password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" />
        </UFormGroup>

        <template v-if="isRegistering">
          <UFormGroup label="Invite Code" name="inviteCode" help="Provided by your workspace administrator">
            <UInput v-model="inviteCode" placeholder="SECRET-CODE" icon="i-heroicons-ticket" color="primary" variant="outline" />
          </UFormGroup>
        </template>
        
        <UButton type="submit" color="primary" block :loading="loading" class="mt-6 py-2.5 font-semibold transition-all hover:scale-[1.02]">
          {{ isRegistering ? 'Initialize Account' : 'Sign In' }}
        </UButton>
      </form>

      <template #footer>
        <div class="text-center">
          <button @click="toggleMode" class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
            {{ isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register" }}
          </button>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>


