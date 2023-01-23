<template>
  <view class="simple-list">
    <view class="filter-area rel">
      <Search :disabled="loading" placeholder="搜索武器" @search="doSearch" />
      <u-dropdown ref="uDropdown" duration="0">
        <u-dropdown-item :value="currentType" :title="currentTypeName">
          <view class="slot-content" style="background-color: #ffffff">
            <scroll-view scroll-y="true" style="height: 460rpx">
              <view
                class="type-item flex-vc card"
                v-for="(item, idx) in weaponTypes"
                :key="idx"
                :class="{ 'card-primary': idx === currentType }"
                @click="onTypeChange(idx)"
              >
                <view class="type-icon-wrap mr2">
                  <image :src="item.icon" mode="widthFix" class="full" />
                </view>
                <text class="fs12">{{ item.name }}</text>
              </view>
            </scroll-view>
          </view>
        </u-dropdown-item>
      </u-dropdown>
    </view>
    <Loading v-if="loading" />
    <scroll-view v-else class="scroll-list" :scroll-y="true" @scrolltolower="onScroll2bottom">
      <template v-if="list.length">
        <view
          class="item"
          v-for="item in list"
          :key="item.key"
          :class="{ selected: current._id === item._id }"
          @click="e => doSelect(item)"
        >
          <view class="flex-sb">
            <image class="item-icon flex0" :src="weaponTypesMap[item.type].icon" mode="widthFix" />
            <text class="fs12 fwb flex1">{{ item.name }}</text>
            <view class="slots flex0 ml2">
              <image v-for="(slot, idx) in item.slots" :key="idx" :src="slot.icon" mode="widthFix" class="equip-slot" />
            </view>
          </view>
          <view class="flex-vc mt2">
            <Rare :rare="item.rare" />
          </view>
          <view class="flex-sb mt2">
            <view class="flex-vc">
              <image src="/static/attack.png" mode="widthFix" class="prop-icon" />
              {{ item.atk }}
            </view>
            <view class="flex-vc">
              <image src="/static/defense.png" mode="widthFix" class="prop-icon" />
              {{ item.def_bonus ? '+' + item.def_bonus : 0 }}
            </view>
            <view class="flex-vc">
              <image src="/static/affinity.png" mode="widthFix" class="prop-icon" />
              {{ item.critical }}
            </view>
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
import Rare from '../../components/rare';

export default {
  components: { Search, Loading, Rare },
  mixins: [mixin],
  data() {
    return {
      weaponTypes: [{ name: '全部', value: '' }, ...this.$constants.weaponTypes],
      currentType: 1,
      showTypePicker: false,
    };
  },
  computed: {
    weaponTypesMap() {
      return this.$constants.weaponTypes.reduce((map, item) => {
        map[item.value] = item;
        return map;
      }, {});
    },
    where() {
      const type = this.weaponTypes[this.currentType].value;
      return type ? { type } : {};
    },
    currentTypeName() {
      return `武器类型：${this.weaponTypes[this.currentType].name}`;
    },
  },
  methods: {
    onTypeChange(v) {
      this.currentType = v;
      this.$refs.uDropdown.close();
      this.initialGetList();
    },
    async getList() {
      const { keywords, pageNo, pageSize, where, weaponTypesMap } = this;
      try {
        this.status = 'loading';
        const result = await wx.cloud.callFunction({
          name: 'getWeapons',
          data: {
            pageSize,
            pageNo,
            simpleWhere: where,
            keywords,
          },
        });
        const data = result.result.data || result.result.list;

        console.log('getList', result);
        this.list = [
          ...this.list,
          ...data.map(item => {
            const result = singleEquipFormatter(item);
            result.icon = weaponTypesMap[item.type].icon;
            return result;
          }),
        ];
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
.simple-list {
  padding-top: 160rpx;
}
.type-item {
  padding: 10rpx 10rpx;
}
.type-icon-wrap {
  width: 40rpx;
  height: 40rpx;
}
.prop-icon {
  margin: 0 10rpx 0 0;
  width: 30rpx;
  height: 30rpx;
}
</style>
