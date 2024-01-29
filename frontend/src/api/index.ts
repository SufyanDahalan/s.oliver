import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3000 // 3 seconds
})
api.interceptors.request.use(
  (response) => {
    // TODO add authentication from auth store.
    return response
  },
  (error) => {
    return error
  }
)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return error
  }
)

export default api
