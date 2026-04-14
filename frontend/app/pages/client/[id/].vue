<script setup lang="ts">
definePageMeta({ layout: 'client-default' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = route.params.id

interface Project {
  id: number
  title: string
  description: string
  status: string
  client_id: number
  acceptance_criteria?: string
  github_url?: string
  github_token?: string
  trello_url?: string
  wip_url?: string
  start_date?: string
}

interface CriteriaHistory {
  id: number
  content: string
  created_at: string
  author_name: string
}

// Fetch Project Data
const { data: project, pending: isLoading, refresh } = await useAsyncData<Project>(`project-${id}`, async () => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = useCookie('auth_token').value
  return await $fetch(`/projects/${id}`, { 
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
})

const { data: history, refresh: refreshHistory } = await useAsyncData<CriteriaHistory[]>(`project-history-${id}`, async () => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = useCookie('auth_token').value
  return await $fetch(`/projects/${id}/history`, { 
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
}, { default: () => [] })

// Collaboration State
const isEditModalOpen = ref(false)
const isSubmitting = ref(false)
const editForm = ref({
  description: '',
  acceptance_criteria: ''
})

function openEditModal() {
  editForm.value = {
    description: project.value?.description || '',
    acceptance_criteria: project.value?.acceptance_criteria || ''
  }
  isEditModalOpen.value = true
}

async function handleUpdateProject() {
  isSubmitting.value = true
  try {
    const { public: { apiBase } } = useRuntimeConfig()
    const token = useCookie('auth_token').value
    await $fetch(`${apiBase}/projects/${id}`, {
      method: 'PUT',
      body: editForm.value,
      headers: { Authorization: `Bearer ${token}` }
    })
    
    isEditModalOpen.value = false
    await Promise.all([refresh(), refreshHistory()])
    toast.add({ title: 'Workspace Updated', description: 'Your changes have been saved and logged.', icon: 'i-heroicons-check-circle', color: 'primary' })
  } catch (err: any) {
    toast.add({ title: 'Update Failed', description: err.data?.detail || 'Error saving changes.', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

// GitHub Commits Logic
const commits = ref<any[]>([])
const isCommitsLoading = ref(false)

async function fetchCommits() {
  if (!project.value?.github_url) return
  isCommitsLoading.value = true
  try {
    const parts = project.value.github_url.split('github.com/')[1]?.split('/')
    if (!parts || parts.length < 2) return
    const owner = parts[0]
    const repo = parts[1].replace('.git', '')
    const headers: any = { 'Accept': 'application/vnd.github.v3+json' }
    if (project.value.github_token) { headers['Authorization'] = `token ${project.value.github_token}` }
    const data: any = await $fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { params: { per_page: 5 }, headers })
    commits.value = data
  } catch (err) { console.error('Failed to fetch commits:', err) } finally { isCommitsLoading.value = false }
}

watchEffect(() => { if (project.value?.github_url) fetchCommits() })

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div v-if="project" class="pb-20 animate-fade-in">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 h-20 flex items-center px-6 gap-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.push('/client')" />
      <div class="flex-1">
        <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{{ project.title }}</h1>
        <div class="flex items-center gap-2 mt-1">
          <UBadge :color="project.status === 'completed' ? 'emerald' : 'primary'" variant="soft" size="xs" class="font-black uppercase tracking-widest">{{ project.status }}</UBadge>
          <span class="text-xs text-gray-400 font-medium">Project ID: #{{ project.id }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" variant="soft" icon="i-heroicons-pencil-square" @click="openEditModal">Edit Details</UButton>
        <UButton v-if="project.wip_url" :to="project.wip_url" target="_blank" color="primary" icon="i-heroicons-rocket-launch">Live Site</UButton>
      </div>
    </header>

    <!-- Modals -->
    <UModal v-model="isEditModalOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-gray-900 dark:text-white">Collaborate on Scope</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="isEditModalOpen = false" />
          </div>
        </template>
        <UForm :state="editForm" class="space-y-6" @submit="handleUpdateProject">
          <UFormGroup label="Project Description" help="Refine the overall vision and strategy of the project.">
            <UTextarea v-model="editForm.description" autoresize :rows="4" />
          </UFormGroup>
          <UFormGroup label="Acceptance Criteria" help="Define the specific requirements and goals needed to consider this project a success. Changes are version-tracked for accountability.">
            <UTextarea v-model="editForm.acceptance_criteria" autoresize :rows="6" placeholder="• Requirement 1&#10;• Requirement 2..." />
          </UFormGroup>
          <div class="flex justify-end gap-3 pt-4">
            <UButton color="gray" variant="ghost" @click="isEditModalOpen = false">Discard</UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting" class="px-8 font-bold">Save & Log Changes</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <main class="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Left Column -->
      <div class="xl:col-span-8 space-y-8">
        <!-- Overview -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm">
          <div class="space-y-2">
            <h3 class="text-sm font-black text-primary-500 uppercase tracking-widest">General Strategy</h3>
            <p class="text-gray-700 dark:text-gray-200 leading-relaxed text-lg whitespace-pre-wrap">{{ project.description }}</p>
          </div>
        </UCard>

        <!-- Acceptance Criteria Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm h-full">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-gray-900 dark:text-white font-black uppercase tracking-tight text-sm">
                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-500" />
                    Acceptance Criteria
                  </div>
                </div>
              </template>
              <div v-if="project.acceptance_criteria" class="prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ project.acceptance_criteria }}</p>
              </div>
              <div v-else class="text-center py-12">
                <UIcon name="i-heroicons-clipboard-document-list" class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" />
                <p class="text-gray-500 italic text-sm">No acceptance criteria defined yet.</p>
                <UButton color="primary" variant="link" @click="openEditModal">Define requirements now</UButton>
              </div>
            </UCard>
          </div>

          <!-- History Sidebar -->
          <div class="lg:col-span-1">
            <UCard class="bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-inner h-full">
              <template #header>
                <div class="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <UIcon name="i-heroicons-history" />
                  Edit History
                </div>
              </template>
              <div class="space-y-6">
                <div v-if="history.length === 0" class="text-center py-4 text-xs text-gray-400">No revisions yet.</div>
                <div v-for="item in history" :key="item.id" class="relative pl-6 border-l border-gray-200 dark:border-gray-700 pb-2">
                  <div class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-950"></div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{{ formatDateTime(item.created_at) }}</p>
                  <p class="text-xs font-bold text-gray-900 dark:text-white mt-1">{{ item.author_name }}</p>
                  <p class="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-tight">{{ item.content }}</p>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- GitHub Logs -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 text-gray-900 dark:text-white font-black uppercase tracking-tight text-sm">
                <UIcon name="i-heroicons-command-line" class="w-5 h-5 text-indigo-500" />
                Latest Development Build
              </div>
            </div>
          </template>
          <div class="space-y-6">
            <template v-if="isCommitsLoading">
              <USkeleton v-for="i in 3" :key="i" class="h-12 w-full rounded-2xl" />
            </template>
            <template v-else-if="commits.length > 0">
              <div v-for="commit in commits" :key="commit.sha" class="flex gap-4 group/item">
                <div class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover/item:text-primary-500 transition-colors">
                  <UIcon name="i-heroicons-code-bracket" class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{{ commit.commit.message }}</p>
                  <div class="flex items-center gap-2 mt-1 font-medium">
                    <span class="text-[10px] text-gray-500 uppercase tracking-tighter">{{ formatDate(commit.commit.author.date) }}</span>
                    <span class="text-[10px] text-gray-400">•</span>
                    <span class="text-[10px] text-gray-500 uppercase font-black">{{ commit.commit.author.name }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </UCard>
      </div>

      <!-- Right Column -->
      <div class="xl:col-span-4 space-y-8">
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <template #header>
            <div class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Project Vitals</div>
          </template>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
              <UBadge :color="project.status === 'completed' ? 'emerald' : 'primary'" variant="soft" size="xs" class="font-black uppercase tracking-tighter">{{ project.status }}</UBadge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Initiated</span>
              <span class="text-sm font-black text-gray-900 dark:text-white">{{ formatDate(project.start_date) }}</span>
            </div>
          </div>
        </UCard>

        <UCard class="bg-blue-600 shadow-lg shadow-blue-500/20 text-white">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto">
              <UIcon name="i-heroicons-view-columns" class="w-10 h-10" />
            </div>
            <h3 class="text-lg font-black uppercase tracking-tight">Trello Workspace</h3>
            <p class="text-sm text-blue-100 font-medium">Manage tasks and track immediate workflow steps directly in Kanban.</p>
            <UButton v-if="project.trello_url" :to="project.trello_url" target="_blank" block color="white" variant="solid" class="font-bold text-blue-600">Open Trello Board</UButton>
            <UButton v-else block disabled color="white" variant="soft">No Board Assigned</UButton>
          </div>
        </UCard>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
