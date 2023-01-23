<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky>
      <view class="sticky-header pt4 flex-vc">
        <u-subsection class="flex1" :list="typeList" :current="currentType" @change="onTypeChange"></u-subsection>
        <u-button class="ml2" size="medium" type="primary" @click="go2create">
          <text>创建配装</text>
        </u-button>
      </view>
    </u-sticky>
    <Loading v-if="loading" />
    <view class="list" v-else-if="listFormated.length">
      <view v-for="item in listFormated" :key="item._id" class="card mb4">
        <navigator :url="item.url" class="flex-vc">
          <view class="flex1">
            <view class="flex row">
              <text class="label flex0">配装名</text>
              <view class="fwb">{{ item.name }}</view>
            </view>
            <view class="flex row">
              <text class="label flex0">珠/槽</text>
              <view class="deco-slot">
                <text class="deco-num">{{ item.decos.length }}</text
                >/<text>{{ item.slots.length }} </text>
              </view>
            </view>
            <view class="flex row" v-if="item.weapon.id">
              <text class="label flex0">武 器</text>
              <navigator @click.stop :url="item.weaponUrl" class="link" v-if="item.weapon.name">{{
                item.weapon.name
              }}</navigator>
            </view>
            <view class="flex row">
              <text class="label flex0">技 能</text>
              <view class="flex-wrap" v-if="item.skills.length">
                <u-tag class="mr2 mb2" v-for="(skill, idx) in item.skills" :key="idx" :text="skill"></u-tag>
              </view>
              <view v-else class="empty">无</view>
            </view>
            <view class="flex row">
              <text class="label flex0">更 新</text>
              {{ item.updatedAt }}
            </view>
          </view>
          <u-icon name="arrow-right" class="more"></u-icon>
        </navigator>
        <Geili v-if="currentType === 0 && item.like_num"></Geili>
        <view v-if="currentType === 1" class="more-dot" @click.stop="e => doShowAction(item._id)">
          <u-icon name="more-dot-fill"></u-icon>
        </view>
      </view>
    </view>
    <view v-else class="tc abs-hvc">
      <text v-if="currentType === 1" class="nodata">暂无数据</text>
      <template v-if="currentType === 0">
        <image
          src="https://cdn.thinkdiffs.com/static/rise/huoya.png"
          mode="widthFix"
          style="width: 280rpx; height: 532rpx"
        />
        <view class="gray6">敬请期待</view>
      </template>
    </view>
    <u-top-tips ref="uTips" z-index="99999"></u-top-tips>
  </view>
</template>

<script>
import Loading from '../../components/loading';
import Geili from '../../components/geili';
import { formatDate } from '../../utils';
export default {
  components: { Loading, Geili },
  data() {
    return {
      typeList: [
        { name: '配装广场', value: 0, db: 'getFittingsPlayground' },
        { name: '我的配装', value: 1, db: 'getFittings' },
      ],
      currentType: 1,
      pageSize: 20,
      pageNo: 0,
      list: [],
      loading: false,
      ended: false,
      db: wx.cloud.database(),
      shouldRefresh: false,
    };
  },
  computed: {
    currentTypeInfo() {
      return this.typeList[this.currentType];
    },
    listFormated() {
      return this.list.map(item => {
        const totalSlots = [];
        const { config, _id, updated_at, ...rest } = item;
        const { equips, skills } = config;
        Object.keys(equips).forEach(type => {
          const { slots, id, name } = equips[type];
          totalSlots.push(...slots);
        });
        const result = {
          ...item,
          _id,
          decos: totalSlots.filter(i => i.id),
          slots: totalSlots,
          skills,
          weapon: equips.weapon,
          url: `/pages/peizhuangqi/peizhuangqi?id=${_id}`,
          weaponUrl: equips.weapon ? `/pages/weapon-detail/weapon-detail?id=${equips.weapon.id}` : '',
          updatedAt: formatDate('${Y}-${M}-${d} ${H}:${m}:${s} 星期${D}', item.updated_at),
        };
        // console.log(result);
        return result;
      });
    },
  },
  onLoad(options) {
    this.currentType = +options.type;
    this.init();
  },
  onShow() {
    // 首次进来的时候shouldRefresh为false，所以int不执行，放在onLoad处执行一次
    // 下次在配装器界面如果更新了配装数据，则会通过页面栈修改当前页面的shouldRefresh为true，触发init更新
    this.shouldRefresh && this.init();
    this.shouldRefresh = false;
  },
  methods: {
    onTypeChange(v) {
      this.currentType = v;
      this.init();
    },
    doDel(id) {
      uni.showLoading({});
      this.db
        .collection('fitting')
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
      console.log(111, id);
      uni.showActionSheet({
        itemList: ['删除'],
        success: res => {
          if (res.tapIndex === 0) {
            uni.showModal({
              title: '提示',
              content: '确定删除该配装么？',
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
    init() {
      this.loading = true;
      this.list = [];
      this.pageNo = 0;
      this.ended = false;
      this.getList();
    },
    go2create() {
      uni.navigateTo({
        url: '/pages/peizhuangqi/peizhuangqi',
      });
    },
    getList() {
      const { pageSize, pageNo, currentTypeInfo, currentType } = this;
      if (currentType === 0) {
        this.loading = false;
        return;
      }
      try {
        wx.cloud.callFunction({
          name: currentTypeInfo.db,
          data: { pageSize, pageNo },
          success: res => {
            const { data } = res.result;
            // console.log(data);
            this.list = [...this.list, ...data];
            this.pageNo++;
            if (data.length < pageSize) {
              this.ended = true;
            }
            this.loading = false;
          },
          fail(err) {
            console.log(err);
            this.loading = false;
          },
        });
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
  },
  onReachBottom() {
    !this.ended && this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/fitting-list/fitting-list`,
    };
  },
  onShareTimeline() {
    return {
      title: '怪猎崛起',
      imageUrl: 'https://cdn.thinkdiffs.com/static/rise/share.jpeg',
    };
  },
};
</script>

<style lang="scss">
.page {
  height: auto;
}
.card {
  position: relative;
  padding: 30rpx;
}
.label {
  width: 100rpx;
  color: #999;
}
.row {
  margin: 0 0 20rpx;
  &:last-child {
    margin-bottom: 0;
  }
}
.sticky-header {
  margin: 0;
}
.table-hd {
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 1px 2px #ddd;
}
.list {
  padding: 20rpx;
  overflow: hidden;
}
.deco-slot {
  font-size: 38rpx;
}
.deco-num {
  color: $color-primary;
}
.item {
  padding: 30rpx 20rpx;
  border-bottom: 1px solid $bg-base;
  &:last-child {
    margin: 0;
  }
}
.geili {
  position: absolute;
  right: 18rpx;
  top: 18rpx;
  color: $color-primary;
  font-size: 16px;
  font-weight: bolder;
}
.icon-geili {
  width: 36rpx;
  height: 36rpx;
}
.empty {
  font-size: 12px;
  color: #999;
}
</style>
