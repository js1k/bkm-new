<template>
  <view class="share-area tc">
    <u-button v-if="shareStyle === 'button'" open-type="share" :type="type" class="btn-share" :shape="shape">
      <u-icon name="share"></u-icon>
      <text class="vm ml2">{{ label }}</text>
    </u-button>
    <button v-if="shareStyle === 'icon'" open-type="share" class="icon-share flex-vc">
      <u-icon name="weixin-circle-fill" style="font-size: 80rpx; color: #1ba035"></u-icon>
    </button>
  </view>
</template>
<script>
export default {
  props: {
    shape: { type: String, default: 'circle' },
    type: { type: String, default: 'primary' },
    label: { type: String, default: '分享给好友' },
    shareStyle: { type: String, default: 'button' },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.icon-share {
  padding: 0;
  background: transparent;
  &::after {
    border: 0 none;
    background: transparent;
  }
}
</style>
