<template>
  <view class="simple-list rel" :class="type">
    <image class="list-icon" :src="currentIcon" mode="widthFix" />
    <view class="search-area">
      <Search :disabled="loading" placeholder="搜索防具" @search="doSearch" />
    </view>
    <Loading v-if="loading" />
    <scroll-view v-else class="scroll-list" :scroll-y="true" @scrolltolower="onScroll2bottom">
      <template v-if="listFormated.length">
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
          <view class="mt2 mb1">
            <ArmorType :item="item" dir="v" size="small" />
          </view>
          <Rare :rare="item.rare" />
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
import Search from '../../components/search';
import Loading from '../../components/loading';
import mixin from './simple-list.mixin';
import Rare from '../../components/rare';
import ArmorType from '../../components/armor-type';

import { singleEquipFormatter } from '../../utils';
export default {
  components: { Search, Loading, Rare, ArmorType },
  mixins: [mixin],
  computed: {
    currentIcon() {
      return {
        head: '/static/armors/head.png',
        chest: '/static/armors/chest.png',
        arms: '/static/armors/arms.png',
        waist: '/static/armors/waist.png',
        legs: '/static/armors/legs.png',
      }[this.type];
    },
    listFormated() {
      const { current, $constants } = this;
      return this.list.map(item => {
        item.klass = [current && current._id === item._id ? 'selected' : ''];

        return item;
      });
    },
    where() {
      return {
        part: this.$constants.armorPartMap[this.type],
      };
    },
  },
  methods: {
    async getList() {
      const { keywords, pageNo, pageSize, where, filters } = this;
      try {
        this.status = 'loading';

        const result = await wx.cloud.callFunction({
          name: 'getArmors',
          data: {
            pageSize,
            pageNo,
            simpleWhere: where,
            skills: filters.skills,
            keywords,
          },
        });
        const data = result.result.data || result.result.list;

        console.log('getList', result);

        this.list = [...this.list, ...data.map(singleEquipFormatter)];
        console.log(this.list);
        this.pageNo++;
        if (data.length < pageSize) {
          this.ended = true;
          this.status = 'nomore';
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
.item {
  position: relative;
  overflow: hidden;
}
</style>
