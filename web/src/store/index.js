import { createStore } from 'vuex'

import products from './modules/products'

export default createStore({
  strict: true,
  modules: {
    products
  }
})