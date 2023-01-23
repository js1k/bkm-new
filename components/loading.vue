<template>
  <view class="loading abs-hvc tc">
    <image src="/static/logo.png" mode="widthFix" style="width: 280rpx; height: 159rpx" />
    <view :style="{ color }"><u-loading mode="circle" class="mr2"></u-loading>加载中</view>
  </view>
</template>
<script>
export default {
  props: {
    color: String,
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.loading {
  font-size: 16px;
}
</style>
