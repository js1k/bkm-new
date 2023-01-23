<template>
  <view class="simple-list" :class="type">
    <image class="list-icon" src="/static/icon-skill.png" mode="widthFix" />
    <view class="search-area">
      <Search :disabled="loading" placeholder="搜索技能" @search="doSearch" />
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
          <view>
            <text class="fs12 fwb flex1">{{ item.name }}</text>
          </view>
          <view class="mb4">
            <u-tag :text="item.maxLvLabel" type="info" size="mini"></u-tag>
          </view>
          <view class="desc fs12 gray6">{{ item.$desc }}</view>
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
      const { selectedList } = this;
      const result = this.list.map(item => {
        return { ...item, selected: selectedList.findIndex(i => i._id === item._id) > -1 };
      });

      console.log(111, result);

      return result;
    },
  },
  methods: {
    async getList() {
      const { keywords, pageNo, pageSize, db } = this;
      this.status = 'loading';
      const _ = db.command;
      db.collection('armor_skill')
        .where(
          _.or([
            { name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
            { name_en: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
          ])
        )
        .skip(pageNo * pageSize)
        .limit(pageSize)
        .get({
          success: res => {
            this.list = [
              ...this.list,
              ...res.data.map(item => {
                const result = singleEquipFormatter(item);
                result.url = `/pages/skill-detail/skill-detail?id=${item._id}`;
                result.desc.split('\\n').some(i => {
                  if (!/^\d+\:/.test(i)) {
                    result.$desc = i;
                  }
                });
                return result;
              }),
            ];
            console.log(this.list);
            this.pageNo++;
            if (res.data.length < pageSize) {
              this.ended = true;
              this.status = 'nomore';
            }
            this.loading = false;
          },
          fail(err) {
            this.loading = false;
            console.log(222, err);
            this.status = 'loadmore';
          },
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import url(./simple-list.scss);
// .simple-list {
//   padding-right: 0;
// }
// .go-detail {
//   width: 60rpx;
//   text-align: center;
// }
.item {
  .desc {
    line-height: 1.3;
  }
}
</style>
