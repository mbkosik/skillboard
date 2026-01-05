import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { VueQueryPlugin, vueQueryPlugin } from './plugins/vue-query'
import './style.css'
import useAuthStore from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const auth = useAuthStore()
// Restore persisted authentication state
auth.init()

app.use(VueQueryPlugin, vueQueryPlugin)
app.mount('#app')
