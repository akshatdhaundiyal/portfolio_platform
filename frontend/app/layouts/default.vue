<template>
  <div class="flex flex-col min-h-screen relative bg-gray-50 dark:bg-gray-950">
    <ClientNavbar />
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>