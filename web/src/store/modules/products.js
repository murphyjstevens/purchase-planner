import axios from 'axios'

const baseUrl = process.env.VUE_APP_API_URL
const useLocalStorage = process.env.VUE_APP_USE_LOCAL_STORAGE === 'true'

function convertProduct(product) {
  return {
    ...product,
    id: product.id ? +product.id : null,
    cost: product.cost ? +product.cost : null,
    lastModified: product.lastModified ? new Date(product.lastModified) : null,
    purchasedDate: product.purchasedDate ? new Date(product.purchasedDate) : null,
    sortOrder: product.sortOrder ? +product.sortOrder : null
  }
}

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
      let response
      if (useLocalStorage) {
        let products = JSON.parse(localStorage.getItem('products'))
        products = products.map(convertProduct).filter(product => !!product.purchasedDate === !!showPurchased)
        response = { data: products }
      } else {
        response = await axios.get(`${baseUrl}/products`, { params: { showPurchased }})
      }

      commit('setProducts', { products: response.data, showPurchased })
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
      let response
      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        allProducts = allProducts.map(convertProduct)
        const newId = allProducts.map(p => p.id).reduce((a, b) => a > b ? a : b) + 1

        product.id = newId
        product.lastModified = new Date()
        product.purchasedDate = null
        const products = [ ...allProducts, product ]
        localStorage.setItem('products', JSON.stringify(products))
        response = { data: product }
      } else {
        response = await axios.post(`${baseUrl}/products`, product)
      }
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
      let response
      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        allProducts = allProducts.map(convertProduct)

        const products = allProducts.filter(p => p.id !== product.id)
        products.push(product)
        localStorage.setItem('products', JSON.stringify(products))
        response = { data: product }
      } else {
        response = await axios.put(baseUrl + '/products', product)
      }
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

      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        allProducts = allProducts.map(convertProduct)

        const products = allProducts.filter(p => p.id !== request.id)
        const updatedProduct = allProducts.find(p => p.id === request.id)
        if (!updatedProduct) {
          throw 'Product not found'
        }

        updatedProduct.purchasedDate = request.date
        products.push(updatedProduct)
        localStorage.setItem('products', JSON.stringify(products))
      } else {
        await axios.patch(`${baseUrl}/products/${request.id}/purchases`, null, { params: { date: request.date } })
      }
      commit('deleteProduct', request.id)
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
      let response
      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        allProducts = allProducts.map(convertProduct)

        const products = allProducts.filter(p => p.id !== request.item1.id && p.id !== request.item2.id)
        const product1 = allProducts.find(p => p.id === request.item1.id)
        const product2 = allProducts.find(p => p.id === request.item2.id)

        if (!product1 || !product2) {
          throw 'Products not found'
        }

        product1.sortOrder = request.item1.sortOrder
        product2.sortOrder = request.item2.sortOrder

        products.push(product1)
        products.push(product2)
        localStorage.setItem('products', JSON.stringify(products))
        response = { data: { item1: product1, item2: product2 } }
      } else {
        response = await axios.patch(baseUrl + '/products/reorder', request)
      }
      commit('reorderProducts', response.data)
      commit('setIsLoading', false, { root: true })
    } catch (error) {
      commit('setIsLoading', false, { root: true })
      commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  },
  async delete ({ commit }, productId) {
    try {
      if (!productId) {
        console.error('Empty ProductId')
        return
      }

      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        allProducts = allProducts.map(convertProduct)

        const deletedProduct = allProducts.find(p => p.id === productId)
        if (!deletedProduct) {
          throw 'Deleted product does not exist'
        }

        allProducts.forEach(product => {
          if (product.sortOrder > deletedProduct.sortOrder) {
            product.sortOrder--
          }
        })

        const products = allProducts.filter(p => p.id !== productId)
        localStorage.setItem('products', JSON.stringify(products))
      } else {
        await axios.delete(baseUrl + '/products/' + productId)
      }

      commit('deleteProduct', productId)
    } catch (error) {
      console.error(error)
    }
  }
}

const mutations = {
  setProducts (state, { products, showPurchased }) {
    if (showPurchased) {
      state.all = products.sort((a, b) => new Date(b.purchasedDate).getTime() - new Date(a.purchasedDate).getTime())
    } else {
      state.all = products.sort((a, b) => a.sortOrder - b.sortOrder)
    }
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
    const deletedProduct = state.all.find(p => p.id === productId)
    const products = state.all
    if (deletedProduct) {
      products.forEach(product => {
        if (product.sortOrder > deletedProduct.sortOrder) {
          product.sortOrder--
        }
      })
    }
    state.all = products.filter(product => product.id !== productId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}