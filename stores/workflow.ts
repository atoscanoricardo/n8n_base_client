import { defineStore } from 'pinia'
import type { Workflow, WorkflowExecution } from '~/types'

export const useWorkflowStore = defineStore('workflow', () => {
  // State
  const workflows = ref<Workflow[]>([])
  const currentWorkflow = ref<Workflow | null>(null)
  const executions = ref<WorkflowExecution[]>([])
  const isLoading = ref(false)

  // Getters
  const userWorkflows = computed(() => {
    const authStore = useAuthStore()
    return workflows.value.filter(w => w.userId === authStore.user?.id)
  })

  const publicWorkflows = computed(() => {
    return workflows.value.filter(w => w.isPublic)
  })

  // Actions
  const fetchWorkflows = async (): Promise<void> => {
    isLoading.value = true
    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: GET_WORKFLOWS_QUERY
        }
      })

      if (data?.workflows) {
        workflows.value = data.workflows
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserWorkflows = async (userId: string): Promise<void> => {
    isLoading.value = true
    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: GET_USER_WORKFLOWS_QUERY,
          variables: { userId }
        }
      })

      if (data?.userWorkflows) {
        workflows.value = data.userWorkflows
      }
    } catch (error) {
      console.error('Error fetching user workflows:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchWorkflow = async (id: string): Promise<void> => {
    isLoading.value = true
    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: GET_WORKFLOW_QUERY,
          variables: { id }
        }
      })

      if (data?.workflow) {
        currentWorkflow.value = data.workflow
      }
    } catch (error) {
      console.error('Error fetching workflow:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createWorkflow = async (workflowData: Partial<Workflow>): Promise<Workflow> => {
    isLoading.value = true
    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: CREATE_WORKFLOW_MUTATION,
          variables: { createWorkflowInput: workflowData }
        }
      })

      if (data?.createWorkflow) {
        const newWorkflow = data.createWorkflow
        workflows.value.push(newWorkflow)
        return newWorkflow
      }
      throw new Error('Failed to create workflow')
    } catch (error) {
      console.error('Error creating workflow:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateWorkflow = async (id: string, workflowData: Partial<Workflow>): Promise<Workflow> => {
    isLoading.value = true
    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: UPDATE_WORKFLOW_MUTATION,
          variables: { id, updateWorkflowInput: workflowData }
        }
      })

      if (data?.updateWorkflow) {
        const updatedWorkflow = data.updateWorkflow
        const index = workflows.value.findIndex(w => w.id === id)
        if (index !== -1) {
          workflows.value[index] = updatedWorkflow
        }
        if (currentWorkflow.value?.id === id) {
          currentWorkflow.value = updatedWorkflow
        }
        return updatedWorkflow
      }
      throw new Error('Failed to update workflow')
    } catch (error) {
      console.error('Error updating workflow:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteWorkflow = async (id: string): Promise<void> => {
    isLoading.value = true
    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: DELETE_WORKFLOW_MUTATION,
          variables: { id }
        }
      })

      if (data?.deleteWorkflow) {
        workflows.value = workflows.value.filter(w => w.id !== id)
        if (currentWorkflow.value?.id === id) {
          currentWorkflow.value = null
        }
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const executeWorkflow = async (workflowId: string, inputData?: any): Promise<string> => {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('User not authenticated')

    try {
      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: EXECUTE_WORKFLOW_MUTATION,
          variables: {
            workflowId,
            userId: authStore.user.id,
            inputData
          }
        }
      })

      if (data?.executeWorkflow) {
        return data.executeWorkflow
      }
      throw new Error('Failed to execute workflow')
    } catch (error) {
      console.error('Error executing workflow:', error)
      throw error
    }
  }

  const fetchExecutions = async (workflowId?: string): Promise<void> => {
    isLoading.value = true
    try {
      const query = workflowId ? GET_WORKFLOW_EXECUTIONS_QUERY : GET_USER_EXECUTIONS_QUERY
      const variables = workflowId ? { workflowId } : { userId: useAuthStore().user?.id }

      const { data } = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query,
          variables
        }
      })

      if (data?.executionsByWorkflow || data?.userExecutions) {
        executions.value = data.executionsByWorkflow || data.userExecutions
      }
    } catch (error) {
      console.error('Error fetching executions:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    workflows: readonly(workflows),
    currentWorkflow: readonly(currentWorkflow),
    executions: readonly(executions),
    isLoading: readonly(isLoading),

    // Getters
    userWorkflows,
    publicWorkflows,

    // Actions
    fetchWorkflows,
    fetchUserWorkflows,
    fetchWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,
    fetchExecutions
  }
})

