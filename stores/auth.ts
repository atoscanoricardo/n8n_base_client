import { defineStore } from 'pinia'
import type { User, AuthPayload, LoginInput, RegisterInput } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  const isLoading = ref(false)

  // Actions
  const login = async (credentials: LoginInput): Promise<void> => {
    isLoading.value = true
    try {
      const { mutate } = useMutation(LOGIN_MUTATION)
      const result = await mutate({
        loginInput: credentials
      })

      if (result?.data?.login) {
        const authPayload: AuthPayload = result.data.login
        setAuth(authPayload)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterInput): Promise<void> => {
    isLoading.value = true
    try {
      const { mutate } = useMutation(REGISTER_MUTATION)
      const result = await mutate({
        registerInput: userData
      })

      if (result?.data?.register) {
        const authPayload: AuthPayload = result.data.register
        setAuth(authPayload)
      }
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    
    // Clear from localStorage
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    // Redirect to login
    navigateTo('/login')
  }

  const setAuth = (authPayload: AuthPayload): void => {
    user.value = authPayload.user
    token.value = authPayload.token

    // Save to localStorage
    if (process.client) {
      localStorage.setItem('auth_token', authPayload.token)
      localStorage.setItem('auth_user', JSON.stringify(authPayload.user))
    }
  }

  const checkAuth = (): void => {
    if (process.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')

      if (savedToken && savedUser) {
        try {
          token.value = savedToken
          user.value = JSON.parse(savedUser)
        } catch (error) {
          console.error('Error parsing saved user data:', error)
          logout()
        }
      }
    }
  }

  const updateUser = (userData: Partial<User>): void => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    }
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isLoading: readonly(isLoading),

    // Actions
    login,
    register,
    logout,
    setAuth,
    checkAuth,
    updateUser
  }
})

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        id
        email
        name
        avatar
        role
        isActive
        createdAt
        updatedAt
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      token
      user {
        id
        email
        name
        avatar
        role
        isActive
        createdAt
        updatedAt
      }
    }
  }
`

