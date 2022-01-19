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
  async get ({ commit }) {
    try {
      const response = await axios.get(baseUrl + '/products')
      commit('setProducts', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async find ({ commit, state }, productId) {
    try {
      if (!productId) {
        console.error('Empty ProductId')
        return
      }
      if (state.all.length) {
        commit('setProduct', state.all.find(product => product.id === productId))
      } else {
        const response = await axios.get(baseUrl + '/products/' + productId)
        commit('setProduct', response.data)
      }
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
      const response = await axios.post(baseUrl + '/products', product)
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
    state.all = products
  },
  setProduct (state, product) {
    state.product = product
  },
  addProduct (state, product) {
    state.all.push(product)
  },
  updateProduct (state, product) {
    if (state.all.length) {
      const index = state.all.findIndex(p => p.id === product.id)
      if (index !== -1) {
        state.all[index] = product
      }
    }
    state.product = product
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