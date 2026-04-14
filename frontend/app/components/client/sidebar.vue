<script setup>
const router = useRouter()
const route = useRoute()

// Computed property to dynamically serve links based on context
const isPublicRoute = computed(() => {
  return route.path === '/' || route.path.startsWith('/about') || route.path.startsWith('/login')
})

const currentLinks = computed(() => {
  if (isPublicRoute.value) {
    return [
      {
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/'
      },
      {
        label: 'About Me',
        icon: 'i-heroicons-user',
        to: '/about'
      },
      {
        label: 'Client Portal',
        icon: 'i-heroicons-briefcase',
        to: '/client'
      }
    ]
  }

  // Private Portal Links
  return [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/client'
    },
    {
      label: 'Projects',
      icon: 'i-heroicons-briefcase',
      to: '/projects',
      badge: '3 Active'
    },
    {
      label: 'Monitoring',
      icon: 'i-heroicons-users',
      to: '/client'
    },
    {
      label: 'Invoices',
      icon: 'i-heroicons-document-text',
      to: '/client/invoices'
    },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      to: '/admin/settings'
    }
  ]
})

const { logout } = useAuth()

function handleFooterAction() {
  if (isPublicRoute.value) {
    router.push('/login')
  } else {
    logout()
  }
}
</script>

<template>
  <aside
    class="flex-col w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors hidden lg:flex">

    <!-- Sidebar Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {{ isPublicRoute ? 'Portfolio Menu' : 'Portal Menu' }}
      </h2>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Built-in Nuxt UI vertical navigation component handles active states elegantly -->
      <UVerticalNavigation :links="currentLinks"
        :ui="{ active: 'text-primary-600 dark:text-primary-400 before:bg-primary-50 dark:before:bg-primary-900/50' }" />
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-800">
      <UButton 
        v-if="isPublicRoute"
        color="primary" 
        variant="soft" 
        block 
        icon="i-heroicons-arrow-right-end-on-rectangle"
        class="justify-start transition-colors"
        @click="handleFooterAction">
        Sign In
      </UButton>
      
      <UButton 
        v-else
        color="gray" 
        variant="ghost" 
        block 
        icon="i-heroicons-arrow-right-start-on-rectangle"
        class="justify-start text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        @click="handleFooterAction">
        Sign Out
      </UButton>
    </div>

  </aside>
</template>
