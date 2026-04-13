<script setup>
const router = useRouter()

// Use default layout for home page
definePageMeta({
  layout: 'client-default'
})

const techStack = [
  'Python', 'Machine Learning', 'Vue.js', 'Nuxt', 'SQL', 'FastAPI', 'Google Looker', 'Airflow'
]
</script>

<template>
  <div class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
    <!-- Background glowing blobs -->
    <div class="absolute top-1/4 -left-20 w-72 h-72 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div class="absolute top-1/3 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-32 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

    <div class="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center space-y-8">
      
      <!-- Headline & Introduction -->
      <div class="space-y-4 fade-in-up">
        <h2 class="text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase text-sm">Portfolio & Client Portal</h2>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Hi, I'm <br class="md:hidden" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-emerald-500 to-purple-500 animate-gradient-x">
            Akshat Dhaundiyal
          </span>
        </h1>
        <p class="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
          A <strong class="font-semibold text-gray-900 dark:text-white">Data Scientist</strong> dedicated to adding value to business decisions using Machine Learning.
        </p>
      </div>

      <!-- Tech Stack Marquee / Badges -->
      <div class="flex flex-wrap justify-center gap-3 pt-6 fade-in-up animation-delay-200">
        <UBadge 
          v-for="tech in techStack" 
          :key="tech"
          color="gray" 
          variant="soft" 
          class="px-4 py-1.5 text-sm font-medium backdrop-blur-md bg-white/50 dark:bg-gray-800/50 hover:scale-105 transition-transform cursor-default border border-gray-200/50 dark:border-gray-700/50"
        >
          {{ tech }}
        </UBadge>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 pt-10 fade-in-up animation-delay-400">
        <UButton 
          size="xl" 
          color="primary" 
          variant="solid" 
          icon="i-heroicons-arrow-right" 
          trailing
          class="shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-1"
          @click="router.push('/client')"
        >
          Explore Client Portal
        </UButton>
        <UButton 
          size="xl" 
          color="gray" 
          variant="ghost" 
          icon="i-heroicons-user"
          class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          @click="router.push('/about')"
        >
          About Me
        </UButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Custom animations tailored for the hero page aesthetics */
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s ease infinite;
}
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>