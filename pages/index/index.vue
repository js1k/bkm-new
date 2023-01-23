<template>
  <view class="page safe-area-inset-bottom" :class="{ am: isAm, pm: !isAm }">
    <view class="bg-image-wrap">
      <image mode="widthFix" :src="mainBg" :class="{ 'bg-image': true, animate: bgLoaded }" @load="bgLoaded = true" />
      <view class="bg-image-placeholder abs-hc">
        <Loading v-if="!bgLoaded" color="#fff" />
      </view>
    </view>
    <Fav />
    <!-- <view class="notice">
      <u-notice-bar
        mode="horizontal"
        :volume-icon="false"
        :show="showNotice"
        :list="notice"
        :close-icon="true"
        :speed="100"
        @close="showNotice = false"
      ></u-notice-bar>
    </view> -->
    <view class="main rel">
      <navigator
        target="miniProgram"
        open-type="navigate"
        app-id="wxb82b32e8c3b0ef32"
        path="pages/index/index?from=mhrise"
        class="recommend"
        :class="{ animated: recoAnimated }"
      >
        <image src="/static/logo-qushuiyin.png" mode="widthFix" class="reco-mp" />
      </navigator>
      <view class="main-inner rel">
        <view class="blur abs-full"></view>
        <!-- <view class="sub-menus flex-sb flex-wrap rel">
          <navigator class="sub-item" :url="item.url" v-for="(item, idx) in subMenus" :key="idx">{{
            item.name
          }}</navigator>
        </view> -->
        <view class="entries-content flex-sb">
          <view v-for="(item, idx) in entries" :key="idx" :class="item.klass" :style="item.style">
            <template v-if="item.children">
              <!-- 有子元素 -->
              <navigator :url="child.url" v-for="child in item.children" :key="child.name" :class="child.klass">
                <view class="entry-inner" :class="{ disabled: child.disabled }">
                  <image class="deco" src="/static/bg-decoration.png" mode="widthFix" />
                  <image
                    class="icon"
                    :class="{ show: child.iconLoaded }"
                    :src="child.icon"
                    mode="widthFix"
                    @load="onIconLoaded(child)"
                  />
                  <view class="inner">
                    <text class="name">{{ child.name }}</text>
                    <text class="coming-soon fs12" v-if="child.disabled">近期开放</text>
                  </view>
                </view>
              </navigator>
            </template>
            <!-- 没有子元素 -->
            <template v-else>
              <navigator
                v-if="item.miniapp"
                target="miniProgram"
                open-type="navigate"
                app-id="wxebadf544ddae62cb"
                path="pages/survey/index?sid=8298617&hash=4feb"
                version="release"
              >
                <view class="entry-inner">
                  <image
                    class="icon"
                    :class="{ show: item.iconLoaded }"
                    :src="item.icon"
                    mode="widthFix"
                    @load="onIconLoaded(item)"
                  />
                  <view class="inner">
                    <text class="name">{{ item.name }}</text>
                  </view>
                </view>
              </navigator>
              <navigator v-else :url="item.url">
                <view class="entry-inner" :class="{ disabled: item.disabled }">
                  <image class="deco" src="/static/bg-decoration.png" mode="widthFix" />
                  <image
                    class="icon"
                    :class="{ show: item.iconLoaded }"
                    :src="item.icon"
                    mode="widthFix"
                    @load="onIconLoaded(item)"
                  />
                  <view class="inner">
                    <text class="name">{{ item.name }}</text>
                    <text class="coming-soon fs12" v-if="item.disabled">近期开放</text>
                  </view>
                </view>
              </navigator>
            </template>
          </view>
        </view>
      </view>
    </view>
    <u-modal
      v-model="showNotice"
      width="80%"
      title="版本更新提示"
      confirm-text="朕知道了"
      :show-cancel-button="false"
      :mask-close-able="true"
    >
      <view class="notice">
        <view class="flex" v-for="(item, idx) in notice.items" :key="idx">
          <text class="notice-idx gray9 flex0">{{ idx + 1 }}.</text> {{ item }}
        </view>
      </view>
    </u-modal>
  </view>
</template>
<script>
import Loading from '../../components/loading';
import Fav from '../../components/fav';

