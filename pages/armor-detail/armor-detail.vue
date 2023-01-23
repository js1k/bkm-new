<template>
  <view class="page-detail fs14 safe-area-inset-bottom">
    <view class="page-detail-main flex1 oa pb4">
      <Loading v-if="loading" />
      <view v-else-if="error">加载失败</view>
      <template v-else>
        <view class="page-detail-title">
          <text class="fwb fs16">{{ detail.name }}</text>
          <text class="ml2">{{ detail.name_en }}</text>
        </view>
        <view class="card">
          <ArmorType :item="detail" />
        </view>
        <view class="page-detail-sec-title">技能</view>
        <u-table>
          <u-tr>
            <u-th>名称</u-th>
          </u-tr>
          <u-tr v-for="(item, idx) in detail.skills" :key="idx">
            <u-td>{{ item }}</u-td>
          </u-tr>
        </u-table>
        <view class="page-detail-sec-title">生产要素</view>
        <u-table>
          <u-tr>
            <u-th>物料</u-th>
            <u-th>数量</u-th>
          </u-tr>
          <u-tr v-for="(item, idx) in detail.materials" :key="idx">
            <u-td>{{ item }}</u-td>
            <u-td>{{ detail.amounts[idx] }}</u-td>
          </u-tr>
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
import ArmorType from '../../components/armor-type';
import Share from '../../components/share';

export default {
  components: { Loading, ArmorType, Share },
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
      db.collection('armor')
        .doc(+this.id)
        .get({
          success: res => {
            const { data = {} } = res;
            data.skills = data.skills.split(',');
            data.materials = data.materials.split(',');
            data.amounts = data.amounts.split(',');
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
      path: `/pages/armor-detail/armor-detail?id=${this.id}`,
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
