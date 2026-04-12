<template>
  <div v-if="project">
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-6 gap-4">
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="router.push('/client')"></UButton>
      <h1 class="text-xl font-bold">{{ project.title }}</h1>
      <UBadge :color="project.status === 'completed' ? 'green' : 'orange'" class="ml-auto">{{ project.status }}</UBadge>
    </header>

    <main class="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="space-y-8 lg:col-span-2">
        <UCard>
          <template #header>
            <h3 class="font-bold text-lg">Project Details</h3>
          </template>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ project.description }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            <UBadge color="gray" variant="solid">Vue.js</UBadge>
            <UBadge color="gray" variant="solid">Nuxt</UBadge>
            <UBadge color="gray" variant="solid">FastAPI</UBadge>
          </div>
        </UCard>
        
        <UCard>
          <template #header>
            <h3 class="font-bold text-lg">Work In Progress</h3>
          </template>
          <div class="rounded-lg bg-gray-100 dark:bg-gray-800 p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <UIcon name="i-heroicons-document-arrow-up" class="w-12 h-12 text-gray-400 mb-4" />
            <p class="text-gray-500 font-medium">No WIP files shared manually.</p>
            <UButton color="primary" variant="soft" class="mt-4" disabled>View Repository</UButton>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-1 border-l pl-0 lg:pl-8 dark:border-gray-800 flex flex-col h-[600px]">
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" /> Communications
        </h3>
        <div class="flex-1 overflow-auto space-y-4 pr-2 pb-4">
          <div v-for="msg in messages" :key="msg.id" :class="['p-3 rounded-lg max-w-[85%]', msg.sender === 'client' ? 'bg-primary-100 dark:bg-primary-900 ml-auto' : 'bg-gray-100 dark:bg-gray-800']">
            <p class="text-sm">{{ msg.text }}</p>
            <span class="text-xs opacity-50 block mt-1 text-right">{{ msg.time }}</span>
          </div>
        </div>
        <div class="pt-4 mt-auto border-t dark:border-gray-800 flex gap-2">
          <UInput v-model="newMessage" placeholder="Type a message..." class="flex-1" @keyup.enter="sendMessage" />
          <UButton color="primary" icon="i-heroicons-paper-airplane" @click="sendMessage" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const newMessage = ref('')

const project = ref({
  id: route.params.id,
  title: 'E-commerce Website',
  description: 'Full stack e-commerce app with dynamic products and integrated stripe payments.',
  status: 'in_progress'
})

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
</script>
