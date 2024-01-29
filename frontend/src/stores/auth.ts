import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import router from '@/router'
interface IAuth {
  token: string | null
  username: string | null
}

const LS_KEY_USERNAME = 'USERNAME'
const LS_KEY_TOKEN = 'TOKEN'

export const useAuthStore = defineStore('auth', {
  state: (): IAuth => {
    let initialState: IAuth = {
      token: null,
      username: null
    }
    if (localStorage.getItem(LS_KEY_USERNAME) !== null) {
      initialState.username = localStorage.getItem(LS_KEY_USERNAME)!
    }
    if (localStorage.getItem(LS_KEY_TOKEN) !== null) {
      initialState.token = localStorage.getItem(LS_KEY_TOKEN)!
    }
    return initialState
  },
  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        let res = await api.post('/auth/login', {
          password: password,
          username: username
        })
        if (res.status === 200) {
          this.username = username
          this.token = res.data.token
          localStorage.setItem(LS_KEY_USERNAME, username)
          localStorage.setItem(LS_KEY_TOKEN, res.data.token)
          return true
        } else if (res.status === 401) console.error('Username or Password wrong')
        else {
          throw new Error()
        }
      } catch (error) {
        console.log('error caught:', error)
      }
      return false
    },
    async logout() {
      try {
        let res = await api.get('/auth/logout')
        this.username = this.token = null
        localStorage.removeItem(LS_KEY_TOKEN)
        localStorage.removeItem(LS_KEY_USERNAME)
        router.push({ name: 'Login' })
      } catch (error) {
        this.username = this.token = null
        localStorage.removeItem(LS_KEY_TOKEN)
        localStorage.removeItem(LS_KEY_USERNAME)
        router.push({ name: 'Login' })
      }
    },
    async register(username: string, password: string): Promise<boolean> {
      try {
        let res = await api.post('/auth/register', {
          password: password,
          username: username
        })
        if (res.status === 200) {
          return true
        } else if (res.status === 401) console.error('Username or Password wrong')
        else {
          throw new Error()
        }
      } catch (error) {
        console.log('error caught:', error)
      }
      return false
    }
  },
  getters: {
    isAuthenticated(): boolean {
      if (this.token !== null && this.username !== null) {
        return true
      }
      return false
    }
  }
})
