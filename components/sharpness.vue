<template>
  <view class="sharpness">
    <view v-for="(row, idx) in sharpness" :key="idx" class="flex">
      <view v-for="(col, idx) in row" :key="idx" :class="['col' + idx, 'col']" :style="{ width: col + 'px' }"> </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    sharpness: { type: Array, default: () => [] },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.sharpness {
  .col {
    height: 20rpx;
  }
  .col0 {
    background: #be3843;
  }
  .col1 {
    background: #d3673d;
  }
  .col2 {
    background: #c9b232;
  }
  .col3 {
    background: #81b034;
  }
  .col4 {
    background: #3a58d7;
  }
  .col5 {
    background: #e2e2e2;
  }
  .col6 {
    background: #885aec;
  }
}
</style>
