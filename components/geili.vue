<template>
  <view class="geili flex-vc" @click.stop="doGeili">
    <image v-if="isLiked" src="/static/geili-active.png" mode="widthFix" class="icon-geili" />
    <image v-else src="/static/geili.png" mode="widthFix" class="icon-geili" />
    <text class="ml2">{{ likeNum }}</text>
  </view>
</template>
<script>
export default {
  props: {
    isLiked: { type: Boolean, default: false },
    likeNum: { type: Number, default: 0 },
    fittingId: String,
  },
  data() {
    return {};
  },
  methods: {
    doGeili() {
      if (this.isLiked) return;
      wx.cloud
        .callFunction({
          name: 'fittingGeili',
          data: { id: this.fittingId },
        })
        .then(res => {
          console.log('geili component', res);
          this.$emit('change', true);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-geili {
  width: 36rpx;
  height: 36rpx;
}
</style>
