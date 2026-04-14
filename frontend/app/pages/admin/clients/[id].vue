<script setup lang="ts">
import { ref, computed } from 'vue'
const route = useRoute()
const clientId = route.params.id as string

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

interface Project {
  id: number
  title: string
  description?: string
  status: string
  client_id: number
  github_url?: string
  trello_url?: string
  start_date?: string
}

const { public: { apiBase } } = useRuntimeConfig()
const token = useCookie('auth_token').value
const toast = useToast()

// Data fetching
const { data: clientInfo, pending: isUserLoading } = await useAsyncData<Client>(`client-${clientId}`, () => 
  $fetch(`/users/${clientId}`, {
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
)

const { data: allProjects, pending: areProjectsLoading } = await useAsyncData<Project[]>(`client-projects-${clientId}`, () => 
  $fetch('/projects', {
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
, { default: () => [] })

// Filter projects for this specific client
const clientProjects = computed(() => {
  return (allProjects.value || []).filter((p: Project) => String(p.client_id) === clientId)
})

const stats = computed(() => [
  { label: 'Total Projects', value: clientProjects.value.length, icon: 'i-heroicons-briefcase', color: 'primary' },
  { label: 'Completed', value: clientProjects.value.filter((p: any) => p.status === 'completed').length, icon: 'i-heroicons-check-badge', color: 'emerald' },
  { label: 'Pending', value: clientProjects.value.filter((p: any) => p.status === 'pending').length, icon: 'i-heroicons-clock', color: 'amber' }
])

function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Breadcrumbs / Back -->
    <div class="relative z-10 flex items-center gap-2">
      <UButton to="/admin/clients" color="gray" variant="ghost" icon="i-heroicons-arrow-left">Back to Clients</UButton>
    </div>

    <!-- Client Header Card -->
    <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 relative z-10 overflow-hidden shadow-sm">
      <div v-if="isUserLoading" class="py-10 text-center">Loading client profile...</div>
      <div v-else-if="!clientInfo" class="py-10 text-center">Client not found.</div>
      <div v-else class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex flex-col items-center gap-4">
          <UAvatar :alt="clientInfo.fullname || clientInfo.username" size="3xl" class="shadow-xl" />
          <UBadge color="emerald" variant="soft" class="px-3">Active Client</UBadge>
        </div>
        
        <div class="flex-1 space-y-4">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ clientInfo.fullname || clientInfo.username }}</h1>
            <p class="text-gray-500 font-mono">@{{ clientInfo.username }}</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary-500" />
              <span>{{ clientInfo.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary-500" />
              <span>Joined {{ formatDate(clientInfo.registration_date) }}</span>
            </div>
          </div>
          
          <div v-if="clientInfo.bio" class="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-sm italic text-gray-600 dark:text-gray-400">"{{ clientInfo.bio }}"</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Project Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
      <UCard v-for="stat in stats" :key="stat.label" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 hover:scale-[1.02] transition-transform">
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

    <!-- Associated Projects -->
    <div class="relative z-10">
      <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Active Projects</h2>
            <UButton v-if="!areProjectsLoading" color="primary" variant="soft" size="sm" icon="i-heroicons-plus">Add New Project</UButton>
          </div>
        </template>
        
        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div v-if="areProjectsLoading" class="py-10 text-center text-gray-500">Retrieving project data...</div>
          <div v-else-if="clientProjects.length === 0" class="py-12 text-center text-gray-500">
            <UIcon name="i-heroicons-folder-open" class="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>This client has no projects assigned yet.</p>
          </div>
          <div v-else v-for="project in clientProjects" :key="project.id" class="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                <UIcon name="i-heroicons-document-text" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors uppercase tracking-wide">{{ project.title }}</h3>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                   <UBadge :color="project.status === 'completed' ? 'emerald' : 'primary'" size="xs" variant="soft">{{ project.status }}</UBadge>
                   <span>• Started {{ formatDate(project.start_date) }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <UButton v-if="project.github_url" :to="project.github_url" target="_blank" color="gray" variant="ghost" icon="i-simple-icons-github" size="xs" />
              <UButton v-if="project.trello_url" :to="project.trello_url" target="_blank" color="gray" variant="ghost" icon="i-simple-icons-trello" size="xs" />
              <UButton color="gray" variant="solid" size="sm" icon="i-heroicons-arrow-top-right-on-square" :to="`/client/${project.id}`">View Dashboard</UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
