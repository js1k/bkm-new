<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky bg-color="transparent">
      <view class="sticky-header">
        <view class="mb4">
          <Search :disabled="loading" placeholder="搜索技能中英文名称" @search="doSearch" />
        </view>
        <u-subsection :list="tabs" :current="currentTab" @change="onTabChange"></u-subsection>
      </view>
    </u-sticky>
    <Loading v-show="loading" />
    <view v-show="!loading">
      <view class="list" v-if="list.length">
        <view :key="item._id" v-for="item in list">
          <view class="mb4" v-if="item.type === 'ad'">
            <ad-custom unit-id="adunit-0673e46207ed921b"></ad-custom>
          </view>
          <navigator v-else :url="item.url" class="item flex">
            <view class="flex1">
              <view class="flex1">
                <text class="fwb fs16">{{ item.name }}</text>
                <text class="gray6 fs12 mh2">{{ item.name_en }}</text>
              </view>
              <u-tag class="flex0" size="mini" type="info" :text="item.max"></u-tag>
              <view class="fs12 gray6 mt2">{{ item.$desc }}</view>
            </view>
            <u-icon name="arrow-right" class="more"></u-icon>
          </navigator>
        </view>
      </view>
      <view v-else class="gray9 tc mt8">啥子都没得</view>
    </view>
  </view>
</template>

<script>
import Loading from '../../components/loading';
import Search from '../../components/search';

export default {
  components: { Loading, Search },
  data() {
    return {
      db: wx.cloud.database(),
      tabs: [
        { name: '技能', db: 'armor_skill' },
        { name: '百龙技能', db: 'weapon_skill' },
      ],
      currentTab: 0,
      list: [],
      pageSize: 20,
      pageNo: 0,
      ended: false,
      loading: false,
      keywords: '',
    };
  },
  computed: {
    currentTabInfo() {
      return this.tabs[this.currentTab];
    },
  },
  onLoad() {
    this.loading = true;
    this.getList();
  },
  methods: {
    doSearch(keywords) {
      this.keywords = keywords;
      this.pageNo = 0;
      this.list = [];
      this.loading = true;
      this.getList();
    },
    onTabChange(v) {
      this.currentTab = v;
      this.pageNo = 0;
      this.list = [];
      this.loading = true;
      // this.keywords = '';
      this.getList();
    },
    getList() {
      this.ended = false;
      const { db, pageSize, pageNo, currentTabInfo, keywords } = this;
      console.log('getList', pageNo);
      db.collection(currentTabInfo.db)
        .where(
          keywords
            ? db.command.or([
                { name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                { name_en: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
              ])
            : {}
        )
        .skip(pageNo * pageSize)
        .get({
          success: res => {
            this.list = [
              ...this.list,
              ...res.data.map(item => {
                const levelInfo = [];
                item.max = `最大等级${item.max_level}`;
                item.desc.split('\\n').forEach(i => {
                  if (/^\d+\:/.test(i)) {
                    levelInfo.push(`Lv${i}`);
                  } else {
                    item.$desc = i;
                  }
                });
                item.levelInfo = levelInfo;
                item.url = `/pages/skill-detail/skill-detail?id=${item._id}`;
                return item;
              }),
              ...this.$utils.getAdSlot({ pageNo }),
            ];
            console.log(this.list);
            this.pageNo++;
            if (res.data.length < pageSize) {
              this.ended = true;
            }
            this.loading = false;
          },
          fail: () => {
            this.loading = false;
          },
        });
    },
  },
  onReachBottom() {
    !this.ended && this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/skill-list/skill-list`,
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

<style lang="scss">
.page {
  height: auto;
}
.list {
  padding: 0 20rpx;
}
.item {
  margin: 0 0 20rpx;
  padding: 20rpx;
  border-radius: $border-radius-base;
  background: #fff;
  transition: transform 0.3s;
  &:active {
    transform: scale(0.96);
  }
  &.active {
    color: $color-primary;
  }
}
.detail {
  padding: 66rpx 50rpx;
}
.detail-title {
  padding: 20rpx 0;
  border-bottom: 2px dashed $color-yellow;
}
.detail-item {
  margin: 10rpx 0;
}
</style>
