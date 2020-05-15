<template>
  <div class="">
    <q-header class="shadow-1">
      <q-toolbar>
        <!-- 左侧按钮 -->
        <q-btn flat round dense icon="menu" @click="SET_DRAWER(true)" class="xs" />

        <!-- 标题 -->
        <q-toolbar-title class="non-selectable">
          <span class="text-h6">我的列表</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    
    <div class="row justify-center">
      <q-list bordered separator v-if="mylists && mylists.length" class="col bg-white shadow-2 list" style="">
        <q-item
          clickable
          v-ripple
          v-for="mylist in mylists"
          :key="mylist.id"
          @click="$router.push(`/mylist/${mylist.id}`)"
          class="non-selectable"
          style="height: 60px; padding: 10px;"
        >
          <q-item-section avatar>
            <q-img transition="fade" :src="samCoverUrl(mylist.works)" style="height: 40px; width: 40px;" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" class="text-subtitle2 text-weight-medium">{{ mylist.name }}</q-item-label>
            <q-item-label caption lines="1">{{ `${mylist.works.length} 作品` }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" to="/mylist/" @click="isEditMode = true" />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MyList',

  props: {
    
  },

  data () {
    return {
      
     
    }
  },

  created () {

  },

  computed: {
    ...mapState('mylist', [
      'mylists'
    ]),

    
   
  },

  watch: {
    
  },

  methods: {
    SET_DRAWER (flag) {
      this.$store.commit('play/SET_DRAWER', flag)
    },

    samCoverUrl (works) {
      // 后端服务器在找不到对应封面图片时会返回一张默认图片
      const workid = (works && works.length) ? works[0].id : 'no-image'
      // 从 LocalStorage 中读取 token
      const token = this.$q.localStorage.getItem('jwt-token') || ''
      return `/api/cover/${workid}?type=sam&token=${token}`
    },
  }
}
</script>

<style lang="scss" scoped>
  .list {
    width: 100%;
    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      margin: 15px 20px 50px 20px;
      max-width: 880px;
    }
    // 宽度 <= $breakpoint-xs-max (599px)
    @media (max-width: $breakpoint-xs-max) {
      box-shadow: none;
    }
  }
</style>

