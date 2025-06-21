<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Global app configuration
useHead({
  title: 'Automation Platform',
  meta: [
    { name: 'description', content: 'Advanced workflow automation platform with dynamic modules' }
  ]
})

// Initialize stores
const authStore = useAuthStore()

// Check authentication on app start
onMounted(() => {
  authStore.checkAuth()
})
</script>

<style>
/* Global styles are imported in nuxt.config.ts */
</style>

