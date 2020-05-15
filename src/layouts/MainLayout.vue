<template>
  <q-layout view="lHh Lpr lFf" class="bg-color">
    <q-drawer
      v-model="drawer"
      :mini="miniState"
      show-if-above

      :width="230"
      :breakpoint="599"
      bordered
      content-class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item 
            clickable
            v-ripple
            @click="miniState = !miniState"
            class="gt-xs"
          >
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>
          </q-item>

          <q-item 
            clickable
            v-ripple
            @click="SET_DRAWER(false)"
            class="xs"
          >
            <q-item-section avatar>
              <q-icon name="close" />
            </q-item-section>
          </q-item>

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
      <router-view class="page-content" />
    </q-page-container>

    <q-footer bordered elevated class="bg-white text-black q-pa-none" >
      <PlayerBar />
      <AudioPlayer />
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
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
      miniState: true,
      links: [
        {
          title: '媒体库',
          icon: 'widgets',
          path: '/'
        },
        {
          title: '我的列表',
          icon: 'favorite',
          path: '/mylist'
        },
        {
          title: '播放列表',
          icon: 'audiotrack',
          path: '/playlist'
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
        
      ]
    }
  },

  computed: {
    drawer: {
      get () {
        return this.$store.state.play.drawer
      },
      set (flag) {
        return this.$store.commit('play/SET_DRAWER', flag)
      }
    }
  },

  watch: {
    keyword () {
      this.$router.push(`/search/${this.keyword}`)
    }
  },

  created () {
    this.initUser()
    this.$store.dispatch('PlayList/GET_PLAY_LISTS')
    this.$store.dispatch('mylist/getMylists')
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
    },

    SET_DRAWER (flag) {
      this.$store.commit('play/SET_DRAWER', flag)
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

  .bg-color {
    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      background-color: $grey-3;
    }
    // 宽度 <= $breakpoint-xs-max (599px)
    @media (max-width: $breakpoint-xs-max) {
      background-color: white;
    }
  }

  .aline {
    // background-color: $grey-6;
    // height:2px;
    border-bottom: 1px solid #999;
  }

  
</style>
