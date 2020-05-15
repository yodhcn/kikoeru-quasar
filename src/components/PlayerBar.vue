<template>
  <q-slide-transition>
    <div v-show="currentPlayingFile.hash && hide" class="row">
      <q-item clickable v-ripple @click="toggleHide()" style="padding: 0px 5px;" class="col non-selectable">
        <q-item-section avatar>
          <q-img transition="fade" :src="samCoverUrl" style="height: 50px; width: 50px" class="rounded-borders" />
        </q-item-section>
        
        <q-item-section>
          <q-item-label lines="2">{{ currentPlayingFile.title }}</q-item-label>
          <q-item-label caption lines="1">{{ currentPlayingFile.workTitle }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-btn flat size="lg" @click="togglePlaying()" style="height: 60px; width: 60px" class="col-auto">
        <q-icon v-if="playing" name="pause" />
        <q-icon v-else name="play_arrow" />
      </q-btn>
    </div>
  </q-slide-transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PlayerBar',

  computed: {
    samCoverUrl () {
      // 从 LocalStorage 中读取 token
      const token = this.$q.localStorage.getItem('jwt-token') || ''
      const hash = this.currentPlayingFile.hash
      return hash ? `/api/cover/${hash.split('/')[0]}?type=sam&token=${token}` : ""
    },

    ...mapState('AudioPlayer', [
      'hide',
      'playing'
    ]),

    ...mapGetters('AudioPlayer', [
      'currentPlayingFile'
    ])
  },

  methods: {
    toggleHide () {
      this.$store.commit('AudioPlayer/TOGGLE_HIDE')
    },

    togglePlaying () {
      this.$store.commit('AudioPlayer/TOGGLE_PLAYING')
    }
  }
}
</script>
