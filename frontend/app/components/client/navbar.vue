<script setup>
const router = useRouter()
const colorMode = useColorMode()
const { user, isLoggedIn, fetchUser, logout: authLogout } = useAuth()

onMounted(() => {
  if (isLoggedIn.value && !user.value) {
    fetchUser()
  }
})

// Computed property to seamlessly toggle dark mode using Nuxt UI's built-in composable
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const dropdownItems = computed(() => {
  const items = []
  
  // Account header
  items.push([{
    label: user.value?.username || 'Profile',
    slot: 'account',
    disabled: true
  }])

  // Dashboard shortcuts
  const dashboardItems = []
  if (user.value?.role === 'admin') {
    dashboardItems.push({
      label: 'Admin Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/admin'
    })
  }
  dashboardItems.push({
    label: 'Client Portal',
    icon: 'i-heroicons-briefcase',
    to: '/client'
  })
  items.push(dashboardItems)

  // Settings & Logout
  items.push([
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      to: '/admin/settings'
    },
    {
      label: 'Sign Out',
      icon: 'i-heroicons-log-out',
      click: authLogout
    }
  ])

  return items
})

// Navigation links array making it easy to add or remove links without editing HTML
const links = computed(() => {
  const list = [
    { label: 'Home', to: '/', icon: 'i-heroicons-home' },
    { label: 'About', to: '/about', icon: 'i-heroicons-user' }
  ]

  if (user.value?.role === 'admin') {
    list.push({ label: 'Dashboard', to: '/admin', icon: 'i-heroicons-squares-2x2', class: 'text-primary-600 font-bold' })
  } else {
    list.push({ label: 'Client Portal', to: '/client', icon: 'i-heroicons-briefcase' })
  }

  return list
})

const isDrawerOpen = ref(false)

// Close drawer on navigation
watch(() => router.currentRoute.value.fullPath, () => {
  isDrawerOpen.value = false
})
</script>
<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo / Brand Section -->
        <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer group" @click="router.push('/')">
          <div class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span class="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 group-hover:text-primary-500 transition-colors">
            Portfolio
          </span>
        </div>

        <!-- Desktop Navigation Center -->
        <nav class="hidden md:flex items-center space-x-1">
          <UButton 
            v-for="link in links" 
            :key="link.to" 
            :to="link.to" 
            color="gray" 
            variant="ghost" 
            class="font-medium px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            active-class="bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
          >
            {{ link.label }}
          </UButton>
        </nav>

        <!-- Right Side Actions (Theme Toggle & CTA) -->
        <div class="flex items-center gap-3">
          
          <ClientOnly>
            <UButton
              :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="gray"
              variant="ghost"
              aria-label="Toggle Theme"
              class="rounded-full flex-shrink-0 hover:rotate-12 transition-transform"
              @click="isDark = !isDark"
            />
          </ClientOnly>

          <div class="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-800" /> <!-- Divider -->

          <!-- Dynamic Auth Section -->
          <div v-if="isLoggedIn && user" class="hidden sm:flex items-center">
            <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
              <UButton
                color="gray"
                variant="ghost"
                class="font-semibold gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center"
              >
                <UAvatar
                  src=""
                  :alt="user.username"
                  size="xs"
                  class="ring-1 ring-gray-200 dark:ring-gray-800"
                />
                <span class="max-w-[100px] truncate">{{ user.fullname || user.username }}</span>
                <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 text-gray-400" />
              </UButton>

              <template #account="{ item }">
                <div class="text-left">
                  <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1">
                    Signed in as
                  </p>
                  <p class="truncate font-bold text-gray-900 dark:text-white px-2 pb-1">
                    {{ user.username }}
                  </p>
                </div>
              </template>
            </UDropdown>
          </div>

          <!-- Login CTA (Hidden on mobile to save space) -->
          <UButton 
            v-else
            color="primary" 
            variant="solid" 
            to="/login" 
            class="hidden sm:flex font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            trailing-icon="i-heroicons-arrow-right-20-solid"
          >
            Sign In
          </UButton>

          <!-- Mobile Menu Button -->
          <UButton 
            icon="i-heroicons-bars-3" 
            color="gray" 
            variant="ghost" 
            class="md:hidden" 
            @click="isDrawerOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <USlideover v-model="isDrawerOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-primary-500" />
              <span class="font-bold">Navigation</span>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isDrawerOpen = false" />
          </div>
        </template>

        <div class="py-4 px-2">
          <UVerticalNavigation :links="links" :ui="{ base: 'py-3' }" />
        </div>

        <template #footer>
          <div v-if="isLoggedIn && user" class="space-y-4">
            <div class="flex items-center gap-3 px-2 py-2">
              <UAvatar size="md" :alt="user.username" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate text-gray-900 dark:text-white">{{ user.fullname || user.username }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
              </div>
            </div>
            <UButton color="red" variant="soft" block icon="i-heroicons-log-out" @click="authLogout">Sign Out</UButton>
          </div>
          <div v-else class="px-2 pb-4">
            <UButton color="primary" block to="/login" icon="i-heroicons-log-in">Sign In</UButton>
          </div>
        </template>
      </UCard>
    </USlideover>
  </header>
</template>


