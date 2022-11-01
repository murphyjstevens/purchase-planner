import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

import { type Product } from '@/models'

export const useProductStore = defineStore('product', () => {
  const baseUrl = import.meta.env.VITE_API_URL
  const useLocalStorage = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true'

  const all: Ref<Array<Product>> = ref([])
  const product: Ref<Product | null> = ref(null)
  
  async function get(showPurchased: boolean) {
    try {
      let response
      if (useLocalStorage) {
        let products: Array<Product> = JSON.parse(localStorage.getItem('products'))
        if (!products?.length) {
          products = []
        }
        products = products.filter(product => !!product.purchasedDate === !!showPurchased)
        response = { data: products }
      } else {
        response = await axios.get(`${baseUrl}/products`, { params: { showPurchased }})
      }

      if (showPurchased) {
        all.value = response.data.sort((a, b) => new Date(b.purchasedDate).getTime() - new Date(a.purchasedDate).getTime())
      } else {
        all.value = response.data.sort((a, b) => a.sortOrder - b.sortOrder)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function create(product: Product) {
    try {
      if (!product) {
        console.error('Empty Product object')
        return
      }
      let response
      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        if (!allProducts?.length) {
          allProducts = []
        }
        // allProducts = allProducts.map(convertProduct)
        const newId = allProducts.length ? allProducts.map(p => p.id).reduce((a: number, b: number) => a > b ? a : b) + 1 : 1

        product.id = newId
        product.lastModified = new Date()
        product.purchasedDate = null
        const products = [ ...allProducts, product ]
        localStorage.setItem('products', JSON.stringify(products))
        response = { data: product }
      } else {
        response = await axios.post(`${baseUrl}/products`, product)
      }

      all.value = [ ...all.value, product ].sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error) {
      console.error(error)
    }
  }

  async function update(product: Product) {
    try {
      if (!product) {
        console.error('Empty Product object')
        return
      }
      let response
      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        if (!allProducts?.length) {
          allProducts = []
        }
        // allProducts = allProducts.map(convertProduct)

        const products = allProducts.filter(p => p.id !== product.id)
        products.push(product)
        localStorage.setItem('products', JSON.stringify(products))
        response = { data: product }
      } else {
        response = await axios.put(baseUrl + '/products', product)
      }

      all.value = [
        ...all.value.filter(c => c.id !== product.id),
        product
     ].sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error) {
      console.error(error)
    }
  }

  async function markPurchased(request: any) {
    try {
      if (!request || !request.id || !request.date) {
        console.error('The parameters are invalid')
        return
      }

      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        if (!allProducts?.length) {
          allProducts = []
        }
        // allProducts = allProducts.map(convertProduct)

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

      const deletedProduct = all.value.find(p => p.id === request.id)
      const products = all.value
      if (deletedProduct) {
        products.forEach(product => {
          if (product.sortOrder > deletedProduct.sortOrder) {
            product.sortOrder--
          }
        })
      }
      all.value = products.filter(product => product.id !== request.id)
    } catch (error) {
      // commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  }

  async function reorder (request: any) {
    try {
      if (!request.item1 || !request.item2) {
        console.error('The parameters are invalid')
        return
      }

      let response
      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        if (!allProducts?.length) {
          allProducts = []
        }
        // allProducts = allProducts.map(convertProduct)
        console.log(request)
        console.log(allProducts)

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
        response = { item1: product1, item2: product2 }
      } else {
        response = await axios.patch(baseUrl + '/products/reorder', request)
      }

      const ids = [response.item1.id, response.item2.id]
      all.value = [
        ...all.value.filter(product => !ids.includes(product.id)),
        response.item1,
        response.item2
      ].sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error) {
      // commit('setToast', { toastMessage: error.message, isError: true }, { root: true })
      console.error(error)
    }
  }

  async function deleteProduct(productId: number) {
    try {
      if (!productId) {
        console.error('Empty ProductId')
        return
      }

      if (useLocalStorage) {
        let allProducts = JSON.parse(localStorage.getItem('products'))
        if (!allProducts?.length) {
          allProducts = []
        }
        // allProducts = allProducts.map(convertProduct)

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

      const deletedProduct = all.value.find(p => p.id === productId)
      const products = all.value
      if (deletedProduct) {
        products.forEach(product => {
          if (product.sortOrder > deletedProduct.sortOrder) {
            product.sortOrder--
          }
        })
      }
      all.value = products.filter(product => product.id !== productId)
    } catch (error) {
      console.error(error)
    }
  }

  return { all, product, get, create, update, markPurchased, reorder, deleteProduct }
})
