<template>
  <div class="">
    <q-header class="shadow-1">
      <q-toolbar>
        <!-- 左侧按钮 -->
        <q-btn flat dense icon="arrow_back_ios" v-go-back="`/mylist`" >
          <span class="text-h6">返回</span>
        </q-btn>

        <q-space />

        <!-- 右侧按钮 -->
        <q-btn flat dense v-if="!isEditMode && !isSaving" @click="isEditMode = true">
          <span class="text-h6">编辑</span>
        </q-btn>

        <q-btn flat dense v-else :loading="isSaving" @click="saveList()">
          <span class="text-h6">保存</span>

          <template v-slot:loading>
            <q-spinner-hourglass />
          </template>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- 列表信息栏 -->
    <div v-if="mylist" class="row justify-center">
      <q-card square class="col list-info">
        <q-item class="snon-selectable" style="height: 105px; padding: 10px;">
          <q-item-section avatar>
            <q-img transition="fade" :src="samCoverUrl(worksCache[0])" style="height: 80px; width: 80px;" />
          </q-item-section>

          <q-item-section top>
            <q-item-label v-if="!isEditMode" lines="1" class="text-subtitle1 text-weight-medium">{{ listNameCache }}</q-item-label>
            <q-item-label v-if="!isEditMode" caption lines="1">{{ `${worksCache.length} 作品` }}</q-item-label>
            
            <div v-else class="column">       
              <q-input dense outlined v-model="listNameCache" class="col" />
              <q-btn dense color="red" icon="delete" size="md" label="删除" @click="deleteList()" class="col-auto self-end q-mt-sm" />
            </div>           
          </q-item-section> 
        </q-item>
      </q-card>
    </div>

    <!-- 列表 -->
    <div v-if="mylist && worksCache.length" class="row justify-center">
      <q-list bordered class="col bg-white shadow-2 list">
        <draggable
          handle=".handle"
          v-model="worksCache"
        >
          <div v-for="(work, index) in worksCache" :key="work.id">
            <q-item
              :clickable="!isEditMode"
              v-ripple
              @click="onClickItem(work)"
              class="non-selectable"
              style="height: 80px; padding: 10px;"
            >
              <!-- 移除按钮 -->
              <q-item-section side v-if="isEditMode">
                <q-icon name="remove_circle" color="red" @click="worksCache.splice(index, 1)" class="cursor-pointer" />
              </q-item-section>

              <!-- 封面缩略图 -->
              <q-item-section avatar>
                <q-img transition="fade" :src="samCoverUrl(work)" style="height: 60px; width: 60px;" />
              </q-item-section>
              
              <q-item-section>
                <q-item-label lines="2" class="text-subtitle1 text-weight-medium">{{ work.title }}</q-item-label>
                <q-item-label caption lines="1">{{ work.circle.name }}</q-item-label>
              </q-item-section>

              <!-- 拖拽排序按钮 -->
              <q-item-section side class="handle cursor-pointer" v-show="isEditMode">
                <q-icon name="reorder" />
              </q-item-section>
            </q-item>

            <!-- 分隔栏 -->
            <div class="aline" v-if="index !== worksCache.length - 1" />
          </div>
        </draggable>
      </q-list>
    </div>

    <q-page-sticky v-if="isEditMode" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="openPicker()" />
    </q-page-sticky>
    
    <q-dialog no-route-dismiss maximized v-if="this.$route.name !== 'mylistwork'" transition-show="slide-up" transition-hide="slide-down" v-model="isShowPicker" @hide="afterPickerHide()">
      <q-layout view="lHh Lpr lFf" container class="bg-grey-3 picker">
        <q-page-container>
          <router-view />
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'


export default {
  name: 'MyListWork',

  components: {
    draggable
  },

  props: ['listId'],

  data () {
    return {
      isEditMode: false,
      isSaving: false,
      isShowPicker: true,
      worksCache: null,
      listNameCache: ''
    }
  },

  computed: {
    ...mapState('mylist', [
      'mylists'
    ]),

    mylist () {
      const list = this.mylists ? this.mylists.find(list => list.id === Number(this.listId)) : null

      // mylist 缓存，对 mylist 的修改先在缓存中进行
      if (list) {
        this.worksCache = list.works.concat()
        this.listNameCache = list.name
        
      }
      
      
      return list
    }

    
  },

  methods: {
    openPicker () {
      this.isShowPicker = true
      this.$router.push(`/mylist/${this.listId}/add/works`)
    },

    afterPickerHide () {
      this.$router.push(`/mylist/${this.listId}`)
    },

    samCoverUrl (work) {
      // 后端服务器在找不到对应封面图片时会返回一张默认图片
      const workid = work ? work.id : 'no-image'
      // 从 LocalStorage 中读取 token
      const token = this.$q.localStorage.getItem('jwt-token') || ''
      return `/api/cover/${workid}?type=sam&token=${token}`
    },

    onClickItem (work) {
      this.$router.push(`/work/${work.id}`)
    },

    onMoved () {
    },

    saveList () {
      this.isSaving = true
      this.isEditMode = false
      this.$store.dispatch('mylist/updateMylist', {
        id: this.mylist.id,
        name: this.listNameCache,
        works: this.worksCache
      })
        .then(() => {
          this.isSaving = false
          this.showSuccNotif('保存成功')
        })
        .catch((err) => {
          this.showErrNotif(`保存失败: ${err.message}`)
          this.worksCache = list.works.concat()
          this.listNameCache = list.name
        })
    },

    deleteList () {
      this.$store.dispatch('mylist/deleteMylist', this.mylist.id)
        .then(() => {
          this.$router.push(`/mylist`)
          this.showSuccNotif('删除成功')
        })
        .catch((err) => {
          this.showErrNotif(`删除失败: ${err.message}`)
        })
    },

    showSuccNotif (message) {
      this.$q.notify({
        message,
        color: 'positive',
        icon: 'done',
        timeout: 500
      })
    },

    showErrNotif (message) {
      this.$q.notify({
        message,
        color: 'negative',
        icon: 'bug_report'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list {
    width: 100%;
    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      margin: 0px 20px 50px 20px;
      max-width: 880px;
    }
    // 宽度 <= $breakpoint-xs-max (599px)
    @media (max-width: $breakpoint-xs-max) {
      box-shadow: none;
    }
  }

  .list-info {
    width: 100%;
    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      margin: 15px 20px;
      max-width: 880px;
    }
    // 宽度 <= $breakpoint-xs-max (599px)
    @media (max-width: $breakpoint-xs-max) {
      box-shadow: none;
    }
  }

  .picker  {
    // 宽度 <= $breakpoint-xs (599px)
    @media (max-width: $breakpoint-sm) {

    }

    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      height:calc(100% - 100px);
      width: calc(100% - 100px);
      // margin:50px
    }
  }

  .aline {
    // background-color: $grey-6;
    // height:2px;
    border-bottom: 1px solid $grey-4;
  }

  .page {
    width: 100%;
    // 宽度 >= $breakpoint-sm-min (600px)
    @media (min-width: $breakpoint-sm-min) {
      padding: 0px 20px 50px 20px;
      // max-width: 880px;
    }
    // 宽度 <= $breakpoint-xs-max (599px)
    // @media (max-width: $breakpoint-xs-max) {
    //   box-shadow: none;
    // }
  }

  // .page-content {
  //   // 宽度 > $breakpoint-sm-min
  //   @media (min-width: $breakpoint-sm-min) {
  //     padding: 0px 20px 50px 20px;
  //     background-color: #eeeeee;
  //   }
    
  // }
</style>

