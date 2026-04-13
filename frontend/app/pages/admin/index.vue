<script setup>
definePageMeta({ layout: 'admin-default' })

const router = useRouter()

const tabs = [
  { label: 'Projects', slot: 'projects', icon: 'i-heroicons-briefcase' },
  { label: 'Clients', slot: 'clients', icon: 'i-heroicons-users' },
]

const stats = [
  { label: 'Total Projects', value: '12', icon: 'i-heroicons-presentation-chart-line', color: 'primary' },
  { label: 'Active Clients', value: '8', icon: 'i-heroicons-user-group', color: 'emerald' },
  { label: 'Pending Invoices', value: '3', icon: 'i-heroicons-currency-dollar', color: 'amber' }
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
        <UButton color="primary" icon="i-heroicons-plus" class="shadow-sm hover:shadow-primary-500/20 transition-all">New Project</UButton>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
      <UCard v-for="stat in stats" :key="stat.label" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-gray-100/50 dark:border-gray-700/50 hover:scale-[1.02] transition-transform">
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
                <span class="text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-2 py-1 rounded-full">3 Active</span>
              </div>
            </template>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <div v-for="i in 3" :key="i" class="py-4 first:pt-0 last:pb-0 flex justify-between items-center group">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">Portfolio Platform #{{ i }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <UIcon name="i-heroicons-user" class="w-4 h-4" /> client_{{ i }}@example.com
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" size="sm" class="rounded-full" />
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
              <div v-for="i in 4" :key="i" class="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all flex items-center gap-4">
                <UAvatar :alt="'User ' + i" size="md" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white">Client {{ i }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">client_{{ i }}@example.com</p>
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
