<script setup>
definePageMeta({ layout: 'client-default' })

const router = useRouter()

const projects = ref([
  { id: 1, title: 'E-commerce Website', description: 'Building the new online store with Vue and Nuxt.', status: 'in_progress' },
  { id: 2, title: 'Marketing Dashboard', description: 'Dashboard for tracking ad metrics.', status: 'completed' },
])

function logout() {
  router.push('/login')
}

function goToProject(id) {
  router.push(`/client/${id}`)
}
</script>

<template>
  <div>
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-6 justify-between">
      <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">Client Portal</h1>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" @click="logout">Logout</UButton>
    </header>
    
    <main class="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold tracking-tight">My Projects</h2>
        <UBadge color="primary" variant="subtle">Active</UBadge>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="project in projects" :key="project.id" class="hover:border-primary-500 transition-colors cursor-pointer" @click="goToProject(project.id)">
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-semibold text-lg">{{ project.title }}</h3>
            <UBadge :color="project.status === 'completed' ? 'green' : 'orange'">{{ project.status }}</UBadge>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{{ project.description }}</p>
        </UCard>
      </div>
    </main>
  </div>
</template>
