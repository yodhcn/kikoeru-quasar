<template>
  <q-layout view="hHh Lpr lff" class="bg-grey-3">
    <q-header class="shadow-4">
      <q-toolbar>
        <q-btn flat dense round @click="drawerOpen = !drawerOpen" icon="menu" aria-label="Menu" />

        <q-toolbar-title class="gt-xs">
          <router-link :to="'/'" class="text-white">
            Kikoeru
          </router-link>
        </q-toolbar-title>
        
        <q-input dark dense rounded standout v-model="keyword" debounce="500" input-class="text-right" class="q-mr-sm">
          <template v-slot:append>
            <q-icon v-if="keyword === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="keyword = ''" />
          </template>
        </q-input>

        
      </q-toolbar>
      
      <AudioPlayer />
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above

      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay

      :width="230"
      :breakpoint="500"
      bordered
      content-class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item 
            clickable
            v-ripple
            exact
            :to="link.path"
            active-class="text-deep-purple text-weight-medium"
            v-for="(link, index) in links"
            :key="index"
            @click="miniState = true"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                {{link.title}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- <q-page padding> -->
        <router-view class="page-content" />
      <!-- </q-page> -->
      
    </q-page-container>

    <q-footer bordered elevated class="bg-white text-black q-pa-none" >
      <PlayerBar />
    </q-footer>
  </q-layout>
</template>

<script>
import NavBar from 'components/NavBar'
import PlayerBar from 'components/PlayerBar'
import AudioPlayer from 'components/AudioPlayer'

export default {
  name: 'MainLayout',

  components: {
    NavBar,
    PlayerBar,
    AudioPlayer
  },

  data () {
    return {
      keyword: '',
      drawerOpen: false,
      miniState: true,
      links: [
        {
          title: '媒体库',
          icon: 'widgets',
          path: '/'
        },
        {
          title: 'Circles',
          icon: 'group',
          path: '/circles'
        },
        {
          title: 'Tags',
          icon: 'label',
          path: '/tags'
        },
        {
          title: 'VAs',
          icon: 'mic',
          path: '/vas'
        },
        {
          title: 'Playlist',
          icon: 'mic',
          path: '/playlist'
        }
      ]
    }
  },

  watch: {
    keyword () {
      this.$router.push(`/search/${this.keyword}`)
    }
  },

  created () {
    this.initUser()
    this.$store.dispatch('PlayList/GET_USER_PLAY_LISTS')
  },

  methods: {
    initUser () {
      this.$axios.get('/api/me')
        .then((res) => {
          this.$store.commit('User/INIT', res.data.user)
          this.$store.commit('User/SET_AUTH', res.data.auth)
        })
        .catch((error) => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            if (error.response.status === 401) {
              this.showWarnNotif(error.response.data.error)
              // 验证失败，跳转到登录页面
              this.$router.push('/login')
            } else {
              this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
            }
          } else {
            this.showErrNotif(error.message || error)
          }
        })
    },

    showWarnNotif (message) {
      this.$q.notify({
        message,
        color: 'warning',
        icon: 'warning',
      })
    },

    showErrNotif (message) {
      this.$q.notify({
        message,
        color: 'negative',
        icon: 'bug_report'
      })
    }
  },

  beforeRouteUpdate (to, from, next) {
    this.rightDrawerOpen = false

    // 离开搜索页面时清空输入框
    if (to.path.indexOf('search') === -1) {
      this.keyword = ''
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
  a {
   text-decoration:none;
  }

  
</style>
