<template>
  <view class="page safe-area-inset-bottom">
    <scroll-view scroll-y class="types">
      <view class="full flex-c">
        <view class="types-inner">
          <view class="type-item flex-vc" v-for="item in weaponTypes" :key="item.value" @click="onTypeChange(item)">
            <view class="type-item-inner flex-vc" :class="{ active: item.value === currentType }">
              <image class="type-icon" :src="item.icon" mode="widthFix" />
              <text class="type-name">{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="list-wrap safe-area-inset-bottom">
      <u-sticky bg-color="transparent">
        <view class="sticky-header">
          <Search
            :disabled="loading"
            bg-color="#f5f0e3"
            bgInputColor="#fff"
            placeholder="搜索武器名称/生产素材/强化素材"
            @search="doSearch"
          />
        </view>
      </u-sticky>
      <view class="type-desc card fs12 gray9 rel">
        <image class="type-desc-icon abs" :src="currentTypeInfo.icon" mode="widthFix" />
        <text class="rel">{{ currentTypeInfo.name }}：{{ currentTypeInfo.desc }}</text>
      </view>
      <Loading v-if="loading" class="loading" />
      <view v-else class="list">
        <view v-for="item in list" :key="item._id">
          <view class="mb4" v-if="item.type === 'ad'">
            <ad-custom unit-id="adunit-834e710dee545bd6"></ad-custom>
          </view>
          <navigator v-else :url="item.url">
            <view class="card mb4">
              <view class="flex mb2">
                <image class="pic flex0 mr2" :src="item.pic" mode="widthFix" />
                <view class="flex1">
                  <text class="flex1 fwb mb2">{{ item.name }}</text>
                  <view class="mt4">
                    <Sharpness :sharpness="item.sharpness" />
                  </view>
                </view>
                <u-icon class="flex0 gray9 fs12 flex-vt" name="arrow-right"></u-icon>
              </view>
              <view class="gray6 fs12 flex-sb">
                <!-- <view :style="item.rareStyle"> -->
                <!-- <text class="mr1">RARE {{ item.rare }}</text> -->
                <!-- </view> -->
                <Rare :rare="item.rare" />
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
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Loading from '../../components/loading';
import Search from '../../components/search';
import Rare from '../../components/rare';
import Sharpness from '../../components/sharpness';

export default {
  components: { Loading, Search, Rare, Sharpness },
  data() {
    const { weaponTypes } = this.$constants;
    return {
      db: wx.cloud.database(),
      weaponTypes: weaponTypes.map(i => {
        return { ...i, style: `background-image:url(${i.icon})` };
      }),
      currentType: 1,
      list: [],
      pageSize: 20,
      pageNo: 0,
      ended: false,
      loading: true,
      keywords: '',
    };
  },
  computed: {
    weaponTypesMap() {
      return this.weaponTypes.reduce((map, item) => {
        map[item.value] = item;
        return map;
      }, {});
    },
    currentTypeInfo() {
      return this.weaponTypesMap[this.currentType];
    },
  },
  onLoad() {
    this.getList();
  },
  methods: {
    onTypeChange(item) {
      // uni.vibrateShort();
      this.currentType = item.value;
      this.list = [];
      this.pageNo = 0;
      this.loading = true;
      this.getList();
    },
    doSearch(keywords) {
      this.keywords = keywords;
      this.pageNo = 0;
      this.list = [];
      this.loading = true;
      this.getList();
    },
    getList() {
      this.ended = false;
      const { db, pageSize, pageNo, keywords, currentType, $constants } = this;
      console.log('getList', pageNo);

      const _ = db.command;
      db.collection('weapon-v2')
        .where(
          keywords
            ? _.and([
                _.or([
                  { name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                  // { name_en: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                  { items: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                  { upgrade_items: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
                ]),
                { type: currentType },
              ])
            : { type: currentType }
        )
        .skip(pageNo * pageSize)
        .get({
          success: res => {
            this.list = [
              ...this.list,
              ...res.data.map(i => {
                const rare = i.rare + 1;
                return {
                  ...i,
                  critical: i.critical + '%',
                  url: `/pages/weapon-detail/weapon-detail?id=${i._id}`,
                  rareStyle: `color:${$constants.rareMap[rare]}`,
                  rare,
                  sharpness: (i.sharpness || '').split(';').map(i => i.split(',')),
                };
              }),
              ...this.$utils.getAdSlot({ pageNo }),
            ];
            console.log(this.list);
            this.pageNo++;
            if (res.data.length < pageSize) {
              this.ended = true;
            }
            this.loading = false;
          },
          fail(err) {
            this.loading = false;
            console.log(222, err);
          },
        });
    },
  },
  onReachBottom() {
    this.getList();
  },
  onShareAppMessage() {
    return {
      path: `/pages/weapon-list/weapon-list`,
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
$type-width: 162rpx;
.page {
  height: auto;
  padding: 0 0 0 $type-width;
}
.pic {
  width: 100rpx;
  height: 100rpx;
  border-radius: $border-radius-base;
}
.loading {
  margin: 0 0 0 $type-width / 2;
}
.sticky-header {
  margin: 0;
  background: $color-yellow;
  box-shadow: none;
}
.types {
  position: fixed;
  left: 0;
  top: 20rpx;
  bottom: 20rpx;
  width: $type-width;
  background: #fff;
  overflow: auto;
  border-radius: 0 $border-radius-base * 3 $border-radius-base * 3 0;
  box-sizing: border-box;
}
.types-inner {
  width: 100%;
  max-height: 100%;
  overflow: auto;
}
.type-icon {
  margin: 0 10rpx 0 0;
  width: 46rpx;
  height: 46rpx;
}
.type-item {
  height: 76rpx;
  padding: 0 8rpx 0 0;
}

.type-item-inner {
  width: 100%;
  height: 60rpx;
  padding: 0 0 0 8rpx;
  border-radius: 0 $border-radius-base * 2 $border-radius-base * 2 0;
  font-size: 24rpx;
  color: #666;
  transition: all 0.3s;
  &.active {
    color: $color-primary;
    font-weight: bolder;
    font-size: 28rpx;
    background: $color-yellow;
  }
}
.sticky-header {
  padding-top: 20rpx;
}
.list {
  padding: 0 20rpx;
}
.type-desc {
  margin: 0 20rpx 20rpx;
}
.prop-icon {
  margin: 0 10rpx 0 0;
  width: 30rpx;
  height: 30rpx;
}
.type-desc-icon {
  right: 0;
  bottom: 0;
  width: 100rpx;
  height: 100rpx;
  opacity: 0.2;
}
</style>
