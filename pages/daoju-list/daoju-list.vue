<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky bg-color="transparent">
      <view class="sticky-header">
        <view class="pb4">
          <Search :disabled="loading" placeholder="搜索道具中英文名称" @search="doSearch" />
        </view>
        <u-subsection :list="typeList" :current="currentType" @change="onTypeChange"></u-subsection>
      </view>
    </u-sticky>
    <Loading v-if="loading" />
    <view v-else class="list">
      <view class="fs12 gray9 mv4" v-if="keywords"> 搜索结果： <u-tag :text="keywords" type="info"></u-tag> </view>
      <template v-if="list.length">
        <view v-for="item in list" :key="item._id">
          <view class="mb4" v-if="item.type === 'ad'">
            <ad-custom unit-id="adunit-69c55a7e903327e8"></ad-custom>
          </view>
          <navigator v-else class="item flex" :url="item.url">
            <view class="avatar-wrap flex0" :class="{ nopic: !item.pic }">
              <view v-if="item.pic" class="avatar full" :style="{ 'background-image': `url(${item.pic})` }"></view>
            </view>
            <view class="flex1 oh">
              <view class="name">
                <text class="fwb fs16">{{ item.name }}</text>
                <text class="ml2 fs12 gray6">{{ item.name_en }}</text>
              </view>
              <view class="desc line1">{{ item.desc }}</view>
            </view>
            <u-icon name="arrow-right" class="more"></u-icon>
          </navigator>
        </view>
      </template>
      <view v-else class="nodata">暂无数据</view>
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
      list: [],
      pageSize: 20,
      pageNo: 0,
      ended: false,
      loading: true,
      keywords: '',
      typeList: [
        { name: '全部' },
        { name: '物品道具', value: [1, 2, 5, 6, 9] },
        { name: '素材', value: [3, 4] },
        { name: '结算道具', value: [7, 8] },
      ],
      currentType: 1,
      lastType: '',
    };
  },
  computed: {
    currentTypeInfo() {
      return this.typeList[this.currentType];
    },
  },
  onLoad() {
    this.getList();
  },
  methods: {
    onTypeChange(index) {
      this.list = [];
      this.currentType = index;
      this.pageNo = 0;
      this.loading = true;
      this.lastType = this.currentType;
      this.getList();
    },
    doSearch(keywords) {
      this.keywords = keywords;
      this.pageNo = 0;
      this.list = [];
      this.loading = true;
      if (keywords) {
        this.currentType = 0;
      } else if (this.lastType) {
        this.currentType = this.lastType;
      }
      this.getList();
    },
    getList() {
      this.ended = false;
      const { db, pageSize, pageNo, keywords, currentTypeInfo } = this;
      console.log('getList', pageNo);
      const _ = db.command;

      const typeCondition = currentTypeInfo && currentTypeInfo.value ? { type: _.in(currentTypeInfo.value) } : {};

      db.collection('item')
        .where(
          keywords
            ? _.and([
                _.or([
                  { name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                  { name_en: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                ]),
                typeCondition,
              ])
            : typeCondition
        )
        .skip(pageNo * pageSize)
        .get({
          success: res => {
            this.list = [
              ...this.list,
              ...res.data.map(i => {
                i.url = `/pages/daoju-detail/daoju-detail?id=${i._id}`;
                return i;
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
          fail(err) {
            this.loading = false;
            console.log(222, err);
          },
        });
    },
  },
  onReachBottom() {
    this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/daoju-list/daoju-list`,
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
  background: $color-yellow;
}
.list {
  padding: 0 20rpx;
}
.item {
  margin: 0 0 20rpx;
  padding: 20rpx;
  border-radius: $border-radius-base;
  background: #fefdfa;
}
.avatar-wrap {
  margin: 0 20rpx 0 0;
  width: 108rpx;
  height: 108rpx;
  padding: 10rpx;
  border-radius: 10rpx;
  background-color: #f4f1e1;
  &.nopic {
    background-color: transparent;
  }
}
.avatar {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.desc {
  margin: 10rpx 0 0;
}
</style>
