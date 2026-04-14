<script setup lang="ts">
import { ref, computed } from 'vue'
definePageMeta({ layout: 'admin-default' })

interface DashboardData {
  projects: any[]
  users: any[]
  invoices: any[]
}

// Consolidated fetch to reduce IPC overhead with individual catchers
const { data: dashboardData, pending: isLoading, refresh } = await useAsyncData<DashboardData>('dashboard', async () => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = useCookie('auth_token').value
  const headers = { Authorization: `Bearer ${token}` }

  const fetchSafe = async (url: string) => {
    try {
      const res = await $fetch(url, { baseURL: apiBase, headers })
      return (res as any[]) || []
    } catch (e: any) {
      console.error(`Fetch failed for ${url}:`, e)
      return []
    }
  }

  const [projects, users, invoices] = await Promise.all([
    fetchSafe('/projects/'),
    fetchSafe('/users/'),
    fetchSafe('/invoices/')
  ])
  
  return { 
    projects, 
    users, 
    invoices 
  }
}, {
  default: () => ({ projects: [], users: [], invoices: [] })
})

const projects = computed(() => dashboardData.value?.projects || [])
const users = computed(() => dashboardData.value?.users || [])
const invoices = computed(() => dashboardData.value?.invoices || [])

// CRUD State
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isSubmitting = ref(false)
const toast = useToast()

const projectForm = ref({
  title: '',
  description: '',
  client_id: ''
})

const editForm = ref({
  id: 0,
  title: '',
  description: '',
  status: ''
})

const clientOptions = computed(() => {
  return users.value
    .filter((u: any) => u.role?.toLowerCase().trim() === 'client')
    .map((u: any) => ({ 
      label: u.fullname || u.username, 
      value: String(u.id)
    }))
})

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'In Review', value: 'review' },
  { label: 'Completed', value: 'completed' }
]

function openEditModal(project: any) {
  editForm.value = {
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status
  }
  isEditModalOpen.value = true
}

