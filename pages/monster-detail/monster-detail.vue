<template>
  <view class="page safe-area-inset-bottom">
    <Loading v-if="loading" />
    <view v-else-if="error">加载失败</view>
    <template v-else>
      <view class="images tc" @click="hide">
        <image class="mian-pic" :src="detail.main_pic" mode="widthFix" />
      </view>
      <!-- 详情 -->
      <view class="detail flex-dir-v" :style="{ height: modalHeight }" @click="show">
        <view class="close-area rel flex0" @click.stop="toggle">
          <view class="close abs-hc"></view>
        </view>
        <view class="detail-content flex1 oa">
          <view class="flex-vc mb2">
            <view class="avatar flex0" :style="{ 'background-image': `url(${detail.icon})` }"></view>
            <view class="name">
              <view>{{ detail.name }}</view>
              <view class="fs14">{{ detail.name_en }}</view>
            </view>
            <view class="flex1 tr">
              <u-tag :text="detail.species" type="info" />
            </view>
          </view>
          <view class="detail-prop" v-if="detailFormated.levels">等级：{{ detailFormated.levels }}</view>
          <view class="detail-prop" v-if="detailFormated.maps">地图：{{ detailFormated.maps }}</view>
          <view class="detail-prop" v-if="detailFormated.weak_point">弱点：{{ detailFormated.weak_point }}</view>
          <view class="desc">{{ detail.desc }}</view>
          <view>
            <Share />
          </view>
          <view class="ad300">
            <ad-custom unit-id="adunit-cd78b756dc943728"></ad-custom>
          </view>
          <view v-if="detail.body_part_pic">
            <view class="detail-img-title">部位肉质</view>
            <image :src="detail.body_part_pic" class="detail-img" mode="widthFix" />
          </view>
          <view v-if="detail.state_pic">
            <view class="detail-img-title">异常状态</view>
            <image :src="detail.state_pic" class="detail-img" mode="widthFix" />
          </view>
          <view v-if="detail.junior_material_pic">
            <view class="detail-img-title">下位素材</view>
            <image :src="detail.junior_material_pic" class="detail-img" mode="widthFix" />
          </view>
          <view v-if="detail.senior_material_pic">
            <view class="detail-img-title">上位素材</view>
            <image :src="detail.senior_material_pic" class="detail-img" mode="widthFix" />
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import Loading from '../../components/loading';
import Share from '../../components/share';

export default {
  components: { Loading, Share },
  data() {
    return {
      showDetail: false,
      id: '',
      detail: {},
      loading: true,
      error: false,
    };
  },
  computed: {
    modalHeight() {
      return this.showDetail ? '80%' : '20%';
    },
    detailFormated() {
      const { detail } = this;
      const { mapIdMaps } = getApp().globalData;
      detail.maps = (detail.maps || [])
        .map(i => {
          return mapIdMaps[i].name;
        })
        .join('、');

      detail.levels = (detail.levels || []).map(i => this.$constants.levelMap[i]).join('、');

      console.log('mapIdMaps', getApp().globalData);

      return detail;
    },
  },
  onLoad({ id }) {
    this.id = id;
    this.showDetail = true;
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.loading = true;
      this.error = false;
      const db = wx.cloud.database();
      db.collection('monster')
        .doc(this.id)
        .get({
          success: res => {
            this.detail = res.data;
            this.loading = false;
            uni.setNavigationBarTitle({
              title: this.detail.name,
            });
          },
          fail(err) {
            this.loading = false;
            this.error = true;
            uni.showToast({
              title: '加载失败',
              duration: 2000,
            });
          },
        });
    },
    toggle() {
      this.showDetail = !this.showDetail;
    },
    show() {
      this.showDetail = true;
    },
    hide() {
      this.showDetail = false;
    },
  },
  onShareAppMessage() {
    return {
      path: `/pages/monster-detail/monster-detail?id=${this.id}`,
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
page {
  height: 100%;
}
.page {
  height: 100%;
  background: $color-yellow;
}
.detail-prop {
  margin: 15rpx 0;
}
.detail-img-title {
  margin: 30rpx 0 10rpx;
  font-weight: bold;
  font-size: 16px;
}
.images {
  height: 80%;
  padding: 30rpx;
  overflow: auto;
}
.mian-pic {
  max-width: 100%;
}
.name {
  margin: 0 20rpx;
  font-size: 20px;
  font-weight: 500;
}
.detail {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 30rpx 30rpx;
  border-radius: 88rpx 88rpx 0 0;
  background: #fff;
  transition: height 0.3s;
}
.detail-img {
  margin: 0 auto;
  display: block;
  max-width: 680rpx;
}
.desc {
  margin: 30rpx 0;
}
.close-area {
  height: 30rpx;
  padding: 30rpx 0;
}
.close {
  top: 20rpx;
  width: 100rpx;
  height: 10rpx;
  border-radius: $border-radius-base;
  background: rgba($color: #000000, $alpha: 0.3);
}
.avatar {
  width: 138rpx;
  height: 138rpx;
  border-radius: 50%;
  border: 3px solid $color-yellow;
  background-size: contain;
  background-position: center;
  overflow: hidden;
}
</style>
