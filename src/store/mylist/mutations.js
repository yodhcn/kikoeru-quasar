const mutations = {
    SET_MY_LISTS (state, mylists) {     
      state.mylists = mylists
    },

    UPDATE_MY_LIST (state, mylist) {
      const index = state.mylists.findIndex(list => list.id === mylist.id)
      state.mylists[index] = mylist
    },

    DELETE_MY_LIST (state, mylistId) {
      const index = state.mylists.findIndex(list => list.id === mylistId)
      state.mylists.splice(index, 1)
    }
  }
  
export default mutations
