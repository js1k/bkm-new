<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky bg-color="transparent">
      <view class="sticky-header">
        <Search :disabled="loading" placeholder="搜索技能团子名称/技能名称/技能描述" @search="doSearch" />
      </view>
    </u-sticky>
    <view class="p4">
      <Loading v-if="loading" />
      <scroll-view v-else class="scroll-list" :scroll-y="true">
        <template v-if="list.length">
          <view class="card mb4 rel" v-for="item in list" :key="item.key" :class="item.klass">
            <view class="fwb fs16">{{ item.skill_name }}</view>
            <view class="gray6 mv2">{{ item.desc }}</view>
            <view class="flex-vc flex-sb">
              <u-tag size="mini" type="info" text="团子名称" class="mr2 flex0"></u-tag>
              <view class="fs12 flex1">{{ item.meal_name }}</view>
              <!-- <u-tag size="mini" type="info" :text="item.type == 1 ? '常设团子' : '每日团子'" class="mr2 flex0"></u-tag> -->
            </view>
            <view class="flex-vc">
              <u-tag size="mini" type="info" text="解锁条件" class="mr2 flex0"></u-tag>
              <view class="fs12 flex1">{{ item.unlock }}</view>
            </view>
          </view>
        </template>
        <u-loadmore :status="status" :load-text="loadText" @loadmore="getList" />
      </scroll-view>
    </view>
    <u-top-tips ref="uTips" z-index="99999"></u-top-tips>
  </view>
</template>
<script>
import Loading from '../../components/loading';
import Search from '../../components/search';

export default {
  components: { Loading, Search },
  data() {
    return {
      list: [],
      loading: false,
      ended: false,
      pageNo: 0,
      pageSize: 20,
      status: 'loadmore',
      loadText: this.$constants.loadText,
      db: wx.cloud.database(),
      keywords: '',
    };
  },
  computed: {},
  onLoad() {
    this.init();
  },
  methods: {
    doSearch(keywords) {
      this.keywords = keywords;
      this.pageNo = 0;
      this.list = [];
      this.loading = true;
      this.getList();
    },
    init() {
      this.pageNo = 0;
      this.list = [];
      this.ended = false;
      this.loading = true;
      this.getList();
    },
    getList() {
      const { pageNo, pageSize, db, keywords } = this;
      this.status = 'loading';

      db.collection('meal')
        .where(
          keywords
            ? db.command.or([
                { meal_name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                { skill_name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                { desc: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
              ])
            : {}
        )
        .skip(pageNo * pageSize)
        .get({
          success: res => {
            const data = res.data || res.list;
            this.list = [...this.list, ...data];
            console.log(this.list);
            this.pageNo++;
            if (data.length < pageSize) {
              this.ended = true;
              this.status = 'nomore';
            } else {
              this.status = 'loadmore';
            }
            this.loading = false;
          },
          fail: () => {
            this.loading = false;
            this.status = 'loadmore';
          },
        });
    },
  },
  onReachBottom() {
    !this.ended && this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/tuanzi-skill-list/tuanzi-skill-list`,
    };
  },
  onShareTimeline() {
    return {
      title: '怪猎崛起',
      imageUrl: 'https://cdn.thinkdiffs.com/static/rise/share.jpeg',
    };
  },
};
</script>
<style lang="scss" scoped>
.page {
  height: auto;
  padding: 0;
}
.label {
  font-size: 12px;
  color: 999;
  margin: 0 10rpx 0 0;
}
</style>
