<template>
  <div>
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-6 gap-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.push('/admin')"></UButton>
      <h1 class="text-xl font-bold">Admin Dashboard</h1>
    </header>

    <main class="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <UTabs :items="tabs" class="w-full">
        <template #projects="{ item }">
          <UCard class="mt-4">
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-bold">Managed Projects</h3>
                <UButton color="primary" icon="i-heroicons-plus">New Project</UButton>
              </div>
            </template>
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="p-4 border dark:border-gray-800 rounded-lg flex justify-between items-center">
                <div>
                  <h4 class="font-semibold">Project #{{ i }}</h4>
                  <p class="text-sm text-gray-500">Client: client_foo@example.com</p>
                </div>
                <div class="flex gap-2">
                  <UButton color="gray" variant="ghost" size="sm">Edit</UButton>
                </div>
              </div>
            </div>
          </UCard>
        </template>
        <template #clients="{ item }">
          <UCard class="mt-4">
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-bold">Client Accounts</h3>
                <UButton color="primary" icon="i-heroicons-user-plus">Add Client</UButton>
              </div>
            </template>
            <div class="space-y-4">
              <div class="p-4 border dark:border-gray-800 rounded-lg flex justify-between items-center">
                <div>
                  <h4 class="font-semibold">Jane Doe</h4>
                  <p class="text-sm text-gray-500">jane@example.com</p>
                </div>
                <UBadge color="gray">Client</UBadge>
              </div>
            </div>
          </UCard>
        </template>
      </UTabs>
    </main>
  </div>
</template>

<script setup>
const router = useRouter()

const tabs = [
  { label: 'Projects', slot: 'projects', icon: 'i-heroicons-briefcase' },
  { label: 'Clients', slot: 'clients', icon: 'i-heroicons-users' },
]
</script>
