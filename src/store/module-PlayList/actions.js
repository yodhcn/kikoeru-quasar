import { axios } from 'boot/axios'

const actions = {
  GET_PLAY_LISTS: ({ state, commit }) => {
    axios.get('/api/playlist')
      .then((res) => {
        commit('SET_PLAY_LISTS', res.data.playlists)
      })
  }
}
  
export default actions
