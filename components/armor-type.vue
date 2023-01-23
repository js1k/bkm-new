<template>
  <view class="armor-types flex">
    <view v-if="showDef" class="armor-type defense flex-vc" :class="klass">
      <image src="/static/icon-defense.png" mode="widthFix" class="armor-type-icon" />
      <text>{{ item.def }}</text>
    </view>
    <view class="armor-type flex-vc" :class="klass">
      <image src="/static/armortype1.png" mode="widthFix" class="armor-type-icon" />
      <text>{{ item.fire }}</text>
    </view>
    <view class="armor-type flex-vc" :class="klass">
      <image src="/static/armortype2.png" mode="widthFix" class="armor-type-icon" />
      <text>{{ item.water }}</text>
    </view>
    <view class="armor-type flex-vc" :class="klass">
      <image src="/static/armortype3.png" mode="widthFix" class="armor-type-icon" />
      <text>{{ item.ice }}</text>
    </view>
    <view class="armor-type flex-vc" :class="klass">
      <image src="/static/armortype4.png" mode="widthFix" class="armor-type-icon" />
      <text>{{ item.thunder }}</text>
    </view>
    <view class="armor-type flex-vc" :class="klass">
      <image src="/static/armortype5.png" mode="widthFix" class="armor-type-icon" />
      <text>{{ item.dragon }}</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    item: { type: Object, default: () => ({}) },
    dir: { type: String, default: 'h' },
    size: { type: String, default: 'normal' },
    showDef: { type: Boolean, default: true },
  },
  data() {
    return {};
  },
  computed: {
    klass() {
      const { dir, size } = this;
      const arr = [];
      if (dir === 'v') arr.push('flex-dir-v');
      if (size === 'small') arr.push('small');
      return arr;
    },
  },
};
</script>
<style lang="scss">
.armor-type-icon {
  display: block;
  margin: 0 6rpx 0 0;
  width: 36rpx;
  height: 36rpx;
}
.armor-type {
  margin: 0 38rpx 0 0;
  &.small {
    padding: 0 6rpx 0 0;
    margin: 0;
    font-size: 12px;
    .armor-type-icon {
      width: 28rpx;
      height: 28rpx;
    }
  }
}
.defense {
  padding: 0 26rpx 0 0;
  margin: 0 26rpx 0 0;
  border-right: 1px solid #ccc;
  &.small {
    margin: 0 6rpx 0 0;
  }
}
</style>
