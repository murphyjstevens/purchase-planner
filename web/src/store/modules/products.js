import axios from 'axios'

const baseUrl = process.env.VUE_APP_API_URL

const state = () => ({
  all: [],
  product: undefined
})

const getters = {
  find (state) {
    return (id) => {
      state.all.find(product => product.id === id)
    }
  }
}

const actions = {
  async get ({ commit }, showPurchased) {
    try {
      const response = await axios.get(`${baseUrl}/products`, { params: { showPurchased }})
      commit('setProducts', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async create ({ commit }, product) {
    try {
      if (!product) {
        console.error('Empty Product object')
        return
      }
      const response = await axios.post(`${baseUrl}/products`, product)
      commit('addProduct', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async update ({ commit }, product) {
    try {
      if (!product) {
        console.error('Empty Product object')
        return
      }
      const response = await axios.put(baseUrl + '/products', product)
      commit('updateProduct', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async markPurchased ({ commit }, request) {
    try {
      if (!request || !request.id || !request.date) {
        console.error('The parameters are invalid')
        return
      }

      commit('setIsLoading', true, { root: true })
      const response = await axios.patch(`${baseUrl}/products/${request.id}/purchases`, null, { params: { date: request.date } })
      commit('reorderProducts', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async reorder ({ commit }, request) {
    try {
      if (!request.item1 || !request.item2) {
        console.error('The parameters are invalid')
        return
      }
      commit('setIsLoading', true, { root: true })
      const response = await axios.patch(baseUrl + '/products/reorder', request)
      commit('reorderProducts', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async delete ({ commit }, projectId) {
    try {
      if (!projectId) {
        console.error('Empty ProductId')
        return
      }
      await axios.delete(baseUrl + '/products/' + projectId)
      commit('deleteProduct', projectId)
    } catch (error) {
      console.error(error)
    }
  }
}

const mutations = {
  setProducts (state, products) {
    state.all = products.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  addProduct (state, product) {
    state.all = [ ...state.all, product ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  updateProduct (state, product) {
    state.all = [
      ...state.all.filter(c => c.id !== product.id),
      product
   ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  reorderProducts (state, response) {
    const ids = [response.item1.id, response.item2.id]
    state.all = [
      ...state.all.filter(product => !ids.includes(product.id)),
      response.item1,
      response.item2
    ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  deleteProduct (state, productId) {
    state.all = state.all.filter(product => product.id !== productId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}