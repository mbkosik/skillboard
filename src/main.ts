import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { VueQueryPlugin, vueQueryPlugin } from './plugins/vue-query'
import 'vue-sonner/style.css'
import './style.css'
import useAuthStore from '@/stores/auth'
import useUIStore from '@/stores/ui'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const auth = useAuthStore()
auth.init()

const ui = useUIStore()
ui.initTheme()

app.use(VueQueryPlugin, vueQueryPlugin)
app.mount('#app')
