<template>
  <view>
    <view class="uni-add-tips-box" v-if="showTip">
      <view class="uni-add-tips-content" @tap="hideTip">
        <text class="uni-add-tips">{{ tip }}</text>
      </view>
    </view>
  </view>
</template>

<script>
const SHOW_TIP = 'SHOW_TIP';
export default {
  data() {
    return {
      showTip: false,
      tip:
        Math.random() > 0.5
          ? '点击「添加小程序」，下次访问更方便'
          : '点击「添加小程序」，被猫车之余我们会持续更新新功能',
    };
  },
  mounted() {
    const last = uni.getStorageSync(SHOW_TIP);
    // 每7天出现一次
    this.showTip = !last || +new Date() - last > 7 * 24 * 60 * 60 * 1000;
  },
  props: {
    duration: {
      type: Number,
      default: 5,
      required: false,
    },
  },
  methods: {
    hideTip() {
      uni.setStorageSync(SHOW_TIP, +new Date());
      this.showTip = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$themeColor: #34b5e2; //主题色
.uni-add-tips-box {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99999;
  opacity: 0.9;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  width: 600upx;
}
.uni-add-tips-content::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  top: -38upx;
  right: 105upx;
  border-width: 20upx;
  border-style: solid;
  display: block;
  border-color: transparent transparent $themeColor transparent;
}
.uni-add-tips-content {
  border-width: 0upx;
  margin-top: 20upx;
  position: relative;
  background-color: $themeColor;
  box-shadow: 0 10upx 20upx -10upx $themeColor;
  border-radius: 12upx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18upx 20upx;
  margin-right: 40upx;
}
.uni-add-tips {
  color: #fff;
  font-size: 28upx;
  font-weight: 400;
}
</style>
