<template>
  <view class="page-detail fs14 safe-area-inset-bottom">
    <view class="page-detail-main flex1 oa pb4">
      <Loading v-if="loading" />
      <view v-else-if="error">加载失败</view>
      <template v-else>
        <view class="tc">
          <image class="flex0 mr2 pic" :src="detail.pic" mode="widthFix" @click="doPreview(detail.pic)" />
        </view>
        <view>
          <view class="fwb fs16">{{ detail.name }}</view>
          <view class="ml2 gray6">{{ detail.name_en }}</view>
        </view>
        <view class="mt4 flex-vc">
          <text class="mr2 gray9">斩味：</text>
          <Sharpness :sharpness="detail.sharpness" />
        </view>
        <view class="slots flex-vc mt4" v-if="detail.slots.length">
          <text class="mr2 gray9">插槽：</text>
          <image :src="slot.icon" v-for="(slot, idx) in detail.slots" :key="idx" mode="widthFix" class="slot mr2" />
        </view>
        <view class="props flex-sb tc">
          <view class="mr1" :style="detail.rareStyle">
            <view>RARE {{ detail.rare }}</view>
            <text class="prop-name">稀有度</text>
          </view>
          <view>
            <view class="flex-c">
              <image src="/static/attack.png" mode="widthFix" class="prop-icon" />
              {{ detail.atk }}
            </view>
            <text class="prop-name">攻击力</text>
          </view>
          <view>
            <view class="flex-c">
              <image src="/static/defense.png" mode="widthFix" class="prop-icon" />
              <text>{{ detail.def_bonus ? '+' + detail.def_bonus : 0 }}</text>
            </view>
            <text class="prop-name">防御力加成</text>
          </view>
          <view>
            <view class="flex-c">
              <image src="/static/affinity.png" mode="widthFix" class="prop-icon" />
              {{ detail.critical }}
            </view>
            <text class="prop-name">会心率</text>
          </view>
        </view>
        <view class="page-detail-sec-title">解锁条件</view>
        <view class="nodata" v-if="!detail.unlock && detail.unlock2.length === 0">暂无数据</view>
        <view class="card" v-else>
          <view>{{ detail.unlock }}</view>
          <view class="flex-wrap" v-if="detail.unlock2.length">
            <view v-for="(item, idx) in detail.unlock2" :key="idx">
              <text class="mr2">{{ item.task }}</text>
              <text class="mh2" v-if="idx < detail.unlock2.length - 1">或</text>
            </view>
          </view>
        </view>
        <view class="page-detail-sec-title">百龙技能</view>
        <u-table>
          <u-tr>
            <!-- <u-th width="100rpx">百龙插槽</u-th> -->
            <u-th>百龙技能</u-th>
          </u-tr>
          <template v-if="detail.skills.length">
            <u-tr v-for="(row, idx) in detail.skills" :key="idx">
              <!-- 这里如果写成for循环样式会有问题，td获取table parent获取不到，导致设置样式的逻辑进不去 -->
              <!-- <u-td width="100rpx">{{ row[0] }}</u-td> -->
              <u-td>
                <view class="fwb mb1">{{ row[1] }}</view>
                <view>{{ row[2] }}</view>
              </u-td>
            </u-tr>
          </template>
          <view v-else class="nodata">暂无数据</view>
        </u-table>
        <view class="page-detail-sec-title">生产素材</view>
        <u-table>
          <u-tr>
            <u-th>素材</u-th>
            <u-th>数量</u-th>
          </u-tr>
          <template v-if="detail.items.length">
            <u-tr v-for="(row, idx) in detail.items" :key="idx">
              <u-td>{{ row[0] }}</u-td>
              <u-td>{{ row[1] }}</u-td>
            </u-tr>
          </template>
          <view v-else class="nodata">暂无数据</view>
        </u-table>
        <view class="page-detail-sec-title">强化素材</view>
        <u-table>
          <u-tr>
            <u-th>素材</u-th>
            <u-th>数量</u-th>
          </u-tr>
          <template v-if="detail.upgrade_items.length">
            <u-tr v-for="(row, idx) in detail.upgrade_items" :key="idx">
              <u-td>{{ row[0] }}</u-td>
              <u-td>{{ row[1] }}</u-td>
            </u-tr>
          </template>
          <view v-else class="nodata">暂无数据</view>
        </u-table>
      </template>
    </view>
    <view class="flex0 p4">
      <Share />
    </view>
  </view>
</template>

<script>
import Loading from '../../components/loading';
import Share from '../../components/share';
import Sharpness from '../../components/sharpness';

export default {
  components: { Loading, Share, Sharpness },
  data() {
    return {
      id: '',
      loading: true,
      error: false,
      detail: {},
    };
  },
  onLoad({ id }) {
    this.id = id;
    this.getDetail();
  },
  methods: {
    doPreview(url) {
      uni.previewImage({
        urls: [url],
      });
    },
    getTaskDesc(task, star) {
      return {
        village: `${star}星村庄任务`,
        sidequest: `第${star}个支线任务`,
        hall: `${star}星集会任务`,
      }[task];
    },
    getDetail() {
      this.loading = true;
      this.error = false;
      const db = wx.cloud.database();
      const { taskMap, $constants } = this;
      db.collection('weapon-v2')
        .doc(+this.id)
        .get({
          success: res => {
            const data = this.$utils.singleEquipFormatter(res.data);
            try {
              data.critical = data.critical + '%';
              data.rare = data.rare + 1;
              data.rareStyle = `color:${$constants.rareMap[data.rare]}`;
              data.unlock2 = data.unlock2
                ? (data.unlock2 + '').split('or').map(i => {
                    const [task = '', star] = i.split('_');
                    return { task: this.getTaskDesc(task.toLowerCase(), star) };
                  })
                : [];
              // 数据库格式是【；】分割一行【空格】分割列
              data.skills = data.skills ? data.skills.split(';').map(i => (i + '').trim().split(/\s+/)) : [];
              data.items = data.items ? data.items.split(';').map(i => (i + '').trim().split(/\s+/)) : [];
              data.upgrade_items = data.upgrade_items
                ? data.upgrade_items.split(';').map(i => (i + '').trim().split(/\s+/))
                : [];
              data.sharpness = (data.sharpness || '').split(';').map(i => i.split(','));
            } catch (err) {
              console.log(err);
            }
            this.detail = data;
            console.log(data);
            this.loading = false;
            uni.setNavigationBarTitle({
              title: this.detail.name,
            });
          },
          fail(err) {
            this.loading = false;
            this.error = true;
            uni.showToast({
              title: '加载失败',
              icon: 'none',
              duration: 2000,
            });
          },
        });
    },
  },
  onShareAppMessage() {
    return {
      path: `/pages/weapon-detail/weapon-detail?id=${this.id}`,
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
.props {
  margin: 30rpx 0;
  padding: 10rpx 20rpx;
  border-radius: $border-radius-base;
  background: #fff;
  flex-wrap: wrap;
}
.slot {
  width: 38rpx;
  height: 38rpx;
}
.pic {
  width: 180rpx;
  height: 180rpx;
  border-radius: $border-radius-base;
}
.props-item {
  margin: 10rpx 50rpx 10rpx 0;
}
.prop-icon {
  margin: 0 10rpx 0 0;
  width: 36rpx;
  height: 36rpx;
}
.prop-name {
  color: #999;
  font-size: 12px;
}
</style>
