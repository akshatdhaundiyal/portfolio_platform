<script setup lang="ts">
import { ref, computed } from 'vue'
definePageMeta({ layout: 'admin-default' })

interface Client {
  id: number
  username: string
  email: string
  fullname?: string
  bio?: string
  role: string
  registration_date: string
}

const { public: { apiBase } } = useRuntimeConfig()
const token = useCookie('auth_token').value
const toast = useToast()

// Data fetching
const { data: clients, pending: isLoading, refresh } = await useAsyncData<Client[]>('admin-clients', async () => {
  return await $fetch('/users/clients', {
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
}, { default: () => [] })

// Search and filtering
const searchQuery = ref('')
const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  const q = searchQuery.value.toLowerCase()
  return clients.value.filter((c: any) => 
    c.username.toLowerCase().includes(q) || 
    (c.fullname && c.fullname.toLowerCase().includes(q)) ||
    c.email.toLowerCase().includes(q)
  )
})

// Stats
const stats = computed(() => [
  { label: 'Total Clients', value: clients.value.length, icon: 'i-heroicons-users', color: 'primary' },
  { label: 'Active This Week', value: clients.value.length, icon: 'i-heroicons-bolt', color: 'emerald' }, // Mock stat
  { label: 'Pending Invites', value: 0, icon: 'i-heroicons-ticket', color: 'amber' } // Mock stat
])

// Table columns
const columns = [
  { key: 'avatar', label: '', sortable: false },
  { key: 'fullname', label: 'Name', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'registration_date', label: 'Joined', sortable: true },
  { key: 'actions', label: '' }
]

function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Clients Management</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">View and manage all client accounts and their workspace access.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" variant="soft" icon="i-heroicons-arrow-path" @click="refresh" :loading="isLoading">Refresh</UButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
      <template v-if="isLoading">
        <USkeleton v-for="i in 3" :key="i" class="h-32 w-full rounded-xl bg-white/40 dark:bg-gray-800/40" />
      </template>
      <UCard v-else v-for="stat in stats" :key="stat.label" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
        <div class="flex items-center gap-4">
          <div :class="`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/40`">
            <UIcon :name="stat.icon" :class="`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Clients Table -->
    <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 relative z-10 shadow-sm overflow-hidden" :ui="{ body: { padding: 'p-0' } }">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 max-w-sm">
            <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search clients..." variant="outline" class="w-full" />
          </div>
        </div>
      </template>

      <UTable :rows="filteredClients" :columns="columns" :loading="isLoading" 
             :ui="{ tr: { base: 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors' } }">
        <template #avatar-data="{ row }">
          <UAvatar :alt="row.fullname || row.username" size="sm" />
        </template>
        <template #fullname-data="{ row }">
          <span class="font-semibold text-gray-900 dark:text-white">{{ row.fullname || '—' }}</span>
        </template>
        <template #username-data="{ row }">
          <span class="text-gray-500 font-mono text-xs">@{{ row.username }}</span>
        </template>
        <template #registration_date-data="{ row }">
          <ClientOnly>
            <span class="text-xs text-gray-500">{{ formatDate(row.registration_date) }}</span>
          </ClientOnly>
        </template>
        <template #actions-data="{ row }">
          <UButton color="primary" variant="ghost" icon="i-heroicons-chevron-right" :to="`/admin/clients/${row.id}`">Details</UButton>
        </template>
      </UTable>

      <div v-if="!isLoading && filteredClients.length === 0" class="py-20 text-center">
        <UIcon name="i-heroicons-users" class="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 font-medium">No clients found matching your search.</p>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
