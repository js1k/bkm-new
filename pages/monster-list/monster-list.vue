<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky bg-color="transparent">
      <view class="sticky-header">
        <Search :disabled="loading" placeholder="搜索怪物中英文名称" @search="doSearch" />
      </view>
    </u-sticky>
    <Loading v-if="loading" />
    <view v-else class="list">
      <view v-for="item in list" :key="item._id">
        <view class="mb4" v-if="item.type === 'ad'">
          <ad-custom unit-id="adunit-89cdcd40ff3571e9"></ad-custom>
        </view>
        <navigator v-else :url="`/pages/monster-detail/monster-detail?id=${item._id}`">
          <view class="card mb4 flex">
            <view class="avatar-wrap flex0">
              <view class="avatar full" :style="{ 'background-image': `url(${item.main_pic})` }"></view>
            </view>
            <view class="flex1">
              <view class="name">
                <text class="fs16 fwb">{{ item.name }}</text>
                <text class="ml2 fs12">{{ item.name_en }}</text>
              </view>
              <view class="category">分类：{{ item.species }}</view>
              <view>弱点：{{ item.weak_point }}</view>
            </view>
          </view>
        </navigator>
      </view>
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
    };
  },
  onLoad() {
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
    getList() {
      this.ended = false;
      const { db, pageSize, pageNo, keywords } = this;
      console.log('getList', pageNo);

      db.collection('monster')
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
            this.list = [...this.list, ...res.data, ...this.$utils.getAdSlot({ pageNo })];
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
    !this.ended && this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/monster-list/monster-list`,
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
  padding: 0 0 20rpx;
  background: $color-yellow;
}
.list {
  padding: 0 20rpx;
}
.avatar-wrap {
  margin: 0 20rpx 0 0;
  width: 144rpx;
  height: 144rpx;
  padding: 10rpx;
  border-radius: $border-radius-base;
  background-color: #f4f1e1;
}
.avatar {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.category {
  color: $color-light;
}
</style>
