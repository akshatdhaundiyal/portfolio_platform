<script setup>
definePageMeta({ layout: 'admin-default' })
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
    <div class="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
      <UIcon name="i-heroicons-circle-stack" class="w-12 h-12 text-primary-600 dark:text-primary-400" />
    </div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Database Management</h1>
    <p class="text-gray-500 dark:text-gray-400 max-w-md mb-8">
      This is a placeholder for the Database CRUD interface. In future updates, you'll be able to manage your tables, inspect data, and perform raw queries directly from this dashboard.
    </p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
      <UCard class="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm border-gray-100 dark:border-gray-800">
        <h3 class="font-bold text-gray-900 dark:text-white mb-1">Swagger UI</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Interact with the raw API endpoints directly.</p>
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-top-right-on-square" block to="http://localhost:8000/docs" target="_blank">
          Open Docs
        </UButton>
      </UCard>
      
      <UCard class="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed">
        <h3 class="font-bold text-gray-900 dark:text-white mb-1">Custom CRUD</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Coming Soon: Visual table manager for all models.</p>
        <UButton color="primary" variant="soft" block disabled>
          Available Soon
        </UButton>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
