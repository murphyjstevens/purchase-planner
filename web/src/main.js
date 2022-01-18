import { createApp, h } from 'vue'

import { filters } from './filters'
import store from './store'

import App from './App.vue'

import './assets/global.scss'
import './assets/bootstrap-override.css'

const app = createApp({
  render: () => h(App)
})

app.config.globalProperties.$filters = filters

app.use(store)

app.mount('#app')