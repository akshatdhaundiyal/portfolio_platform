<template>
  <div class="flex items-center justify-center min-h-screen">
    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
  </div>
</template>

<script setup>
const router = useRouter()
onMounted(() => {
  router.push('/login')
})
</script>
