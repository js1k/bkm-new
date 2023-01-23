<template>
  <view class="search" :style="{ backgroundColor: bgColor }">
    <u-search
      shape="round"
      v-model="keyword"
      :bg-color="bgInputColor"
      :disabled="disabled"
      :placeholder="placeholder"
      :clearabled="true"
      :show-action="false"
      @search="$emit('search', keyword)"
      @clear="$emit('search', '')"
    ></u-search>
  </view>
</template>
<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    placeholder: String,
    bgInputColor: { type: String, default: '#eeeeef' },
    bgColor: { type: String, default: '#fff' },
  },
  data() {
    return {
      keyword: '',
    };
  },
};
</script>
<style lang="scss" scoped></style>
