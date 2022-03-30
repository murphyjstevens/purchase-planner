import axios from 'axios'

const baseUrl = process.env.VUE_APP_API_URL

const state = () => ({
  all: [],
  group: undefined
})

const getters = {
  find (state) {
    return (id) => {
      state.all.find(group => group.id === id)
    }
  }
}

const actions = {
  async get ({ commit }, showPurchased) {
    try {
      const response = await axios.get(`${baseUrl}/groups`, { params: { showPurchased }})

      commit('setGroups', { groups: response.data, showPurchased })
    } catch (error) {
      console.error(error)
    }
  },
  async create ({ commit }, group) {
    try {
      if (!group) {
        console.error('Empty Group object')
        return
      }
      const response = await axios.post(`${baseUrl}/groups`, group)
      commit('addGroup', response.data)
    } catch (error) {
      console.error(error)
    }
  },
  async update ({ commit }, group) {
    try {
      if (!group) {
        console.error('Empty Group object')
        return
      }
      const response = await axios.put(baseUrl + '/groups', group)
      commit('updateGroup', response.data)
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
      await axios.patch(`${baseUrl}/groups/${request.id}/purchases`, null, { params: { date: request.date } })
      commit('deleteGroup', request.id)
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
      const response = await axios.patch(baseUrl + '/groups/reorder', request)
      commit('reorderGroups', response.data)
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
        console.error('Empty GroupId')
        return
      }
      await axios.delete(baseUrl + '/groups/' + projectId)
      commit('deleteGroup', projectId)
    } catch (error) {
      console.error(error)
    }
  }
}

const mutations = {
  setGroups (state, { groups, showPurchased }) {
    if (showPurchased) {
      state.all = groups.sort((a, b) => new Date(b.purchasedDate).getTime() - new Date(a.purchasedDate).getTime())
    } else {
      state.all = groups.sort((a, b) => a.sortOrder - b.sortOrder)
    }
  },
  addGroup (state, group) {
    state.all = [ ...state.all, group ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  updateGroup (state, group) {
    state.all = [
      ...state.all.filter(c => c.id !== group.id),
      group
   ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  reorderGroups (state, response) {
    const ids = [response.item1.id, response.item2.id]
    state.all = [
      ...state.all.filter(group => !ids.includes(group.id)),
      response.item1,
      response.item2
    ].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  deleteGroup (state, groupId) {
    state.all = state.all.filter(group => group.id !== groupId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}