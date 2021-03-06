<template>
  <q-card>
    <router-link :to="`/work/${metadata.id}`">
      <CoverSFW :workid="metadata.id" :nsfw="false" :release="metadata.release" />
    </router-link>

    <q-separator />

    <!-- 标题 -->
    <div class="q-mx-sm text-h6 text-weight-regular ellipsis-2-lines">
      <router-link :to="`${pathPrefix}/work/${metadata.id}`" class="text-black">
        {{ metadata.title }}
      </router-link>
    </div>
    
    <!-- 社团 -->
    <div class="q-ml-sm q-mt-sm q-mb-xs text-subtitle1 text-weight-regular ellipsis">
      <router-link :to="`${pathPrefix}/works/circle/${metadata.circle.id}`" class="text-grey">
        {{ metadata.circle.name }} 
      </router-link>
    </div>

    <!-- 评价&评论 -->
    <div v-show="metadata.title" class="row items-center">
      <!-- 评价 -->
      <div class="col-auto q-ml-sm">
        <q-rating
          :value="metadata.rate_average_2dp || 0"
          size="sm"
          color="amber"
          icon="star_border"
          icon-selected="star"
          icon-half="star_half"
          readonly 
        />

        <!-- 评价分布明细 -->
        <q-tooltip content-class="text-subtitle1">
          <div>平均: {{ metadata.rate_average_2dp }}</div>
          <div v-for="(rate, index) in metadata.rate_count_detail" :key=index class="row items-center">
            <div class="col">{{ rate.review_point }}星</div>

            <!-- 评价占比 -->
            <q-linear-progress
              :value="rate.ratio/100"
              color="amber"
              track-color="white"
              style="height: 15px; width: 100px"
              class="col-auto"
            />

            <div class="col q-mx-sm">({{ rate.count }})</div>
          </div>            
        </q-tooltip>
      </div>

      <div class="col-auto">
        <span class="text-weight-medium text-body1 text-red">{{ metadata.rate_average_2dp }}</span>
        <span class="text-grey"> ({{ metadata.rate_count }})</span>
      </div>

      <!-- 评论数量 -->
      <div class="col-auto q-px-sm">
        <q-icon name="chat" size="xs" />
        <span class="text-grey"> ({{ metadata.review_count }})</span>
      </div>
    </div>
    
    <!-- 价格&售出数 -->
    <div v-show="metadata.title">
      <span class="q-mx-sm text-weight-medium text-h6 text-red">{{ metadata.price }} 日元</span>
      售出数: {{ metadata.dl_count }}
    </div>
    
    <!-- 标签 -->
    <div class="q-ma-xs">
      <router-link
        v-for="(tag, index) in metadata.tags"
        :to="`${pathPrefix}/works/tag/${tag.id}`"
        :key=index
      >
        <q-chip size="md" class="shadow-2">
          {{ tag.name }}
        </q-chip>
      </router-link>
    </div>

    <!-- 声优 -->
    <div class="q-mx-xs q-my-sm">
      <router-link
        v-for="(va, index) in metadata.vas"
        :to="`${pathPrefix}/works/va/${va.id}`"
        :key=index
      >
        <q-chip square size="md" class="shadow-2" color="teal" text-color="white">
          {{ va.name }}
        </q-chip>
      </router-link>
    </div>
  </q-card>   
</template>

<script>
import WorkDetails from 'components/WorkDetails'
import CoverSFW from 'components/CoverSFW'

export default {
  name: 'WorkCard',

  components: {
    CoverSFW,
    WorkDetails
  },

  props: {
    workid: {
      type: Number,
      required: true
    },
    mode: {
      type: String
    }
  },

  data () {
    return {
      metadata: {
        id: this.workid,
        circle: {}
      }
    }
  },

  computed: {
    pathPrefix () {
      return this.mode ? `/${this.mode.split("-")[1]}/${this.listId}/add` : ''
    },

    listId () {
      return this.$route.params.listId
    }
  },

  created () {
    this.requestMetadata(this.workid)
  },

  watch: {
    workid (newWorkid, oldWorkid) {
      this.requestMetadata()
    }
  },

  methods: {
    requestMetadata () {
      if (this.workid) {
        this.$axios.get(`/api/work/${this.workid}`)
          .then((response) => {
            this.metadata = response.data
          })
      } 
    }
  }
}
</script>
