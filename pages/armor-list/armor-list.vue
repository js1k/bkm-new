<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky bg-color="transparent">
      <view class="sticky-header pt4">
        <Search :disabled="loading" placeholder="搜索防具名称" @search="doSearch" />
      </view>
    </u-sticky>
    <Loading v-if="loading" />
    <view v-else class="list">
      <view v-for="item in list" :key="item._id">
        <view class="mb4" v-if="item.type === 'ad'">
          <ad-custom unit-id="adunit-1236eef461380daf"></ad-custom>
        </view>
        <navigator v-else class="item flex" :url="item.url">
          <view class="flex1">
            <view class="fwb fs16 mb4">{{ item.name }}</view>
            <ArmorType :item="item" />
            <view class="skills flex-vc">
              <text class="gray9 fs12">技能：</text>
              <u-tag
                v-for="(item, idx) in item.skills"
                :key="idx"
                :text="item"
                type="primary"
                shape="circle"
                class="ml2"
              />
            </view>
          </view>
          <u-icon name="arrow-right" class="more"></u-icon>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
import Loading from '../../components/loading';
import Search from '../../components/search';
import ArmorType from '../../components/armor-type';
export default {
  components: { Loading, Search, ArmorType },
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
      db.collection('armor')
        .where(keywords ? { name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) } : {})
        .skip(pageNo * pageSize)
        .get({
          success: res => {
            this.list = [
              ...this.list,
              ...res.data.map(i => {
                i.skills = i.skills.split(',');
                i.materials = i.materials.split(',');
                i.amounts = i.amounts.split(',');
                i.url = `/pages/armor-detail/armor-detail?id=${i._id}`;
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
    !this.ended && this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/armor-list/armor-list`,
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
  background: #fefdfa;
}
.skills {
  margin: 20rpx 0 0;
}
</style>
