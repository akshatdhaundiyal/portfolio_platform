<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
    <ClientSidebar />
    <div class="flex flex-col flex-1 w-full overflow-hidden">
      <ClientNavbar />
      <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div class="max-w-7xl mx-auto w-full h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>