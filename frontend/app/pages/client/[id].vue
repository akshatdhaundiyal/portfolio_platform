<script setup lang="ts">
definePageMeta({ layout: 'client-default' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = route.params.id

// Fetch Project Data
const { data: project, pending: isLoading, refresh } = await useAsyncData(`project-${id}`, async () => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = useCookie('auth_token').value
  return await $fetch(`/projects/${id}`, { 
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${token}` }
  }) as any
})

// GitHub Commits Logic
const commits = ref<any[]>([])
const isCommitsLoading = ref(false)

async function fetchCommits() {
  if (!project.value?.github_url) return
  
  isCommitsLoading.value = true
  try {
    // Extract owner/repo from https://github.com/owner/repo
    const parts = project.value.github_url.split('github.com/')[1]?.split('/')
    if (!parts || parts.length < 2) return
    
    const owner = parts[0]
    const repo = parts[1].replace('.git', '')
    
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

// Fetch commits when project data is available
watchEffect(() => {
  if (project.value?.github_url) {
    fetchCommits()
  }
})

// Messaging Logic
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
    sender: 'client',
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  })
  newMessage.value = ''
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div v-if="project" class="pb-20">
    <!-- Header Area -->
    <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 h-20 flex items-center px-6 gap-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.push('/client')" />
      <div class="flex-1">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ project.title }}</h1>
        <div class="flex items-center gap-2 mt-1">
          <UBadge :color="project.status === 'completed' ? 'emerald' : 'primary'" variant="soft" size="xs">{{ project.status }}</UBadge>
          <span class="text-xs text-gray-400">Project ID: #{{ project.id }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton v-if="project.wip_url" :to="project.wip_url" target="_blank" color="primary" icon="i-heroicons-rocket-launch" class="shadow-lg shadow-primary-500/20">Open Live Preview</UButton>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Left Column: Primary Content -->
      <div class="xl:col-span-8 space-y-8">
        <!-- Overview -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 overflow-hidden group">
          <template #header>
            <div class="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-500" />
              Project Strategy & Scope
            </div>
          </template>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{{ project.description }}</p>
        </UCard>

        <!-- GitHub Version Logs -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                <UIcon name="i-heroicons-queue-list" class="w-5 h-5 text-emerald-500" />
                Version Logs (Development Activity)
              </div>
              <UButton v-if="project.github_url" :to="project.github_url" target="_blank" variant="ghost" color="gray" size="xs" icon="i-heroicons-link">View Repo</UButton>
            </div>
          </template>
          
          <div class="space-y-6">
            <template v-if="isCommitsLoading">
              <div v-for="i in 3" :key="i" class="flex gap-4">
                <USkeleton class="h-10 w-10 rounded-full" />
                <div class="flex-1 space-y-2">
                  <USkeleton class="h-4 w-3/4" />
                  <USkeleton class="h-3 w-1/4" />
                </div>
              </div>
            </template>
            <template v-else-if="commits.length > 0">
              <div v-for="commit in commits" :key="commit.sha" class="flex gap-4 group/item">
                <div class="relative flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 z-10 border border-primary-200 dark:border-primary-800">
                    <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                  </div>
                  <div class="absolute top-10 bottom-0 w-px bg-gray-200 dark:bg-gray-700 hidden last:group-hover/item:block"></div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{{ commit.commit.message }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500">{{ commit.commit.author.name }}</span>
                    <span class="text-[10px] text-gray-400">•</span>
                    <span class="text-xs text-gray-500">{{ new Date(commit.commit.author.date).toLocaleDateString() }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="text-center py-10">
              <UIcon name="i-heroicons-no-symbol" class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p class="text-gray-500 italic">No development activity logs linked yet.</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Right Column: Sidebar -->
      <div class="xl:col-span-4 space-y-8">
        <!-- Quick Stats / Timeline -->
        <UCard class="bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/50">
          <div class="space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" /> Start Date
              </span>
              <span class="font-bold text-gray-900 dark:text-white">{{ formatDate(project.start_date) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <UIcon name="i-heroicons-check-badge" /> Status
              </span>
              <span class="font-bold text-primary-600 dark:text-primary-400 capitalize">{{ project.status.replace('_', ' ') }}</span>
            </div>
          </div>
        </UCard>

        <!-- Trello Kanban -->
        <UCard class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50">
          <template #header>
            <div class="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
              <UIcon name="i-heroicons-view-columns" class="w-5 h-5 text-blue-500" />
              Kanban Workspace
            </div>
          </template>
          <div class="text-center space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <UIcon name="i-heroicons-table-cells" class="w-8 h-8" />
            </div>
            <p class="text-sm text-gray-500">Track every task, bug, and milestone in the project's dedicated Trello board.</p>
            <UButton v-if="project.trello_url" :to="project.trello_url" target="_blank" block color="blue" icon="i-heroicons-arrow-top-right-on-square">Enter Trello Board</UButton>
            <UButton v-else block disabled color="gray" variant="soft">No Board Linked</UButton>
          </div>
        </UCard>

        <!-- Communications -->
        <UCard class="bg-white/80 dark:bg-gray-800/80 shadow-xl flex flex-col h-[500px]">
          <template #header>
            <div class="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-primary-500" />
              Private Channel
            </div>
          </template>
          
          <div class="flex-1 overflow-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            <div v-for="msg in messages" :key="msg.id" :class="['p-3 rounded-2xl text-sm max-w-[90%] shadow-sm transition-all hover:shadow-md', msg.sender === 'client' ? 'bg-primary-500 text-white ml-auto rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700/50 dark:text-gray-100 rounded-tl-none']">
              {{ msg.text }}
              <span class="text-[10px] block mt-1 opacity-70" :class="msg.sender === 'client' ? 'text-right' : 'text-left'">{{ msg.time }}</span>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-2">
              <UInput v-model="newMessage" placeholder="Type a message..." class="flex-1" @keyup.enter="sendMessage" />
              <UButton color="primary" icon="i-heroicons-paper-airplane" @click="sendMessage" />
            </div>
          </template>
        </UCard>
      </div>
    </main>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
