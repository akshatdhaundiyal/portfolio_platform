<script setup>
const router = useRouter()

definePageMeta(
  {
    layout:'login'
  }
)

onMounted(() => {
  router.push('/login')
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
    <h1>Home Page</h1>
  </div>
</template>