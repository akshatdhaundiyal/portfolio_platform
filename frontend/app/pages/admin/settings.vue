<script setup lang="ts">
import { ref, watch } from 'vue'

definePageMeta({ layout: 'admin-default' })

const { public: { apiBase } } = useRuntimeConfig()
const token = useCookie('auth_token').value
const toast = useToast()
const colorMode = useColorMode()

interface UserProfile {
  id: number
  username: string
  email: string
  fullname?: string
  bio?: string
  role: string
}

// Data Fetching
const { data: user, refresh } = await useAsyncData<UserProfile>('admin-me', () => 
  $fetch('/users/me', {
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
)

// Form States
const profileForm = ref({
  fullname: user.value?.fullname || '',
  bio: user.value?.bio || ''
})

const securityForm = ref({
  username: user.value?.username || '',
  email: user.value?.email || '',
  password: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)

// Sync forms when data loads
watch(user, (val) => {
  if (val) {
    profileForm.value.fullname = val.fullname || ''
    profileForm.value.bio = val.bio || ''
    securityForm.value.username = val.username || ''
    securityForm.value.email = val.email || ''
  }
}, { immediate: true })

async function handleUpdateProfile() {
  isSubmitting.value = true
  try {
    await $fetch(`${apiBase}/users/update`, {
      method: 'POST',
      body: {
        backup_username: user.value?.username, // Current username for lookup
        fullname: profileForm.value.fullname,
        bio: profileForm.value.bio
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    await refresh()
    toast.add({ title: 'Profile Updated', description: 'Your public details have been saved.', icon: 'i-heroicons-check-circle', color: 'primary' })
  } catch (err: any) {
    toast.add({ title: 'Update Failed', description: err.data?.detail || 'Error updating profile.', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleUpdateSecurity() {
  if (securityForm.value.password && securityForm.value.password !== securityForm.value.confirmPassword) {
    toast.add({ title: 'Password Mismatch', description: 'New passwords do not match.', color: 'amber' })
    return
  }

  isSubmitting.value = true
  try {
    const body: any = {
      backup_username: user.value?.username,
      username: securityForm.value.username,
      email: securityForm.value.email
    }
    if (securityForm.value.password) {
      body.password = securityForm.value.password
    }

    await $fetch(`${apiBase}/users/update`, {
      method: 'POST',
      body,
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // If username changed, we might need a re-login in a real app, 
    // but here we just refresh the local state.
    await refresh()
    securityForm.value.password = ''
    securityForm.value.confirmPassword = ''
    
    toast.add({ title: 'Security Updated', description: 'Account settings saved successfully.', icon: 'i-heroicons-shield-check', color: 'primary' })
  } catch (err: any) {
    toast.add({ title: 'Update Failed', description: err.data?.detail || 'Error updating security settings.', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

const items = [
  { label: 'Public Profile', icon: 'i-heroicons-user-circle' },
  { label: 'Security & Auth', icon: 'i-heroicons-lock-closed' },
  { label: 'Preferences', icon: 'i-heroicons-sparkles' }
]
</script>

<template>
  <div class="space-y-8 animate-fade-in-up pb-20">
    <!-- Header -->
    <div class="relative z-10">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Workspace Settings</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Configure your administrative profile, security protocols, and interface preferences.</p>
    </div>

    <!-- Tabs Container -->
    <div class="relative z-10 max-w-4xl">
      <UTabs :items="items" class="w-full" :ui="{ list: { background: 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-100/50 dark:border-gray-700/50', marker: { background: 'bg-primary-500 text-white' } } }">
        
        <!-- Profile Tab -->
        <template #item="{ item }">
          <UCard v-if="item.label === 'Public Profile'" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 mt-4">
            <template #header>
              <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white uppercase tracking-widest text-sm">
                <UIcon name="i-heroicons-user-circle" class="text-primary-500" />
                Identity & Bio
              </div>
            </template>
            <UForm :state="profileForm" class="space-y-6" @submit="handleUpdateProfile">
              <div class="flex flex-col md:flex-row gap-8 items-start">
                 <div class="flex flex-col items-center gap-4">
                   <UAvatar :alt="user?.fullname || user?.username" size="3xl" class="ring-4 ring-primary-500/20 shadow-2xl" />
                   <UButton color="gray" variant="ghost" size="xs">Change Photo</UButton>
                 </div>
                 <div class="flex-1 space-y-4 w-full">
                    <UFormGroup label="Professional Name" help="Visible to clients on dashboards and invoices.">
                      <UInput v-model="profileForm.fullname" placeholder="e.g. Akshat Dhaundiyal" />
                    </UFormGroup>
                    <UFormGroup label="Short Biography" help="A brief intro about your expertise.">
                      <UTextarea v-model="profileForm.bio" placeholder="Full-stack developer specializing in premium experiences..." autoresize />
                    </UFormGroup>
                 </div>
              </div>
              <div class="flex justify-end pt-4 border-t dark:border-gray-800">
                <UButton type="submit" color="primary" :loading="isSubmitting" icon="i-heroicons-check">Save Identity Changes</UButton>
              </div>
            </UForm>
          </UCard>

          <!-- Security Tab -->
          <UCard v-else-if="item.label === 'Security & Auth'" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 mt-4">
            <template #header>
               <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white uppercase tracking-widest text-sm">
                <UIcon name="i-heroicons-lock-closed" class="text-orange-500" />
                Credentials & Access
              </div>
            </template>
            <UForm :state="securityForm" class="space-y-6" @submit="handleUpdateSecurity">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup label="Username" help="Case-sensitive unique identifier.">
                  <UInput v-model="securityForm.username" icon="i-heroicons-at-symbol" />
                </UFormGroup>
                <UFormGroup label="Work Email" help="Used for system alerts and critical updates.">
                  <UInput v-model="securityForm.email" icon="i-heroicons-envelope" />
                </UFormGroup>
              </div>
              
              <div class="divider border-t dark:border-gray-800 py-4 font-semibold text-xs text-gray-400 uppercase tracking-widest">Update Passphrase</div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup label="New Password">
                  <UInput v-model="securityForm.password" type="password" icon="i-heroicons-key" placeholder="Leave blank to keep current" />
                </UFormGroup>
                <UFormGroup label="Confirm New Password">
                  <UInput v-model="securityForm.confirmPassword" type="password" icon="i-heroicons-shield-check" placeholder="Repeat passphrase" />
                </UFormGroup>
              </div>

              <div class="flex justify-end pt-4 border-t dark:border-gray-800">
                <UButton type="submit" color="orange" :loading="isSubmitting" icon="i-heroicons-shield-check">Update Security Protocol</UButton>
              </div>
            </UForm>
          </UCard>

          <!-- Preferences Tab -->
          <UCard v-else-if="item.label === 'Preferences'" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 mt-4">
            <template #header>
               <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white uppercase tracking-widest text-sm">
                <UIcon name="i-heroicons-sparkles" class="text-emerald-500" />
                Interface Customization
              </div>
            </template>
            <div class="space-y-8">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">Workspace Theme</p>
                  <p class="text-sm text-gray-500">Switch between light, dark, or system-adaptive visual modes.</p>
                </div>
                <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" class="w-32" />
              </div>

              <div class="flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">Email Notifications</p>
                  <p class="text-sm text-gray-500">Receive alerts when a client messages you.</p>
                </div>
                <UToggle disabled />
              </div>
            </div>
          </UCard>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
