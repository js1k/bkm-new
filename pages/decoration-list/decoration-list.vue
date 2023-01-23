<template>
  <view class="page">
    <u-sticky bg-color="transparent">
      <view class="sticky-header">
        <Search :disabled="loading" placeholder="搜索装饰品名称" @search="doSearch" />
      </view>
    </u-sticky>
    <Loading v-show="loading" />
    <view v-show="!loading">
      <view class="list" v-if="list.length">
        <view v-for="item in list" :key="item._id">
          <view class="mb4" v-if="item.type === 'ad'">
            <ad-custom unit-id="adunit-46331e2dc589714a"></ad-custom>
          </view>
          <view class="item" v-else :class="{ active: item._id === currentDetail._id }" @click="doShowDetail(item)">
            <view class="name fwb">{{ item.name }}</view>
            <view class="name-en gray6 fs12 mt2">{{ item.name_en }}</view>
            <view class="prop-item flex mt4">
              <u-tag text="技能" type="info" size="mini" class="label flex0"></u-tag>
              <view>{{ item.skills }}</view>
            </view>
            <view class="prop-item flex">
              <u-tag text="解锁所需怪物" type="info" size="mini" class="label flex0"></u-tag>
              <view>{{ item.unlock_monster }}</view>
            </view>
            <view class="prop-item flex">
              <u-tag text="所需素材" type="info" size="mini" class="label flex0"></u-tag>
              <view>{{ item.materials }}</view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="nodata">啥子都没得</view>
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
      showDetail: false,
      currentDetail: {},
      loading: false,
      keywords: '',
    };
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
    doShowDetail(item) {
      this.showDetail = true;
      this.currentDetail = item;
    },
    getList() {
      this.ended = false;
      const { db, pageSize, pageNo, keywords } = this;
      console.log('getList', pageNo);
      db.collection('decoration')
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
              ...res.data.map(i => {
                i.desc = i.desc.split('\\n');
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
          },
        });
    },
  },
  onReachBottom() {
    !this.ended && this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/decoration-list/decoration-list`,
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
}
.prop-item {
  margin: 10rpx 0 0;
  font-size: 24rpx;
  .label {
    margin: 0 10rpx 0 0;
    width: 152rpx;
    text-align: right;
  }
}
</style>
