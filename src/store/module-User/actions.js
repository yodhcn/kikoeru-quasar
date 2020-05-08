
const actions = {
    currentPlayingFile: (state) => {
      return state.queue[state.queueIndex] || {
        hash: '',
        title: '',
        workTitle: ''
      }
    }
  }

export default actions