async function handleCreateProject() {
  if (!projectForm.value.title || !projectForm.value.client_id) {
    toast.add({ title: 'Incomplete Form', description: 'Please provide a title and assign a client.', color: 'amber' })
    return
  }
  
  isSubmitting.value = true
  try {
    const { public: { apiBase } } = useRuntimeConfig()
    await $fetch(`${apiBase}/projects/`, {
      method: 'POST',
      body: {
        title: projectForm.value.title,
        description: projectForm.value.description,
        client_id: parseInt(projectForm.value.client_id)
      },
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    
    // Reset and Refresh
    projectForm.value = { title: '', description: '', client_id: '' }
    isCreateModalOpen.value = false
    await refresh()
    
    toast.add({
      title: 'Project Initialized',
      description: 'The new project has been successfully added to your roster.',
      icon: 'i-heroicons-check-circle',
      color: 'primary'
    })
  } catch (err: any) {
    console.error('Failed to create project:', err)
    toast.add({
      title: 'Creation Failed',
      description: err.data?.detail || 'Something went wrong while initializing the project.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

async function handleUpdateProject() {
  isSubmitting.value = true
  try {
    const { public: { apiBase } } = useRuntimeConfig()
    await $fetch(`${apiBase}/projects/${editForm.value.id}`, {
      method: 'PUT',
      body: {
        title: editForm.value.title,
        description: editForm.value.description,
        status: editForm.value.status
      },
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    
    isEditModalOpen.value = false
    await refresh()
    
    toast.add({
      title: 'Project Updated',
      description: 'The changes have been saved successfully.',
      icon: 'i-heroicons-check-circle',
      color: 'primary'
    })
  } catch (err: any) {
    console.error('Failed to update project:', err)
    toast.add({
      title: 'Update Failed',
      description: 'The system could not save your changes.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

async function handleDeleteProject(id: number) {
  if (!confirm('Are you sure you want to delete this project?')) return
  
  try {
    const { public: { apiBase } } = useRuntimeConfig()
    await $fetch(`${apiBase}/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    await refresh()
    
    toast.add({
      title: 'Project Removed',
      description: 'The project record has been permanently deleted.',
      icon: 'i-heroicons-trash',
      color: 'emerald'
    })
  } catch (err) {
    console.error('Failed to delete project:', err)
    toast.add({
      title: 'Deletion Failed',
      description: 'The system could not remove this project at this time.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  }
}

// Compute reactive stats based on fetched data
const stats = computed(() => {
  const clientsCount = users.value.filter((u: any) => u.role === 'client').length
  const projectsCount = projects.value.length
  const pendingInvoicesCount = invoices.value.filter((i: any) => i.status === 'unpaid').length
  
  return [
    { label: 'Total Projects', value: projectsCount, icon: 'i-heroicons-presentation-chart-line', color: 'primary' },
    { label: 'Active Clients', value: clientsCount, icon: 'i-heroicons-user-group', color: 'emerald' },
    { label: 'Pending Invoices', value: pendingInvoicesCount, icon: 'i-heroicons-currency-dollar', color: 'amber' }
  ]
})

const clients = computed(() => users.value.filter((u: any) => u.role === 'client'))

const tabs = [
  { label: 'Projects', slot: 'projects', icon: 'i-heroicons-briefcase' },
  { label: 'Clients', slot: 'clients', icon: 'i-heroicons-users' },
]
</script>

<template>
  <div class="relative space-y-8 animate-fade-in-up">
    <!-- Background glowing blobs -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div class="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage your professional portfolio and client relations.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" icon="i-heroicons-plus" class="shadow-sm hover:shadow-primary-500/20 transition-all" @click="isCreateModalOpen = true">New Project</UButton>
      </div>
    </div>

    <!-- Create Project Modal -->
    <UModal v-model="isCreateModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Initialize New Project
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="isCreateModalOpen = false" />
          </div>
        </template>

        <UForm :state="projectForm" class="space-y-4" @submit="handleCreateProject">
          <UFormGroup label="Project Title" name="title" required>
            <UInput v-model="projectForm.title" placeholder="e.g. Modern E-commerce Platform" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea v-model="projectForm.description" placeholder="Brief overview of the project scope..." />
          </UFormGroup>

          <UFormGroup label="Assign Client" name="client_id" required>
            <USelect 
              v-model="projectForm.client_id" 
              :options="clientOptions" 
              placeholder="Select a client" 
            />
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-4">
            <UButton color="gray" variant="ghost" @click="isCreateModalOpen = false">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting">Create Project</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Edit Project Modal -->
    <UModal v-model="isEditModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Update Project Details
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="isEditModalOpen = false" />
          </div>
        </template>

        <UForm :state="editForm" class="space-y-4" @submit="handleUpdateProject">
          <UFormGroup label="Project Title" name="title" required>
            <UInput v-model="editForm.title" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea v-model="editForm.description" />
          </UFormGroup>

          <UFormGroup label="Workflow Status" name="status" required>
            <USelect 
              v-model="editForm.status" 
              :options="statusOptions" 
            />
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-4">
            <UButton color="gray" variant="ghost" @click="isEditModalOpen = false">Discard</UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting">Save Changes</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
      <template v-if="isLoading">
        <USkeleton v-for="i in 3" :key="i" class="h-32 w-full rounded-xl bg-white/40 dark:bg-gray-800/40" />
      </template>
      <UCard v-else v-for="stat in stats" :key="stat.label" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 hover:scale-[1.02] transition-transform">
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

    <!-- Tabs Content -->
    <div class="relative z-10">
      <UTabs :items="tabs" class="w-full" :ui="{ wrapper: 'space-y-6', list: { background: 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-full p-1' } }">
        <template #projects="{ item }">
          <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm">
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Managed Projects</h3>
                <span v-if="!isLoading" class="text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-2 py-1 rounded-full">
                  {{ projects.length }} Total
                </span>
              </div>
            </template>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <div v-if="isLoading" class="py-10 text-center text-gray-500">Loading projects...</div>
              <div v-else-if="projects.length === 0" class="py-10 text-center text-gray-500">No projects found.</div>
              <div v-else v-for="project in projects" :key="project.id" class="py-4 first:pt-0 last:pb-0 flex justify-between items-center group">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{{ project.title }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <UIcon name="i-heroicons-user" class="w-4 h-4" /> {{ project.status }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <UBadge :color="project.status === 'completed' ? 'emerald' : 'primary'" variant="soft" size="xs">{{ project.status }}</UBadge>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" size="sm" class="rounded-full" @click="openEditModal(project)" />
                  <UButton color="red" variant="ghost" icon="i-heroicons-trash" size="sm" class="rounded-full opacity-0 group-hover:opacity-100 transition-opacity" @click="handleDeleteProject(project.id)" />
                  <UButton color="gray" variant="ghost" icon="i-heroicons-chevron-right" size="sm" class="rounded-full" />
                </div>
              </div>
            </div>
          </UCard>
        </template>
        <template #clients="{ item }">
          <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm">
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Client Accounts</h3>
                <UButton color="primary" variant="soft" icon="i-heroicons-user-plus" size="sm">Add Client</UButton>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="isLoading" class="col-span-2 py-10 text-center text-gray-500">Loading clients...</div>
              <div v-else-if="clients.length === 0" class="col-span-2 py-10 text-center text-gray-500">No clients found.</div>
              <div v-else v-for="client in clients" :key="client.id" class="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all flex items-center gap-4">
                <UAvatar :alt="client.username" size="md" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ client.fullname || client.username }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ client.email }}</p>
                </div>
                <UBadge color="emerald" variant="soft" size="xs">Active</UBadge>
              </div>
            </div>
          </UCard>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
@keyframes blob {
  0% { transform: scale(1); }
  33% { transform: scale(1.1) translate(10px, -10px); }
  66% { transform: scale(0.9) translate(-10px, 10px); }
  100% { transform: scale(1); }
}
</style>
