<template>
  <div class=" ">
    <q-header elevated :class="[{ 'bg-dark': mode }]">
      <q-toolbar>
        <!-- 左侧按钮 -->
        <q-btn flat round dense icon="menu" v-if="!mode" @click="SET_DRAWER(true)" class="xs" />

        <!-- 标题 -->
        <q-toolbar-title class="non-selectable">
          <span v-if="mode === 'add-mylist'" class="text-body2">添加到我的列表</span>
          <span v-else-if="mode === 'add-playlist'" class="text-body2">添加到播放列表</span>
          <span v-else @click="$router.push('/works')" class="text-h6 cursor-pointer">媒体库</span>
        </q-toolbar-title>

        <!-- 右侧按钮 -->
        <div class="q-gutter-x-sm row items-center">
          <!-- 搜索按钮 -->
          <q-btn flat round dense icon="search" @click="isShowSearchBox = !isShowSearchBox" class="xs" />
          <q-input dark dense rounded standout v-model="keyword" debounce="500" input-class="text-right" class="gt-xs">
            <template v-slot:append>
              <q-icon v-if="keyword === ''" name="search" />
              <q-icon v-else name="clear" @click="keyword = ''" />
            </template>
          </q-input>

          <!-- 视图切换按钮 -->
          <q-btn flat round dense @click="listView = !listView">
            <q-icon v-if="listView" name="apps" />
            <q-icon v-else name="view_list" />
          </q-btn>

          <!-- 排序按钮 -->
          <q-btn flat round dense icon="sort" @click="isShowSortBox = true" />
          
          <!-- 确认按钮 -->
          <q-btn dense color="primary" label="完成" v-if="mode" v-close-popup />
        </div>
      </q-toolbar>

      <!-- 搜索栏 -->
      <div v-if="isShowSearchBox" class="lt-sm bg-dark">
        <q-input dark dense rounded standout v-model="keyword" debounce="500" input-class=" " class="q-py-sm q-px-md">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>

          <template v-slot:append>
            <q-icon v-if="keyword !== ''" name="clear" @click="keyword = ''" />
          </template>
        </q-input>
      </div>
    </q-header>

    <div class="text-h6 text-weight-regular q-px-sm q-py-md">
      {{pageTitle}}
      <span v-show="pagination.totalCount">
        ({{pagination.totalCount}})
      </span>

      <q-btn flat round dense icon="close" :to="`${pathPrefix}/works`" v-show="restrict" />
    </div>
    
    <q-infinite-scroll @load="onLoad" :offset="250" :disable="stopLoad">
      <div v-if="works.length" class="row justify-center ">
        <q-list bordered separator v-if="listView" class="shadow-1 full-width" style="max-width: 880px;">
          <WorkListItem v-for="work in works" :key="work.id" :workid="work.id" class="" />
        </q-list>

        <div v-else class="col q-px-md row q-col-gutter-x-md q-col-gutter-y-lg" style="max-width: 1350px;">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="work in works" :key="work.id">
            <WorkCard :workid="work.id" :mode="mode" class="fit" /> 
          </div> 
        </div>
      </div>
      
      <div v-show="stopLoad" class="q-mt-lg q-mb-xl text-h6 text-bold text-center">END</div>

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <q-dialog 
      v-model="isShowSortBox"
      transition-show="scale" 
      transition-hide="fade"
      style="max-width: 400px;"
    >
      <q-card class="full-width">
        <q-list separator>
          <q-item
            clickable
            v-ripple
            v-for="option in sortOptions"
            :key="option.label"
            :active="option.label === sortOption.label"
            active-class="text-white bg-teal"
            class="non-selectable"
            @click="sortOption = option; isShowSortBox = false;"
          >
            <q-item-section>
              <q-item-label lines="1">{{ option.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import WorkCard from 'components/WorkCard'
import WorkListItem from 'components/WorkListItem'

export default {
  name: 'Works',

  components: {
    WorkCard,
    WorkListItem
  },

  props: {
    restrict: {
      type: String
    },
    mode: {
      type: String
    }
  },

  data () {
    return {
      keyword: '',
      listView: false,
      stopLoad: false,
      works: [],
      pageTitle: '',
      page: 1,
      pagination: {},
      sortOption: {
        label: '按照发售日期新到老的顺序',
        order: 'release',
        sort: 'desc'
      },
      sortOptions: [
        {
          label: '按照发售日期新到老的顺序',
          order: 'release',
          sort: 'desc'
        },
        {
          label: '按照发售日期老到新的顺序',
          order: 'release',
          sort: 'asc'
        },
        {
          label: '按照售出数量多到少的顺序',
          order: 'dl_count',
          sort: 'desc'
        },
        {
          label: '按照价格便宜到贵的顺序',
          order: 'price',
          sort: 'asc'
        },
        {
          label: '按照价格贵到便宜的顺序',
          order: 'price',
          sort: 'desc'
        },
        {
          label: '按照评价高到低的顺序',
          order: 'rate_average_2dp',
          sort: 'desc'
        },
        {
          label: '按照评论多到少的顺序',
          order: 'review_count',
          sort: 'desc'
        },
        {
          label: '按照RJ号大到小的顺序',
          order: 'id',
          sort: 'desc'
        },
        {
          label: '按照RJ号小到大的顺序',
          order: 'id',
          sort: 'asc'
        },
      ],
      isShowSortBox: false,
      isShowSearchBox: false
    }
  },

  created () {
    this.refreshPageTitle()
  },

  computed: {
    url () {
      if (this.keyword) {
        return `/api/search/${this.keyword}`
      } else if (this.$route.params.id) {
        return `/api/${this.restrict}/${this.$route.params.id}`
      } else {
        return '/api/works'
      }
    },

    pathPrefix () {
      return this.mode ? `/${this.mode.split("-")[1]}/${this.listId}/add` : ''
    },

    listId () {
      return this.$route.params.listId
    }
  },

  watch: {
    url () {
      this.reset({
        refreshPageTitle: true
      })
    },

    sortOption () {
      this.reset({
        refreshPageTitle: false
      })
    }
  },

  methods: {
    onLoad (index, done) {
      this.requestWorksQueue()
        .then(() => done())
    },

    requestWorksQueue () {
      const params = {
        order: this.sortOption.order,
        sort: this.sortOption.sort,
        page: this.pagination.currentPage + 1 || 1
      }

      return this.$axios.get(this.url, { params })
        .then((response) => {
          const works = response.data.works
          this.works = (params.page === 1) ? works.concat() : this.works.concat(works)
          this.pagination = response.data.pagination

          if (this.works.length >= this.pagination.totalCount) {
            this.stopLoad = true
          }
        })
        .catch((error) => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            if (error.response.status !== 401) {
              this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
            }
          } else {
            this.showErrNotif(error.message || error)
          }
          this.stopLoad = true
        })
    },

    refreshPageTitle () {
      if (this.$route.params.id) {
        const url = `/api/get-name/${this.restrict}/${this.$route.params.id}`
        this.$axios.get(url)
          .then((response) => {
            const name = response.data
            let pageTitle

            switch (this.restrict) {
              case 'tag':
                pageTitle = `含标签 “${name}” 的音声`
                break
              case 'va':
                pageTitle = `声优 “${name}” 的音声`
                break
              case 'circle':
                pageTitle = `社团 “${name}” 的音声`
                break
            }    

            this.pageTitle = pageTitle
          })
          .catch((error) => {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              if (error.response.status !== 401) {
                this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
              }
            } else {
              this.showErrNotif(error.message || error)
            }
          })
      } else if (this.$route.params.keyword) {
        this.pageTitle = `含关键词 “${this.$route.params.keyword}” 的音声`
      } else {
        this.pageTitle = '全部音声'
      } 
    },

    reset ({ refreshPageTitle }) {
      this.stopLoad = true
      if (refreshPageTitle) {
        this.pagination = {}
        this.refreshPageTitle()
      } else {
        this.pagination = {
          totalCount: this.pagination.totalCount
        }
      }
      
      this.requestWorksQueue()
        .then(() => {
          this.stopLoad = false
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
  }
}
</script>

