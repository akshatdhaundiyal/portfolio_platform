<script setup lang="ts">
const props = defineProps<{
  projectId: number
}>()

const { user } = useAuth()
const token = useCookie('auth_token')
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

// Convert HTTP URL to WS URL
const wsBase = apiBase.replace('http', 'ws')
const wsUrl = `${wsBase}/chat/${props.projectId}?token=${token.value}`

const messages = ref<any[]>([])
const newMessage = ref('')
const socket = ref<WebSocket | null>(null)
const chatContainer = ref<HTMLElement | null>(null)

// Fetch history
const { data: history } = await useFetch<any[]>(`${apiBase}/communications/project/${props.projectId}`, {
  headers: {
    Authorization: `Bearer ${token.value}`
  }
})

if (history.value) {
  messages.value = history.value.map(m => ({
    ...m,
    sender_name: m.sender_id === user.value?.id ? 'Me' : (m.sender_name || 'User')
  }))
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const connectWebSocket = () => {
  if (socket.value) {
    socket.value.close()
  }

  socket.value = new WebSocket(wsUrl)

  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // Avoid duplicates if we broadcast to self (which we do)
    if (messages.value.find(m => m.id === data.id)) return
    
    messages.value.push({
      ...data,
      sender_name: data.sender_id === user.value?.id ? 'Me' : data.sender_name
    })
    scrollToBottom()
  }

  socket.value.onclose = (event) => {
    if (event.code !== 1000) {
      console.log('WebSocket disconnected unexpectedly. Reconnecting in 3s...')
      setTimeout(connectWebSocket, 3000)
    }
  }

  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

onMounted(() => {
  connectWebSocket()
  scrollToBottom()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.close(1000)
  }
})

const sendMessage = () => {
  if (!newMessage.value.trim() || !socket.value || socket.value.readyState !== WebSocket.OPEN) return

  socket.value.send(JSON.stringify({ message: newMessage.value }))
  newMessage.value = ''
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <UCard 
    class="flex flex-col h-[500px] overflow-hidden backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800/50 shadow-xl"
    :ui="{ body: { base: 'flex-1 overflow-hidden p-0' }, footer: { base: 'p-4 bg-gray-50/50 dark:bg-gray-800/30' } }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-primary-500" />
          <h3 class="text-lg font-bold">Project Communication</h3>
        </div>
        <UBadge 
          :color="socket?.readyState === 1 ? 'green' : 'red'" 
          variant="soft" 
          size="xs"
          class="animate-pulse"
        >
          {{ socket?.readyState === 1 ? 'Live' : 'Connecting...' }}
        </UBadge>
      </div>
    </template>

    <div ref="chatContainer" class="h-full overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/20">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-50">
        <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-12 h-12" />
        <p>No messages yet. Start the conversation!</p>
      </div>
      
      <div v-for="msg in messages" :key="msg.id" :class="['flex flex-col', msg.sender_id === user?.id ? 'items-end' : 'items-start']">
        <div :class="['max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all hover:shadow-md', 
          msg.sender_id === user?.id 
            ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-tr-none' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700']">
          <div class="flex items-center justify-between gap-4 mb-1" v-if="msg.sender_id !== user?.id">
            <span class="font-bold text-[10px] uppercase tracking-wider text-primary-400">{{ msg.sender_name }}</span>
          </div>
          <p class="leading-relaxed">{{ msg.message }}</p>
          <div class="flex items-center justify-end gap-1 mt-1 opacity-50">
            <span class="text-[9px]">{{ formatDate(msg.created_at) }}</span>
            <UIcon v-if="msg.sender_id === user?.id" name="i-heroicons-check-circle" class="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 items-center">
        <UInput 
          v-model="newMessage" 
          placeholder="Send a message to the team..." 
          class="flex-1" 
          variant="none"
          size="md"
          :ui="{ wrapper: 'bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 px-2' }"
          @keyup.enter="sendMessage"
        />
        <UButton 
          icon="i-heroicons-paper-airplane" 
          color="primary" 
          variant="solid" 
          class="rounded-full"
          @click="sendMessage" 
          :disabled="!newMessage.trim() || socket?.readyState !== 1"
        />
      </div>
    </template>
  </UCard>
</template>
