import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

export default defineStore('ui', {
  state: () => ({
    theme: 'light' as Theme,
  }),
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },

    initTheme() {
      let theme: Theme = 'light'
      try {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'dark' || stored === 'light') {
          theme = stored
        } else if (typeof window !== 'undefined' && window.matchMedia) {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark'
        }
      } catch (e) {
        console.error('Failed to load theme from localStorage', e)
      }

      this.setTheme(theme)
    },
  },
})
