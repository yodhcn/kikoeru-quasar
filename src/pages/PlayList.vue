<template>
  <div class="column items-center ">
    <q-card square class="col list ">
      <q-list separator>
        <q-item
          clickable
          v-ripple
          v-for="playlist in playlists"
          :key="playlist.name"
          class="non-selectable"
          style="height: 60px;  "
        >
          <q-item-section avatar>
            <q-img transition="fade" src="/api/cover/271879?type=sam" style="height: 44px; width: 44px" class="rounded-borders" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ playlist.name }}</q-item-label>
            <q-item-label caption lines="1">{{ `${playlist.tracks.length} 曲` }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      

      
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" to="/playlist/add" @click="isEditMode = true" />
    </q-page-sticky>
    
    <q-dialog maximized transition-show="slide-up" transition-hide="slide-down" v-model="isEditMode" >
      <q-card class="picker">
        <q-layout view="lHh Lpr lFf" container class="bg-grey-3">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-layout>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PlayList',

  props: {
    
  },

  data () {
    return {
      editPlayLists: true,
      isEditMode: false
     
    }
  },

  created () {

  },

  computed: {
    ...mapState('PlayList', [
      'playlists'
    ])
   
  },

  watch: {
    
  },

  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
  .list {
    width: 100%;
    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      margin: 15px 0px;
      max-width: 880px;
    }
    // 宽度 <= $breakpoint-xs-max (599px)
    @media (max-width: $breakpoint-xs-max) {
      box-shadow: none;
    }
  }

  .picker  {
    // 宽度 <= $breakpoint-sm (1023px)
    @media (max-width: $breakpoint-sm) {

    }

    // 宽度 >= $breakpoint-sm (1024px)
    @media (min-width: $breakpoint-md-min) {
      height:calc(100% - 100px);
      width: calc(100% - 100px);
      // margin:50px
    }
  }


  // .page-content {
  //   // 宽度 > $breakpoint-sm-min
  //   @media (min-width: $breakpoint-sm-min) {
  //     padding: 0px 20px 50px 20px;
  //     background-color: #eeeeee;
  //   }
    
  // }
</style>

