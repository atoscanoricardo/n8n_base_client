export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface WorkflowNode {
  id: string
  type: string
  moduleId: string
  position: { x: number; y: number }
  configuration: Record<string, any>
  inputs: string[]
  outputs: string[]
}

export interface WorkflowConnection {
  id: string
  sourceNodeId: string
  sourceOutput: string
  targetNodeId: string
  targetInput: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  userId: string
  status: 'draft' | 'active' | 'inactive' | 'archived'
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  settings: Record<string, any>
  variables: Record<string, any>
  isPublic: boolean
  executionCount: number
  lastExecutedAt?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ModuleInput {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description?: string
  default?: any
  options?: any[]
  validation?: any
}

export interface ModuleOutput {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
}

export interface ModuleConfiguration {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array'
    required?: boolean
    default?: any
    description?: string
  }
}

export interface ModuleSchema {
  inputs: ModuleInput[]
  outputs: ModuleOutput[]
  configuration: ModuleConfiguration
}

export interface WorkflowModule {
  id: string
  name: string
  description?: string
  category: string
  createdBy: string
  moduleSchema: ModuleSchema
  code: {
    execute: string
  }
  version: string
  isActive: boolean
  isPublic: boolean
  usageCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  userId: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
  triggerType?: string
  inputData?: any
  outputData?: any
  executionLog?: any[]
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

export interface Credential {
  id: string
  name: string
  description?: string
  serviceType: string
  userId: string
  metadata?: any
  isActive: boolean
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

