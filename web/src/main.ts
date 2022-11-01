import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import '@/assets/global.css'
import '@/assets/bootstrap-override.css'
// import '@/registerServiceWorker'

const app = createApp(App)

app.directive('select-all', el => {
  el.onfocus = () => el.select()
})

app.use(createPinia())

app.mount('#app')