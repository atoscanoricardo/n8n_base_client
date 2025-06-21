<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        Welcome to
        <span class="text-blue-600">AutoPlatform</span>
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Create powerful workflow automations with dynamic, editable modules. 
        Build, test, and deploy custom integrations with ease.
      </p>
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <div class="rounded-md shadow">
          <NuxtLink
            to="/workflows"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            Get Started
          </NuxtLink>
        </div>
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <NuxtLink
            to="/modules"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
          >
            Explore Modules
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="mt-16">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Workflows
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.totalWorkflows }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Successful Executions
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.successfulExecutions }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Available Modules
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.availableModules }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-16">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="activity in recentActivity" :key="activity.id" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    activity.type === 'execution' ? 'bg-green-400' : 
                    activity.type === 'workflow' ? 'bg-blue-400' : 'bg-purple-400'
                  ]"></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">
                    {{ activity.title }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ activity.description }}
                  </p>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(activity.timestamp) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const workflowStore = useWorkflowStore()

// Mock stats - in real app, fetch from API
const stats = ref({
  totalWorkflows: 0,
  successfulExecutions: 0,
  availableModules: 0
})

// Mock recent activity - in real app, fetch from API
const recentActivity = ref([
  {
    id: 1,
    type: 'execution',
    title: 'Workflow executed successfully',
    description: 'API to Email workflow completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    type: 'workflow',
    title: 'New workflow created',
    description: 'Data Processing Pipeline',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    type: 'module',
    title: 'Module updated',
    description: 'HTTP Request module v2.0',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
])

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

// Load initial data
onMounted(async () => {
  try {
    if (authStore.user) {
      await workflowStore.fetchUserWorkflows(authStore.user.id)
      stats.value.totalWorkflows = workflowStore.userWorkflows.length
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>

