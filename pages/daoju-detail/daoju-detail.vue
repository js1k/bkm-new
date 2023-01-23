<template>
  <view class="page-detail fs14 safe-area-inset-bottom">
    <view class="page-detail-main flex1 oa pb4">
      <Loading v-if="loading" />
      <view v-else-if="error">加载失败</view>
      <template v-else>
        <view class="flex">
          <image :src="detail.pic" mode="widthFix" class="page-detail-avatar" />
          <view class="ml2">
            <view class="fwb fs16">{{ detail.name }}</view>
            <view class="ml2 gray6">{{ detail.name_en }}</view>
          </view>
        </view>
        <view class="page-detail-desc">{{ detail.desc }}</view>
        <view class="page-detail-sec-title">素材剥取</view>
        <u-table>
          <u-tr>
            <u-th>怪物</u-th>
            <u-th>等级</u-th>
            <u-th>方式</u-th>
            <u-th>数量</u-th>
            <u-th>概率</u-th>
          </u-tr>
          <template v-if="detail.monster_items.length">
            <u-tr v-for="(row, idx) in detail.monster_items" :key="idx">
              <!-- 这里如果写成for循环样式会有问题，td获取table parent获取不到，导致设置样式的逻辑进不去 -->
              <u-td>{{ row[0] }}</u-td>
              <u-td>{{ row[1] }}</u-td>
              <u-td>{{ row[2] }}</u-td>
              <u-td>{{ row[3] }}</u-td>
              <u-td>{{ row[4] }}</u-td>
            </u-tr>
          </template>
          <view v-else class="nodata">暂无数据</view>
        </u-table>
        <view class="page-detail-sec-title">任务报酬</view>
        <u-table>
          <u-tr>
            <u-th>任务</u-th>
            <!-- <u-th>方式</u-th> -->
            <u-th>数量</u-th>
            <u-th>概率</u-th>
          </u-tr>
          <template v-if="detail.quest_rewards.length">
            <u-tr v-for="(row, idx) in detail.quest_rewards" :key="idx">
              <u-td>{{ row[0] }}</u-td>
              <!-- <u-td>{{ row[1] }}</u-td> -->
              <u-td>{{ row[2] }}</u-td>
              <u-td>{{ row[3] }}</u-td>
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

export default {
  components: { Loading, Share },
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
    getDetail() {
      this.loading = true;
      this.error = false;
      const db = wx.cloud.database();
      db.collection('item')
        .doc(+this.id)
        .get({
          success: res => {
            const { data = {} } = res;
            console.log(data);
            // monster_items/quest_rewards 数据库格式是【；】分割一行【空格】分割列
            try {
              data.monster_items = data.monster_items
                ? data.monster_items.split(';').map(i => (i + '').trim().split(/\s+/))
                : [];
              data.quest_rewards = data.quest_rewards
                ? data.quest_rewards.split(';').map(i => (i + '').trim().split(/\s+/))
                : [];
            } catch (err) {}
            this.detail = data;
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
      path: `/pages/daoju-detail/daoju-detail?id=${this.id}`,
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

<style lang="scss"></style>