export default {
  components: { Fav, Loading },
  props: {},
  data() {
    const hour = new Date().getHours();
    const isAm = hour < 12;
    return {
      bgLoaded: false,
      showNotice: false,
      isAm,
      recoAnimated: false,
      mainBg: isAm
        ? 'https://cdn.thinkdiffs.com/static/rise/index-am.jpeg'
        : 'https://cdn.thinkdiffs.com/static/rise/index-pm.jpeg',
      // subMenus: [
      //   {
      //     name: '团子技能',
      //     url: '/pages/tuanzi-skill-list/tuanzi-skill-list',
      //   },
      //   {
      //     name: '任务',
      //     url: '/pages/task-list/task-list',
      //   },
      //   {
      //     name: '装饰品',
      //     url: '/pages/decoration-list/decoration-list',
      //   },
      // ],
      entries: [
        {
          klass: 'entry-pzq entry level1',
          name: '配装器',
          url: '/pages/fitting-list/fitting-list?type=1',
          icon: 'https://cdn.thinkdiffs.com/static/rise/huoya.png',
          iconLoaded: false,
          // disabled: true,
        },
        {
          style: 'width:48%;',
          children: [
            {
              klass: 'entry-weapon entry level2',
              name: '武器图鉴',
              url: '/pages/weapon-list/weapon-list',
              icon: '/static/weapon.png',
              iconLoaded: false,
            },
            {
              klass: 'entry-monster entry level2',
              name: '怪物图鉴',
              url: '/pages/monster-list/monster-list',
              icon: 'https://cdn.thinkdiffs.com/static/rise/monster2.png',
              iconLoaded: false,
            },
          ],
        },

        {
          klass: 'entry-daoju entry level3',
          name: '道具',
          url: '/pages/daoju-list/daoju-list',
          icon: '/static/daoju.png',
          iconLoaded: false,
        },
        {
          klass: 'entry-armor entry level3',
          name: '防具',
          url: '/pages/armor-list/armor-list',
          icon: '/static/armor.png',
          iconLoaded: false,
        },
        {
          klass: 'entry-skill entry level3',
          name: '技能',
          url: '/pages/skill-list/skill-list',
          icon: '/static/skill.png',
          iconLoaded: false,
        },
        {
          klass: 'entry-task entry level3',
          name: '任务',
          url: '/pages/task-list/task-list',
          icon: '/static/task.png',
          iconLoaded: false,
        },
        {
          klass: 'entry-decoration entry level3',
          name: '装饰品',
          url: '/pages/decoration-list/decoration-list',
          icon: 'https://cdn.thinkdiffs.com/static/rise/icon-decoration.png',
          iconLoaded: false,
        },
        {
          klass: 'entry-tuanzi entry level3',
          name: '团子技能',
          url: '/pages/tuanzi-skill-list/tuanzi-skill-list',
          icon: 'https://cdn.thinkdiffs.com/static/rise/yomogi_main.png',
          iconLoaded: false,
        },
        {
          klass: 'entry-msg entry level3',
          name: '留言板',
          miniapp: true,
          icon: 'https://cdn.thinkdiffs.com/static/rise/pet.png',
          iconLoaded: false,
        },
      ],
      db: wx.cloud.database(),
      notice: {},
    };
  },
  created() {
    this.getNotice();
    this.$apis.addUser();
  },
  onLoad() {
    setTimeout(() => {
      this.recoAnimated = true;
    }, 1000);
  },
  methods: {
    onIconLoaded(item) {
      item.iconLoaded = true;
    },
    getNotice() {
      this.db
        .collection('notice')
        .where({ is_published: true })
        .orderBy('_updateTime', 'desc')
        .limit(1)
        .get({
          success: res => {
            const notice = res.data[0];
            console.log('notice', notice);
            if (notice && notice.items) {
              const { _id } = notice;
              const readedId = uni.getStorageSync('MH_LAST_READ_NOTICEID');
              console.log('readedId', readedId);
              this.showNotice = readedId !== _id;
              this.notice = notice;
              uni.setStorageSync('MH_LAST_READ_NOTICEID', _id);
            }
          },
          fail(err) {
            console.log('error', err);
          },
        });
    },
  },
  onShareAppMessage() {
    return {
      path: `/pages/index/index`,
      imageUrl: 'https://cdn.thinkdiffs.com/static/rise/share2.jpeg',
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
<style lang="scss" scoped>
$bgColorAm: #020702;
$bgColorPm: #140d15;
// .sub-menus {
// }
// .sub-item {
//   width: 30%;
//   box-shadow: 0 3rpx 6rpx #fff;
//   border-radius: $border-radius-base * 2;
//   background: $color-yellow;
// }
.page {
  background: $bgColorAm;
  overflow-x: hidden;
  &.pm {
    background: $bgColorPm;
    .blur {
      background: $bgColorPm;
    }
  }
}
.blur {
  background: $bgColorAm;
  filter: blur(50rpx);
}
.bg-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  transform: scale(1);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
  &.animate {
    opacity: 1;
    transform: scale(1.1);
  }
}
.bg-image-placeholder {
  top: 280rpx;
  z-index: 1;
}
.poster {
  width: 100vw;
  opacity: 0.8;
}
.logo {
  top: 66rpx;
  width: 538rpx;
}
.main {
  padding: 400rpx 0 0;
  z-index: 2;
}
.main-inner {
  padding: 20rpx 36rpx;
}
.entries-content {
  flex-wrap: wrap;
}
.entry {
  &.level1 {
    .name {
      font-size: 58rpx;
    }
    .entry-inner {
      padding: 90% 0 0;
    }
  }
  &.level2 {
    .name {
      font-size: 46rpx;
    }
    .entry-inner {
      padding: 40% 0 0;
    }
    &:not(:first-child) {
      .entry-inner {
        margin: 10% auto 0;
      }
    }
  }
  &.level3 {
    .name {
      font-size: 40rpx;
    }
    .entry-inner {
      padding: 33% 0 0;
    }

    .deco {
      width: 38rpx;
      height: 38rpx;
    }
  }
}
.entry-inner {
  position: relative;
  width: 100%;
  height: 0;
  margin: 20rpx auto;
  box-shadow: 0 3rpx 6rpx #fff;
  border-radius: $border-radius-base * 2;
  background: $color-yellow;
  .coming-soon {
    display: none;
  }
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    .coming-soon {
      display: block;
    }
  }
  .inner {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }
  .name {
    font-family: customff;
  }
  .icon {
    position: absolute;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.3s, transform 0.3s;
    &.show {
      transform: scale(1);
      opacity: 1;
    }
  }
}

.entry-pzq {
  width: 48%;
  .deco {
    right: 108rpx;
    top: 58rpx;
  }
  .coming-soon {
    position: absolute;
    right: 80rpx;
    top: 50%;
    transform: translate(0, -50%);
  }
  .inner {
    width: 58rpx;
    right: 46rpx;
    transform: translate(0, -50%);
  }
  .icon {
    left: -10rpx;
    bottom: 0;
    width: 180rpx;
  }
}

.entry-weapon {
  width: 100%;
  .entry-inner {
    text-align: center;
  }
  .deco {
    left: 18rpx;
    top: 18rpx;
  }
  .icon {
    right: -38rpx;
    top: 0rpx;
    width: 180rpx;
  }
  .inner {
    left: 30rpx;
    transform: translate(0, -50%);
  }
}
.entry-monster {
  width: 100%;
  .entry-inner {
    text-align: center;
  }
  .deco {
    left: 88rpx;
    top: 18rpx;
  }
  .inner {
    left: 30rpx;
    transform: translate(0, -50%);
  }
  .icon {
    right: -20rpx;
    top: -20rpx;
    width: 150rpx;
  }
}
.entry-daoju {
  width: 48%;
  .deco {
    left: 138rpx;
    top: 38rpx;
  }
  .icon {
    left: 6rpx;
    top: -58rpx;
    width: 138rpx;
  }
  .inner {
    right: 30rpx;
  }
}

.entry-armor {
  width: 48%;
  .deco {
    right: 138rpx;
    top: 28rpx;
  }
  .icon {
    right: -26rpx;
    top: -18rpx;
    width: 150rpx;
  }
  .inner {
    left: 30rpx;
  }
}

.entry-skill {
  width: 48%;
  .deco {
    left: 150rpx;
    top: 28rpx;
  }
  .icon {
    left: -28rpx;
    top: 0rpx;
    width: 180rpx;
  }
  .inner {
    right: 30rpx;
  }
}
.entry-task {
  width: 48%;
  .deco {
    right: 150rpx;
    top: 28rpx;
  }
  .icon {
    right: -8rpx;
    top: -10rpx;
    width: 118rpx;
    transform: translate(50%, 0);
    &.show {
      transform: translate(0, 0);
      opacity: 1;
    }
  }
  .inner {
    left: 30rpx;
  }
}
.entry-tuanzi {
  width: 48%;
  .deco {
    right: 150rpx;
    top: 28rpx;
  }
  .icon {
    right: -8rpx;
    top: -10rpx;
    width: 128rpx;
    transform: translate(50%, 0);
    &.show {
      transform: translate(0, 0);
      opacity: 1;
    }
  }
  .inner {
    left: 30rpx;
  }
}

.entry-decoration {
  width: 48%;
  .deco {
    left: 120rpx;
    top: 28rpx;
  }
  .icon {
    left: 50rpx;
    top: -30rpx;
    width: 80rpx;
  }
  .inner {
    right: 30rpx;
  }
}

.entry-msg {
  width: 48%;
  .icon {
    left: 38rpx;
    top: -16rpx;
    width: 88rpx;
    transform: translate(50%, 0);
    &.show {
      transform: translate(0, 0);
      opacity: 1;
    }
  }
  .inner {
    right: 30rpx;
  }
}

.notice {
  padding: 30rpx;
}
.notice-idx {
  margin: 0 10rpx 0 0;
  width: 30rpx;
}
.recommend {
  position: absolute;
  right: 0;
  top: 200rpx;
  border-radius: 10rpx 0 0 10rpx;
  box-shadow: -10rpx 0 10rpx rgba($color: #fff, $alpha: 0.6);
  overflow: hidden;
  transform: translate(100%, 0);
  transition: transform 0.15s ease-in;
  &.animated {
    transform: translate(0, 0);
  }
}
.reco-mp {
  display: block;
  width: 110rpx;
  height: 110rpx;
}
</style>
