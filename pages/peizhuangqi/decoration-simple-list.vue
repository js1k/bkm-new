<template>
  <view class="simple-list" :class="type">
    <view class="search-area">
      <Search :disabled="loading" placeholder="搜索装饰品" @search="doSearch" />
    </view>
    <Loading v-if="loading" />
    <scroll-view v-else class="scroll-list" :scroll-y="true" @scrolltolower="onScroll2bottom">
      <template v-if="listFormatted.length">
        <view
          class="item"
          v-for="item in listFormatted"
          :key="item.key"
          :class="{ selected: item.selected }"
          @click="e => doSelect(item)"
        >
          <view class="flex-vc flex-sb">
            <image class="item-icon" :src="item.icon" mode="widthFix" />
            <text class="fs12 fwb flex1">{{ item.name }}</text>
          </view>
          <view>
            <u-tag
              size="mini"
              class="mr1 mb2"
              v-for="item in item.skills_detail"
              :key="item.id"
              :type="item.selected ? 'success' : 'primary'"
              :text="item.nameWithLv"
            ></u-tag>
            <view class="fs10 gray9">{{ item.skills }}</view>
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
import { singleEquipFormatter } from '../../utils';

export default {
  components: { Search, Loading },
  mixins: [mixin],
  computed: {
    listFormatted() {
      const { armor, slotIdx } = this.current;
      const decoId = (armor.selected.slots[slotIdx].selected || {})._id;
      const result = this.list.map(item => {
        return { ...item, selected: decoId === item._id, icon: `/static/deco-slot/deco-${item.size}.png` };
      });

      return result;
    },
  },
  methods: {
    async getList() {
      const { keywords, pageNo, pageSize, current, filters } = this;
      try {
        this.status = 'loading';
        const result = await wx.cloud.callFunction({
          name: 'getDecorations',
          data: {
            pageSize,
            pageNo,
            simpleWhere: {},
            skills: filters.skills,
            keywords,
            maxSize: current.size,
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
</style>
