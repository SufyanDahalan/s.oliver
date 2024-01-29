import { useAuthStore } from '@/stores/auth'
import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3000 // 3 seconds
})
api.interceptors.request.use(
  (request) => {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
      request.headers['Authorization'] = authStore.token
    }
    return request
  },
  (error) => {
    return error
  }
)
api.interceptors.response.use(
  async (response) => {
    if (response.status === 401) {
      const authStore = useAuthStore()
      await authStore.logout()
    }
    return response
  },
  async (error) => {
    if (error.response.status === 401 && !(error.request.responseURL as string).endsWith('api/auth/logout')) {
      const authStore = useAuthStore()
      await authStore.logout()
    }
    return error
  }
)

export default api
