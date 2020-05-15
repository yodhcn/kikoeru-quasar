/*
export function someMutation (state) {
}
*/

const mutations = {
  SET_DRAWER (state, flag) {
    state.drawer = flag
  },

  TOGGOLE_DRAWER (state) {
    state.drawer = !state.drawer
  }
  
    
}

export default mutations
