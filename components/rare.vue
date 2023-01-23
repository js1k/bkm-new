<template>
  <view class="fs10" :style="{ color: rareColor }">
    <view class="dib rel ph2">
      <view :style="{ 'background-color': rareColor }" class="rare-color abs full-w"></view>
      <text class="rel">RARE{{ rare }}</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    rare: [Number, String],
  },
  data() {
    return {};
  },
  computed: {
    rareColor() {
      return this.$constants.rareMap[this.rare];
    },
  },
};
</script>
<style lang="scss" scoped>
.rare-color {
  left: 0;
  bottom: 0;
  height: 50%;
  opacity: 0.1;
}
</style>
