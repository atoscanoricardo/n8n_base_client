<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Navigation -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-gray-900">
                AutoPlatform
              </NuxtLink>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                to="/workflows"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-blue-500 text-gray-900"
              >
                Workflows
              </NuxtLink>
              <NuxtLink
                to="/modules"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-blue-500 text-gray-900"
              >
                Modules
              </NuxtLink>
              <NuxtLink
                to="/executions"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-blue-500 text-gray-900"
              >
                Executions
              </NuxtLink>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button
                @click="showUserMenu = !showUserMenu"
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">
                    {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </button>
            </div>

            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              style="top: 60px;"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <div class="font-medium">{{ authStore.user?.name }}</div>
                  <div class="text-gray-500">{{ authStore.user?.email }}</div>
                </div>
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Profile
                </NuxtLink>
                <NuxtLink
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Settings
                </NuxtLink>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            to="/workflows"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Workflows
          </NuxtLink>
          <NuxtLink
            to="/modules"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Modules
          </NuxtLink>
          <NuxtLink
            to="/executions"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Executions
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Click outside to close user menu -->
    <div
      v-if="showUserMenu"
      @click="showUserMenu = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const showUserMenu = ref(false)

const handleLogout = () => {
  showUserMenu.value = false
  authStore.logout()
}

// Close user menu when clicking outside
onClickOutside(showUserMenu, () => {
  showUserMenu.value = false
})
</script>

