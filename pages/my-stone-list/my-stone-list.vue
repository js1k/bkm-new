<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky>
      <view class="sticky-header pt4">
        <u-button type="primary" @click="showAddStone = true">添加护石</u-button>
      </view>
    </u-sticky>
    <view class="ph4 pb4">
      <Loading v-if="loading" />
      <scroll-view v-else class="scroll-list" :scroll-y="true" @scrolltolower="onScroll2bottom">
        <template v-if="listFormated.length">
          <view
            class="card mb4 rel"
            v-for="item in listFormated"
            :key="item.key"
            :class="item.klass"
            @click="editStone(item)"
          >
            <view class="flex-vc flex-sb">
              <text class="fs16 fwb flex1">{{ item.name }}</text>
            </view>
            <view class="flex0 flex-vc mv4" v-if="item.slots.length">
              <image v-for="(slot, idx) in item.slots" :key="idx" :src="slot.icon" mode="widthFix" class="equip-slot" />
            </view>
            <view class="mt2">
              <u-tag v-for="item in item.skills_detail" :key="item.id" :text="item.nameWithLv" class="mr1"></u-tag>
            </view>
            <view class="more-dot abs" @click.stop="e => doShowAction(item._id)">
              <u-icon name="more-dot-fill"></u-icon>
            </view>
          </view>
        </template>
        <u-loadmore :status="status" :load-text="loadText" @loadmore="getList" />
      </scroll-view>
    </view>
    <u-top-tips ref="uTips" z-index="99999"></u-top-tips>
    <AddStone :show="showAddStone" @close="onAddStoneHide" />
  </view>
</template>
<script>
import Loading from '../../components/loading';
import AddStone from '../../components/add-stone';

import { singleEquipFormatter } from '../../utils';
export default {
  components: { Loading, AddStone },
  data() {
    return {
      showAddStone: false,
      currentTab: 0,
      footerList: [
        { iconPath: 'plus-circle', selectedIconPath: 'plus-circle-fill', text: '添加新护石', midButton: true },
      ],
      list: [],
      loading: false,
      ended: false,
      pageNo: 0,
      pageSize: 20,
      status: 'loadmore',
      loadText: this.$constants.loadText,
      db: wx.cloud.database(),
    };
  },
  computed: {
    listFormated() {
      const { current } = this;
      return this.list.map(item => {
        item.klass = [current && current._id === item._id ? 'selected' : ''];

        return item;
      });
    },
  },
  onLoad() {
    this.init();
  },
  methods: {
    init() {
      this.pageNo = 0;
      this.list = [];
      this.ended = false;
      this.loading = true;
      this.getList();
    },
    editStone(item) {},
    doDel(id) {
      uni.showLoading({});
      this.db
        .collection('stone')
        .doc(id)
        .remove()
        .then(() => {
          this.$refs.uTips.show({ title: '删除成功', type: 'success', duration: '2000' });
          uni.hideLoading();
          this.init();
        })
        .catch(() => {
          this.$refs.uTips.show({ title: '删除失败', type: 'error', duration: '2000' });
          uni.hideLoading();
        });
    },
    doShowAction(id) {
      console.log(id);
      uni.showActionSheet({
        itemList: ['删除'],
        success: res => {
          if (res.tapIndex === 0) {
            uni.showModal({
              title: '提示',
              content: '确定删除该护石么？',
              success: res => {
                if (res.confirm) {
                  this.doDel(id);
                }
              },
            });
          }
        },
      });
    },
    onScroll2bottom() {
      !this.ended && this.getList();
    },
    onAddStoneHide(added) {
      added && this.init();
      this.showAddStone = false;
      this.currentTab = -1;
    },
    onTabChange(idx) {
      switch (idx) {
        case 0:
          this.showAddStone = true;
          break;
      }
      this.currentTab = 1;
    },
    async getList() {
      const { pageNo, pageSize } = this;
      this.showAddStone = false;
      try {
        this.status = 'loading';

        const result = await wx.cloud.callFunction({
          name: 'getStones',
          data: {
            pageSize,
            pageNo,
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
@import url(../peizhuangqi/simple-list.scss);
.page {
  height: auto;
  padding: 0;
}
</style>
