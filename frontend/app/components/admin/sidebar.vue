<script setup lang="ts">
const router = useRouter()

const { public: { apiBase } } = useRuntimeConfig()
const token = useCookie('auth_token').value

const { data: projectsCount } = await useAsyncData('projects-count', async () => {
  if (!token) return 0
  const projects = await $fetch(`${apiBase}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  }) as any[]
  return projects.filter(p => p.status !== 'completed').length
}, { default: () => 0 })

// Defines the vertical navigation links and their icons.
const links = computed(() => [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/admin'
  },
  {
    label: 'Projects',
    icon: 'i-heroicons-briefcase',
    to: '/admin/projects',
    badge: projectsCount.value ? `${projectsCount.value} Active` : undefined
  },
  {
    label: 'Clients',
    icon: 'i-heroicons-users',
    to: '/admin/clients'
  },
  {
    label: 'Invoices',
    icon: 'i-heroicons-document-text',
    to: '/admin/invoices'
  },
  {
    label: 'Database',
    icon: 'i-heroicons-circle-stack',
    to: '/admin/database'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/admin/settings'
  }
])

const { logout } = useAuth()
</script>


<template>
  <aside
    class="flex-col w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors hidden lg:flex">

    <!-- Sidebar Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        Main Menu
      </h2>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Built-in Nuxt UI vertical navigation component handles active states elegantly -->
      <UVerticalNavigation :links="links"
        :ui="{ active: 'text-primary-600 dark:text-primary-400 before:bg-primary-50 dark:before:bg-primary-900/50' }" />
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-800">
      <UButton color="gray" variant="ghost" block icon="i-heroicons-arrow-right-start-on-rectangle"
        class="justify-start text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        @click="logout">
        Sign Out
      </UButton>
    </div>

  </aside>
</template>
