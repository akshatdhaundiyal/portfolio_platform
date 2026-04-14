<script setup lang="ts">
import { ref, computed } from 'vue'
definePageMeta({ layout: 'client-default' })

interface Project {
  id: number
  title: string
  description: string
  status: string
  start_date?: string
}

const { data: projects, pending: isLoading, refresh } = await useAsyncData<Project[]>('client-projects', async () => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = useCookie('auth_token').value
  
  if (!token) return []
  
  try {
    const res = await $fetch<Project[]>('/projects', {
      baseURL: apiBase,
      headers: { Authorization: `Bearer ${token}` }
    })
    return res || []
  } catch (e) {
    console.error("Failed to fetch client projects:", e)
    return []
  }
}, {
  default: () => []
})

const router = useRouter()

function goToProject(id: number) {
  router.push(`/client/${id}`)
}

const stats = computed(() => {
  const activeCount = projects.value.filter(p => p.status !== 'completed').length
  const completedCount = projects.value.filter(p => p.status === 'completed').length
  
  return [
    { label: 'Active Projects', value: activeCount, icon: 'i-heroicons-bolt', color: 'primary' },
    { label: 'Completed', value: completedCount, icon: 'i-heroicons-check-badge', color: 'emerald' }
  ]
})
</script>

<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Header with visual flair -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 text-white shadow-2xl">
      <div class="relative z-10">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-2">Welcome Back!</h1>
        <p class="text-primary-100 text-lg max-w-xl">Track your ongoing projects, view deliverables, and monitor progress in real-time.</p>
      </div>
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UCard v-for="stat in stats" :key="stat.label" class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-gray-100/50 dark:border-gray-700/50">
        <div class="flex items-center gap-4">
          <div :class="`p-3 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/40`">
            <UIcon :name="stat.icon" :class="`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ stat.label }}</p>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Project Feed -->
    <section class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-queue-list" class="text-primary-500" />
          Your Workspace
        </h2>
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" :loading="isLoading" @click="refresh">Refresh</UButton>
      </div>

      <div v-if="projects.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <UIcon name="i-heroicons-folder-open" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">No projects found</h3>
        <p class="text-gray-500 max-w-xs text-center mt-2">When projects are assigned to your workspace, they will appear here.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <template v-if="isLoading">
          <USkeleton v-for="i in 2" :key="i" class="h-64 w-full rounded-3xl" />
        </template>
        
        <UCard 
          v-for="project in projects" 
          :key="project.id" 
          class="group hover:ring-2 hover:ring-primary-500 transition-all cursor-pointer bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 shadow-sm overflow-hidden"
          :ui="{ body: { padding: 'p-0' } }"
          @click="goToProject(project.id)"
        >
          <div class="p-8 space-y-4">
            <div class="flex justify-between items-start">
              <UBadge 
                :color="project.status === 'completed' ? 'emerald' : 'primary'" 
                variant="subtle" 
                class="rounded-full px-3 py-1 font-bold uppercase tracking-wider text-[10px]"
              >
                {{ project.status }}
              </UBadge>
              <div class="text-xs text-gray-400 font-medium">#{{ project.id }}</div>
            </div>

            <div>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                {{ project.title }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                {{ project.description }}
              </p>
            </div>

            <div class="pt-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">View Timeline</span>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </UCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
