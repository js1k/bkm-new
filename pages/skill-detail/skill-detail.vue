<template>
  <view class="page-detail fs14 safe-area-inset-bottom">
    <view class="page-detail-main flex1 oa pb4">
      <Loading v-if="loading" />
      <view v-else-if="error">加载失败</view>
      <template v-else>
        <view class="page-detail-title">
          <text class="fwb fs16">{{ detail.name }}</text>
          <text class="mh2">{{ detail.name_en }}</text>
        </view>
        <view>
          <u-tag class="flex0" size="mini" type="info" :text="detail.max"></u-tag>
        </view>
        <view class="mv4 gray6 fs12">{{ detail.$desc }}</view>
        <view class="card fs12">
          <view class="page-detail-item" v-for="(item, idx) in detail.levelInfo" :key="idx">
            <text v-if="item">{{ item }}</text>
          </view>
        </view>
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
      detail: {},
      id: '',
      loading: true,
      error: false,
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
      db.collection('armor_skill')
        .doc(+this.id)
        .get({
          success: res => {
            const { data = {} } = res;
            console.log(data);
            this.detail = data;
            try {
              const levelInfo = [];
              data.max = `最大等级${data.max_level}`;
              data.desc.split('\\n').forEach(i => {
                if (/^\d+\:/.test(i)) {
                  levelInfo.push(`Lv${i}`);
                } else {
                  data.$desc = i;
                }
              });
              data.levelInfo = levelInfo;
            } catch (err) {
              console.log(err);
            }

            this.loading = false;
            uni.setNavigationBarTitle({
              title: this.detail.name,
            });
          },
          fail(err) {
            this.loading = false;
            this.error = true;
            uni.showToast({ title: '加载失败', icon: 'none', duration: 2000 });
          },
        });
    },
  },
  onShareAppMessage() {
    return {
      path: `/pages/skill-detail/skill-detail?id=${this.id}`,
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
