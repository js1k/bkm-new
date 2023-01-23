<template>
  <view class="page safe-area-inset-bottom">
    <view class="card">
      <navigator class="item flex-sb" v-for="(item, idx) in navs" :key="idx" :url="item.url">
        <view class="flex1">{{ item.label }}</view>
        <u-icon name="arrow-right" class="flex0 more"></u-icon>
      </navigator>
    </view>
    <view class="version">当前版本 v0.11.0</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        { url: '/pages/fitting-list/fitting-list?type=1', label: '我的配装' },
        { url: '/pages/my-stone-list/my-stone-list', label: '我的护石' },
      ],
    };
  },
};
</script>

<style lang="scss">
.page {
  padding: 20rpx;
}
.item {
  padding: 20rpx;
  border-bottom: 1px solid $bg-base;
  &:last-child {
    border: 0 none;
  }
}
.version {
  position: relative;
  margin: 30rpx 0 0;
  color: #999;
  text-align: center;
  font-size: 12px;
  z-index: 2;
}
</style>
