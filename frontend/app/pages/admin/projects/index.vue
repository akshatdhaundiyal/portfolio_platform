<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ layout: 'admin-default' })

interface Project {
  id: number
  title: string
  description: string
  status: string
  client_id: number
  start_date: string
  github_url?: string
  trello_url?: string
  wip_url?: string
}

interface Client {
  id: number
  username: string
  fullname?: string
  email: string
}

const { public: { apiBase } } = useRuntimeConfig()
const token = useCookie('auth_token').value
const toast = useToast()

// Data Fetching
const { data, pending: isLoading, refresh } = await useAsyncData('admin-projects-data', async () => {
  const headers = { Authorization: `Bearer ${token}` }
  const [projects, clients] = await Promise.all([
    $fetch<Project[]>(`${apiBase}/projects`, { headers }),
    $fetch<Client[]>(`${apiBase}/users/clients`, { headers })
  ])
  return { projects, clients }
}, { default: () => ({ projects: [], clients: [] }) })

const projects = computed(() => data.value.projects)
const clients = computed(() => data.value.clients)

// Search & Filtering
const searchQuery = ref('')
const statusFilter = ref('all')

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'In Review', value: 'review' },
  { label: 'Completed', value: 'completed' }
]

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// Client Mapping
function getClientName(clientId: number) {
  const client = clients.value.find(c => c.id === clientId)
  return client ? (client.fullname || client.username) : 'Unknown Client'
}

// Create Project Modal Logic
const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)

const projectForm = ref({
  title: '',
  description: '',
  client_id: '',
  github_url: '',
  github_token: '',
  trello_url: '',
  wip_url: '',
  start_date: new Date().toISOString().split('T')[0]
})

const clientOptions = computed(() => {
  return clients.value.map(c => ({ 
    label: c.fullname || c.username, 
    value: String(c.id) 
  }))
})

async function handleCreateProject() {
  if (!projectForm.value.title || !projectForm.value.client_id) {
    toast.add({ title: 'Incomplete Form', description: 'Please provide a title and assign a client.', color: 'amber' })
    return
  }
  
  isSubmitting.value = true
  try {
    await $fetch(`${apiBase}/projects`, {
      method: 'POST',
      body: {
        ...projectForm.value,
        client_id: parseInt(projectForm.value.client_id)
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    
    projectForm.value = { 
      title: '', 
      description: '', 
      client_id: '',
      github_url: '',
      github_token: '',
      trello_url: '',
      wip_url: '',
      start_date: new Date().toISOString().split('T')[0]
    }
    isCreateModalOpen.value = false
    await refresh()
    
    toast.add({ title: 'Project Initialized', description: 'The new project has been successfully added.', icon: 'i-heroicons-check-circle', color: 'primary' })
  } catch (err: any) {
    toast.add({ title: 'Creation Failed', description: err.data?.detail || 'Error initializing project.', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

// Table Columns
const columns = [
  { key: 'title', label: 'Project Name', sortable: true },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'start_date', label: 'Started', sortable: true },
  { key: 'actions', label: '' }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'emerald'
    case 'in_progress': return 'primary'
    case 'review': return 'orange'
    default: return 'gray'
  }
}

function formatDate(dateString: string) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Professional Projects</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage and track the progress of every client engagement.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" icon="i-heroicons-plus" class="shadow-sm" @click="isCreateModalOpen = true">Initialize New Project</UButton>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
      <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Active Projects</div>
        <div class="text-2xl font-bold text-primary-600 mt-1">{{ projects.filter(p => p.status !== 'completed').length }}</div>
      </UCard>
      <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Completed</div>
        <div class="text-2xl font-bold text-emerald-600 mt-1">{{ projects.filter(p => p.status === 'completed').length }}</div>
      </UCard>
    </div>

    <!-- Search & Filters -->
    <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 relative z-10" :ui="{ body: { padding: 'p-4' } }">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search project titles..." class="w-full" />
        </div>
        <div class="w-full md:w-48">
          <USelect v-model="statusFilter" :options="statusOptions" />
        </div>
      </div>
    </UCard>

    <!-- Project List -->
    <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 relative z-10 shadow-sm" :ui="{ body: { padding: 'p-0' } }">
      <UTable :rows="filteredProjects" :columns="columns" :loading="isLoading"
             :ui="{ tr: { base: 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer' } }"
             @select="(row: Project) => $router.push(`/admin/projects/${row.id}`)">
        
        <template #title-data="{ row }">
          <span class="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{{ row.title }}</span>
        </template>

        <template #client-data="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ getClientName(row.client_id) }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="soft" size="xs" class="capitalize">
            {{ row.status.replace('_', ' ') }}
          </UBadge>
        </template>

        <template #start_date-data="{ row }">
          <span class="text-xs text-gray-500">{{ formatDate(row.start_date) }}</span>
        </template>

        <template #actions-data="{ row }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-chevron-right" :to="`/admin/projects/${row.id}`" />
        </template>
      </UTable>

      <div v-if="!isLoading && filteredProjects.length === 0" class="py-20 text-center">
        <UIcon name="i-heroicons-briefcase" class="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 font-medium">No projects matching your search criteria.</p>
      </div>
    </UCard>

    <!-- Create Project Modal -->
    <UModal v-model="isCreateModalOpen" :ui="{ width: 'sm:max-w-xl' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Initialize New Project</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="isCreateModalOpen = false" />
          </div>
        </template>
        <UForm :state="projectForm" class="space-y-4" @submit="handleCreateProject">
          <UFormGroup label="Project Title" name="title" required><UInput v-model="projectForm.title" /></UFormGroup>
          <UFormGroup label="Description" name="description"><UTextarea v-model="projectForm.description" /></UFormGroup>
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Assign Client" name="client_id" required><USelect v-model="projectForm.client_id" :options="clientOptions" /></UFormGroup>
            <UFormGroup label="Start Date" name="start_date"><UInput v-model="projectForm.start_date" type="date" /></UFormGroup>
          </div>
          <div class="border-t dark:border-gray-800 pt-4"><h4 class="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-widest">Integrations</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="GitHub URL"><UInput v-model="projectForm.github_url" /></UFormGroup>
              <UFormGroup label="GitHub Token"><UInput v-model="projectForm.github_token" type="password" /></UFormGroup>
              <UFormGroup label="Trello URL"><UInput v-model="projectForm.trello_url" /></UFormGroup>
              <UFormGroup label="WIP URL"><UInput v-model="projectForm.wip_url" /></UFormGroup>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <UButton color="gray" variant="ghost" @click="isCreateModalOpen = false">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting">Start Work</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
