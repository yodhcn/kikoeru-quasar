import { axios } from 'boot/axios'

const actions = {
  GET_USER_PLAY_LISTS: ({ state, commit }) => {
    axios.get('/api/playlist')
      .then((res) => {
        commit('SET_PLAYLISTS', res.data.playlists)
      })
  }
}
  
  export default actions
