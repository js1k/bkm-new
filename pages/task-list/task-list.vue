<template>
  <view class="page safe-area-inset-bottom">
    <u-sticky>
      <view class="sticky-header">
        <u-subsection :list="tabs" :current="currentTab" @change="onTabChange"></u-subsection>
      </view>
    </u-sticky>
    <Loading v-show="loading" />
    <view class="list-wrap" v-show="!loading">
      <view class="level" v-for="(level, levelIdx) in listFormated" :key="level.level">
        <view class="level-name">
          {{ currentTask.name }}
          <u-icon name="star-fill" class="fs12" v-for="item in level.level" :key="item"></u-icon>
        </view>
        <view class="list">
          <view class="item mb2" v-for="item in level.list" :key="item._id">
            <view>
              <text class="fwb fs16">{{ item.name }}</text>
              <text class="fs12 ml2">{{ item.name_en }}</text>
            </view>
            <view class="mv2"></view>
            <text v-if="item.desc" class="gray6">{{ item.desc }}</text>
          </view>
        </view>
        <view v-if="levelIdx == 3">
          <ad-custom unit-id="adunit-86f259111d254a94"></ad-custom>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Loading from '../../components/loading';

export default {
  components: { Loading },
  data() {
    return {
      tabs: [
        { name: '村庄任务', value: 1 },
        { name: '集会任务', value: 2 },
      ],
      currentTab: 0,
      list: [],
      pageSize: 20,
      pageNo: 0,
      db: wx.cloud.database(),
      ended: false,
      loading: false,
    };
  },
  computed: {
    currentTask() {
      return this.tabs[this.currentTab];
    },
    listFormated() {
      return this.list.reduce((map, item) => {
        const { level } = item;
        if (!map[level]) {
          map[level] = { list: [], level };
        }
        map[level].list.push(item);
        return map;
      }, {});
    },
  },
  onLoad() {
    this.list = [];
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      const { db, pageSize, pageNo, currentTask } = this;
      const type = currentTask.value;
      this.ended = false;

      db.collection('task_new')
        .where({ type, key: 1 })
        .skip(pageNo * pageSize)
        .get({
          success: res => {
            this.list = [...this.list, ...res.data];
            console.log(this.list);
            this.pageNo++;
            if (res.data.length < pageSize) {
              this.ended = true;
              this.loading = false;
            } else {
              this.getList();
            }
          },
          fail(err) {
            console.log(222, err);
            this.loading = false;
          },
        });
    },
    onTabChange(v) {
      this.currentTab = v;
      this.pageNo = 0;
      this.list = [];
      this.getList();
    },
  },
  // onReachBottom() {
  //   this.getList();
  // },
  onShareAppMessage() {
    return {
      path: `/pages/task-list/task-list`,
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
  background: $color-yellow;
}
.level-name {
  margin: 20rpx 0 10rpx;
  height: 52rpx;
  line-height: 52rpx;
  text-align: center;
  color: #fff;
  background: url(/static/bg-title.png) no-repeat center center;
  background-size: contain;
}
.list-wrap {
  padding: 20rpx;
}
.list {
  margin: 0 0 20rpx;
  padding: 20rpx;
  border-radius: $border-radius-base;
  background: #fefdfa;
}
.item {
  padding: 10rpx 0;
  &:not(:last-child) {
    border-bottom: 2px dashed $color-yellow;
  }
}
</style>
