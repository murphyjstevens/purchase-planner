import { createStore } from 'vuex'

import products from './modules/products'

export default createStore({
  strict: true,
  modules: {
    products
  },
  state: () => ({
    isLoading: false,
    toast: null
  }),
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setToast(state, toast) {
      state.toast = toast
    }
  }
})