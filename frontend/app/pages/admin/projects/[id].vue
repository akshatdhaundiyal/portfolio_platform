<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

definePageMeta({ layout: 'admin-default' })

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
  github_url?: string
  github_token?: string
  trello_url?: string
  wip_url?: string
  start_date?: string
  acceptance_criteria?: string
}

const { public: { apiBase } } = useRuntimeConfig()
const token = useCookie('auth_token').value

// Fetch Project Data
const { data: project, pending: isLoading, refresh } = await useAsyncData<Project>(`admin-project-${id}`, async () => {
  return await $fetch(`/projects/${id}`, { 
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  })
})

// Management State
const isUpdating = ref(false)
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'In Review', value: 'review' },
  { label: 'Completed', value: 'completed' }
]

async function updateProjectStatus(newStatus: string) {
  isUpdating.value = true
  try {
    await $fetch(`${apiBase}/projects/${id}`, {
      method: 'PUT',
      body: { status: newStatus },
      headers: { Authorization: `Bearer ${token}` }
    })
    await refresh()
    toast.add({ title: 'Status Updated', color: 'primary' })
  } catch (err) {
    toast.add({ title: 'Update Failed', color: 'red' })
  } finally {
    isUpdating.value = false
  }
}

// GitHub Commits Logic (Ported from client dashboard)
const commits = ref<any[]>([])
const isCommitsLoading = ref(false)

async function fetchCommits() {
  if (!project.value?.github_url) return
  isCommitsLoading.value = true
  try {
    const parts = project.value.github_url.split('github.com/')[1]?.split('/')
    if (!parts || parts.length < 2) return
    const owner = parts[0]
    const repo = parts[1]?.replace('.git', '')
    if (!owner || !repo) return
    const headers: any = { 'Accept': 'application/vnd.github.v3+json' }
    if (project.value.github_token) {
      headers['Authorization'] = `token ${project.value.github_token}`
    }
    const data: any = await $fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      params: { per_page: 5 },
      headers
    })
    commits.value = data
  } catch (err) {
    console.error('Failed to fetch commits:', err)
  } finally {
    isCommitsLoading.value = false
  }
}

watchEffect(() => {
  if (project.value?.github_url) fetchCommits()
})

// Messaging Logic (Perspective: Admin)
const newMessage = ref('')
const messages = ref([
  { id: 1, text: 'Hello! I have started working on the main layout.', sender: 'admin', time: '10:00 AM' },
  { id: 2, text: 'Awesome, can you make sure it matches the figma?', sender: 'client', time: '10:35 AM' },
])

function sendMessage() {
  if(!newMessage.value) return
  messages.value.push({
    id: Date.now(),
    text: newMessage.value,
    sender: 'admin',
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  })
  newMessage.value = ''
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div v-if="project" class="pb-20 animate-fade-in-up">
    <!-- Admin Header -->
    <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 h-20 flex items-center px-6 gap-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.push('/admin/projects')" />
      <div class="flex-1">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{{ project.title }}</h1>
        <div class="flex items-center gap-2 mt-1">
          <UBadge color="primary" variant="solid" size="xs">Admin View</UBadge>
          <span class="text-xs text-gray-400">#{{ project.id }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <USelect v-model="project.status" :options="statusOptions" size="sm" class="w-40" @change="updateProjectStatus" :loading="isUpdating" />
        <UButton v-if="project.wip_url" :to="project.wip_url" target="_blank" color="emerald" variant="soft" icon="i-heroicons-eye">Client Preview</UButton>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Left Column: Primary Content -->
      <div class="xl:col-span-8 space-y-8">
        <!-- Overview & Description -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
          <template #header>
            <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              <UIcon name="i-heroicons-document-text" class="text-primary-500" />
              Project Strategy
            </div>
          </template>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ project.description }}</p>
        </UCard>

        <!-- GitHub Activity -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <UIcon name="i-heroicons-code-bracket" class="text-emerald-500" />
                Integration Activity (GitHub)
              </div>
              <UButton v-if="project.github_url" :to="project.github_url" target="_blank" variant="ghost" color="gray" size="xs" icon="i-heroicons-link">Repo</UButton>
            </div>
          </template>
          <div class="space-y-4">
            <template v-if="isCommitsLoading">
              <USkeleton v-for="i in 3" :key="i" class="h-12 w-full" />
            </template>
            <template v-else-if="commits.length > 0">
              <div v-for="commit in commits" :key="commit.sha" class="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                 <UAvatar :src="commit.author?.avatar_url" class="shrink-0" />
                 <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold truncate">{{ commit.commit.message }}</p>
                    <p class="text-xs text-gray-500">{{ commit.commit.author.name }} • {{ new Date(commit.commit.author.date).toLocaleDateString() }}</p>
                 </div>
              </div>
            </template>
            <div v-else class="text-center py-6 text-gray-400 italic">No repos linked.</div>
          </div>
        </UCard>
      </div>

      <!-- Right Column: Management Sidebar -->
      <div class="xl:col-span-4 space-y-8">
        <!-- Trello / Kanban -->
        <UCard class="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/40">
           <template #header>
             <div class="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
               <UIcon name="i-heroicons-view-columns" />
               Kanban Board
             </div>
           </template>
           <UButton v-if="project.trello_url" :to="project.trello_url" target="_blank" block color="blue" variant="solid" icon="i-heroicons-arrow-top-right-on-square">Open Board</UButton>
           <p v-else class="text-xs text-center text-blue-400">No board linked.</p>
        </UCard>

        <!-- Communication Channel -->
        <UCard class="bg-white/80 dark:bg-gray-800/80 shadow-2xl flex flex-col h-[500px]">
          <template #header>
            <div class="flex items-center gap-2 font-bold">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="text-primary-500" />
              Client Communication
            </div>
          </template>
          <div class="flex-1 overflow-auto space-y-4 p-2 scrollbar-thin">
            <div v-for="msg in messages" :key="msg.id" :class="['p-3 rounded-2xl text-sm max-w-[85%] shadow-sm', msg.sender === 'admin' ? 'bg-primary-600 text-white ml-auto rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700/50 rounded-tl-none']">
               {{ msg.text }}
               <span class="text-[10px] block mt-1 opacity-70" :class="msg.sender === 'admin' ? 'text-right' : 'text-left'">{{ msg.time }}</span>
            </div>
          </div>
          <template #footer>
            <div class="flex gap-2">
              <UInput v-model="newMessage" placeholder="Reply to client..." class="flex-1" @keyup.enter="sendMessage" />
              <UButton color="primary" icon="i-heroicons-paper-airplane" @click="sendMessage" />
            </div>
          </template>
        </UCard>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
</style>
