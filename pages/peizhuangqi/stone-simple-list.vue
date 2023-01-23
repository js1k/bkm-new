<template>
  <view class="simple-list rel" :class="type">
    <image class="list-icon" src="/static/armors/stone.png" mode="widthFix" />
    <view class="filter-area tc">
      <u-button type="primary" @click="showAddStone">
        <u-icon name="plus" class="mr1"></u-icon>
        添加新护石
      </u-button>
    </view>
    <Loading v-if="loading" />
    <scroll-view v-else class="scroll-list" :scroll-y="true" @scrolltolower="onScroll2bottom">
      <template v-if="listFormated.length">
        <view class="mb2">
          <u-alert-tips type="warning" title=" " description="删除护石请移步：我的 - 我的护石"></u-alert-tips>
        </view>
        <view
          class="item"
          v-for="item in listFormated"
          :key="item.key"
          :class="item.klass"
          @click="e => doSelect(item)"
        >
          <view class="flex-vc flex-sb">
            <text class="fs12 fwb flex1">{{ item.name }}</text>
            <view class="flex0 flex-vc">
              <image v-for="(slot, idx) in item.slots" :key="idx" :src="slot.icon" mode="widthFix" class="equip-slot" />
            </view>
          </view>
          <view>
            <u-tag
              size="mini"
              v-for="item in item.skills_detail"
              :key="item.id"
              :text="item.nameWithLv"
              class="mr1"
            ></u-tag>
          </view>
        </view>
      </template>
      <u-loadmore :status="status" :load-text="loadText" @loadmore="getList" />
    </scroll-view>
  </view>
</template>
<script>
import Loading from '../../components/loading';
import mixin from './simple-list.mixin';

import { singleEquipFormatter } from '../../utils';
export default {
  components: { Loading },
  mixins: [mixin],
  computed: {
    listFormated() {
      const { current, $constants } = this;
      return this.list.map(item => {
        item.klass = [current && current._id === item._id ? 'selected' : ''];

        return item;
      });
    },
  },
  methods: {
    showAddStone() {
      this.$emit('add-stone');
    },
    async getList() {
      const { pageNo, pageSize, filters, db } = this;
      try {
        this.status = 'loading';
        const { skills } = filters;

        const result = await wx.cloud.callFunction({
          name: 'getStones',
          data: {
            pageSize,
            pageNo,
            skills,
          },
        });

        const data = result.result.data || result.result.list;

        this.list = [...this.list, ...data.map(singleEquipFormatter)];
        console.log(this.list);
        this.pageNo++;
        if (data.length < pageSize) {
          this.ended = true;
          this.status = 'nomore';
        } else {
          this.status = 'loadmore';
        }
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.loading = false;
        this.status = 'loadmore';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url(./simple-list.scss);
.simple-list {
  padding-top: 120rpx;
}
.item {
  position: relative;
  overflow: hidden;
}
</style>
