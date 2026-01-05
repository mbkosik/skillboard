import { defineStore } from 'pinia'

export interface User {
  id: string | number
  email: string
}

interface PersistedAuth {
  user: User | null
  token: string | null
}

const STORAGE_KEY = 'auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    init() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedAuth
          this.user = parsed.user ?? null
          this.token = parsed.token ?? null
        }
      } catch (e) {
        console.error('Failed to read auth from localStorage:', e)
      }
    },

    setSession(payload: { user: User | null; token: string | null }) {
      this.user = payload.user
      this.token = payload.token

      try {
        if (payload.token) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: payload.user, token: payload.token })
          )
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (e) {
        console.error('Failed to persist auth to localStorage:', e)
      }
    },

    login(payload: { token: string; user?: User }) {
      const user = payload.user ?? null
      this.setSession({ user, token: payload.token })
    },

    logout() {
      this.setSession({ user: null, token: null })
    },
  },
})

export default useAuthStore
