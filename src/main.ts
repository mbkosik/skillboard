import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { VueQueryPlugin, vueQueryPlugin } from './plugins/vue-query'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, vueQueryPlugin)
app.mount('#app')
