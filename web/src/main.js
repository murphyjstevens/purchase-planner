import { createApp, h } from 'vue'

import { filters } from './filters'
import store from './store'

import App from './App.vue'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'normalize.css/normalize.css'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './assets/global.scss'
import './assets/bootstrap-override.css'
import './registerServiceWorker'

const app = createApp({
  render: () => h(App)
})

app.config.globalProperties.$filters = filters

app.directive('select-all', el => {
  el.onfocus = () => el.select()
})

app.use(store)

app.mount('#app')