// GraphQL Queries and Mutations
const GET_WORKFLOWS_QUERY = `
  query GetWorkflows {
    workflows {
      id
      name
      description
      userId
      status
      nodes
      connections
      settings
      variables
      isPublic
      executionCount
      lastExecutedAt
      tags
      createdAt
      updatedAt
    }
  }
`

const GET_USER_WORKFLOWS_QUERY = `
  query GetUserWorkflows($userId: ID!) {
    userWorkflows(userId: $userId) {
      id
      name
      description
      userId
      status
      nodes
      connections
      settings
      variables
      isPublic
      executionCount
      lastExecutedAt
      tags
      createdAt
      updatedAt
    }
  }
`

const GET_WORKFLOW_QUERY = `
  query GetWorkflow($id: ID!) {
    workflow(id: $id) {
      id
      name
      description
      userId
      status
      nodes
      connections
      settings
      variables
      isPublic
      executionCount
      lastExecutedAt
      tags
      createdAt
      updatedAt
    }
  }
`

const CREATE_WORKFLOW_MUTATION = `
  mutation CreateWorkflow($createWorkflowInput: CreateWorkflowInput!) {
    createWorkflow(createWorkflowInput: $createWorkflowInput) {
      id
      name
      description
      userId
      status
      nodes
      connections
      settings
      variables
      isPublic
      executionCount
      lastExecutedAt
      tags
      createdAt
      updatedAt
    }
  }
`

const UPDATE_WORKFLOW_MUTATION = `
  mutation UpdateWorkflow($id: ID!, $updateWorkflowInput: UpdateWorkflowInput!) {
    updateWorkflow(id: $id, updateWorkflowInput: $updateWorkflowInput) {
      id
      name
      description
      userId
      status
      nodes
      connections
      settings
      variables
      isPublic
      executionCount
      lastExecutedAt
      tags
      createdAt
      updatedAt
    }
  }
`

const DELETE_WORKFLOW_MUTATION = `
  mutation DeleteWorkflow($id: ID!) {
    deleteWorkflow(id: $id) {
      id
    }
  }
`

const EXECUTE_WORKFLOW_MUTATION = `
  mutation ExecuteWorkflow($workflowId: ID!, $userId: ID!, $inputData: String) {
    executeWorkflow(workflowId: $workflowId, userId: $userId, inputData: $inputData)
  }
`

const GET_WORKFLOW_EXECUTIONS_QUERY = `
  query GetWorkflowExecutions($workflowId: ID!) {
    executionsByWorkflow(workflowId: $workflowId) {
      id
      workflowId
      userId
      status
      triggerType
      inputData
      outputData
      executionLog
      startedAt
      completedAt
      errorMessage
      metadata
      createdAt
      updatedAt
    }
  }
`

const GET_USER_EXECUTIONS_QUERY = `
  query GetUserExecutions($userId: ID!) {
    userExecutions(userId: $userId) {
      id
      workflowId
      userId
      status
      triggerType
      inputData
      outputData
      executionLog
      startedAt
      completedAt
      errorMessage
      metadata
      createdAt
      updatedAt
    }
  }
`

