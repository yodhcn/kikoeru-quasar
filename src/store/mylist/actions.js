import { axios } from 'boot/axios'

const actions = {
  getMylists ({ state, commit }) {
    return axios.get('/api/mylist')
      .then((res) => {
        commit('SET_MY_LISTS', res.data.mylists)
      })
  },

  updateMylist ({ state, commit }, list) {
    return axios.put('/api/mylist', {
      id: list.id,
      name: list.name,
      works: list.works
    })
      .then((res) => {
        commit('UPDATE_MY_LIST', list)
      })
  },

  deleteMylist ({ commit }, listId) {
    return axios.delete('/api/mylist', {
      data: { mylistIds: [listId] }
    })
      .then((res) => {
        commit('DELETE_MY_LIST', listId)
      })
  }
  
}

export default actions
