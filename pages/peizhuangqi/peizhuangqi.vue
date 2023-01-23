<template>
  <view class="page safe-area-inset-bottom flex-dir-v">
    <Loading v-if="loading" />
    <template v-else>
      <view class="flex1 oa">
        <!-- 筛选 -->
        <view class="filters">
          <view class="fs12 flex-sb">
            <text class="flex1">通过技能筛选装备</text>
            <Geili
              v-if="!isOwner && likedLoaded"
              :likeNum="likeNum"
              :fittingId="originalId"
              :isLiked="isLiked"
              @change="onLiked"
            />
          </view>
          <view class="flex flex-wrap">
            <u-tag
              class="mr2 mt2"
              v-for="item in skillsFiltered"
              :key="item._id"
              :text="item.name"
              closeable
              @close="doDelSkill(item._id)"
            ></u-tag>
            <u-tag class="mr2 mt2" type="info" text="点击选择技能" @click="doShowPickerList('skill')"></u-tag>
          </view>
        </view>
        <view class="main">
          <view class="flex-sb">
            <!-- 装备 -->
            <view class="equips">
              <view class="sub-title">装备</view>
              <view
                class="equip-item card"
                v-for="(item, equipType) in equips"
                :key="equipType"
                :class="showWhichList === equipType ? [item.klass, 'active'] : [item.klass]"
                @click="doShowPickerList(equipType)"
              >
                <!-- 装备名称 -->
                <view class="flex-vc flex-sb">
                  <image mode="widthFix" class="equip-icon flex0" :src="item.selected.icon || item.defaultIcon" />
                  <view class="flex1">
                    <text class="name fwb" v-if="item.selected">{{ item.selected.name }}</text>
                    <text v-else class="name gray9 fs12">{{ item.placeholder }}</text>
                  </view>
                  <view v-if="item.selected" @click.stop="doDel(equipType)">
                    <u-icon name="minus-circle" color="#666" class="equip-del fs18"></u-icon>
                  </view>
                </view>
                <!-- 装备插槽 -->
                <view class="mt2" v-if="item.selected.slots.length" @click.stop>
                  <view
                    class="equit-slot-item card flex-vc"
                    v-for="(slot, idx) in item.selected.slots"
                    :key="idx"
                    :class="{
                      active:
                        currentDecorationSlot &&
                        currentDecorationSlot.equipType === equipType &&
                        currentDecorationSlot.slotIdx === idx,
                    }"
                    @click="doShowDecoPickerList(equipType, slot.size, idx)"
                  >
                    <image :src="slot.icon" mode="widthFix" class="equip-slot mr2" />
                    <!-- 如果插槽中没有镶嵌装饰品 -->
                    <template v-if="!slot.selected">
                      <text class="gray9 fs12 deco-name">选择装饰品【{{ slot.size }}】</text>
                    </template>
                    <template v-else>
                      <text class="fwb deco-name flex1">{{ slot.selected.name }}</text>
                      <view @click.stop="doDelDeco(equipType, idx)">
                        <u-icon name="minus-circle" color="#666" class="deco-del fs18"></u-icon>
                      </view>
                    </template>
                  </view>
                </view>
              </view>
            </view>
            <!-- 技能 -->
            <view class="skills fs12">
              <view class="sub-title">
                <text>已装配技能</text>
              </view>
              <view class="card rel">
                <template v-if="hasSkillResults">
                  <view class="flex-hc">
                    <ArmorType :item="fittingResult.tolerance" dir="v" size="small" :showDef="false" />
                  </view>
                  <navigator
                    class="skill-item card mv4"
                    v-for="skillId in fittingResult.skillIds"
                    :key="skillId"
                    :url="fittingResult.skills[skillId].url"
                  >
                    <view class="flex-sb">
                      <view class="flex1 fs12 fwb">{{ fittingResult.skills[skillId].name }}</view>
                      <u-icon name="arrow-right" class="skill-more flex0 gray9"></u-icon>
                    </view>
                    <view class="skill-percent flex-vc rel">
                      <view class="flex1 full-h flex" style="width: 90%">
                        <view
                          class="skill-percent-item"
                          v-for="(i, idx) in fittingResult.skills[skillId].maxLevel"
                          :key="i"
                          :class="{ active: idx < fittingResult.skills[skillId].level }"
                        ></view>
                      </view>
                      <text class="skill-percent-num">{{ fittingResult.skills[skillId].level }}</text>
                    </view>
                  </navigator>
                </template>
                <view v-else class="nodata tl">请从左边选择带有技能的装备或装饰品</view>
                <image class="skill-icon abs" src="/static/icon-skill.png" mode="widthFix" />
              </view>
            </view>
          </view>
          <view class="card pv2 mt4">
            <u-field
              v-model="name"
              label="配装名称"
              required
              placeholder="请输入配装名称"
              :border-bottom="false"
              :focus="nameFocus"
              @blur="nameFocus = false"
              @confirm="confirm = false"
            ></u-field>
          </view>
          <!-- banner 广告 -->
          <!-- <view class="ad300" style="margin-top: 40rpx">
            <ad unit-id="adunit-da065710c58bc6d7" ad-intervals="30"></ad>
          </view> -->
        </view>
      </view>
      <view class="actions flex-sb flex0 flex-vc">
        <Share class="action-share" shareStyle="icon" />
        <!-- <view class="ph4">
          <u-button type="info" @click="go2mylist">
            <u-icon name="account"></u-icon>
            <view class="ml2">我的配装</view>
          </u-button>
        </view> -->
        <view class="action-save flex1 ml2">
          <u-button type="primary" open-type="getUserInfo" ripple @getuserinfo="doSave">
            <text>{{ saveLabel }}</text>
          </u-button>
        </view>
      </view>
    </template>
    <!-- 装备列表 -->
    <u-popup width="50%" :value="showWhichList" mode="right" :mask="false" @close="onSimpleListClosed">
      <!-- {{ showWhichList }} -->
      <WeaponSimpleList
        v-if="showWhichList === 'weapon'"
        :type="showWhichList"
        :current="equips[showWhichList].selected"
        :filters="filters"
        @select="onWeaponSelect"
      />
      <SkillSimpleList
        v-else-if="showWhichList === 'skill'"
        :type="showWhichList"
        :selectedList="skillsFiltered"
        :filters="filters"
        @select="onSkillSelected"
      />
      <DecorationSimpleList
        v-else-if="showWhichList === 'decoration'"
        :type="showWhichList"
        :current="currentDecorationSlot"
        :filters="filters"
        @select="onDecorationSelected"
      />
      <StoneSimpleList
        v-else-if="showWhichList === 'stone'"
        :type="showWhichList"
        :current="equips[showWhichList].selected"
        :filters="filters"
        @select="onStoneSelected"
        @add-stone="doShowAddStone"
      />
      <ArmorSimpleList
        v-else-if="showWhichList"
        :type="showWhichList"
        :filters="filters"
        :current="equips[showWhichList].selected"
        @select="v => onArmorSelect(showWhichList, v)"
      />
    </u-popup>
    <u-top-tips ref="uTips" z-index="99999"></u-top-tips>
    <AddStone :show="showAddStone" @close="showAddStone = false" />
  </view>
</template>

<script>
import WeaponSimpleList from './weapon-simple-list';
import ArmorSimpleList from './armor-simple-list';
import SkillSimpleList from './skill-simple-list';
import StoneSimpleList from './stone-simple-list';
import Loading from '../../components/loading';
import DecorationSimpleList from './decoration-simple-list';
import Share from '../../components/share';
import ArmorType from '../../components/armor-type';
import AddStone from '../../components/add-stone';
import Geili from '../../components/geili';

import { singleEquipFormatter } from '../../utils';

export default {
  components: {
    Loading,
    ArmorType,
    Share,
    Geili,
    AddStone,
    SkillSimpleList,
    StoneSimpleList,
    WeaponSimpleList,
    ArmorSimpleList,
    DecorationSimpleList,
  },
  data() {
    return {
      showAddStone: false,
      showWhichList: '',
      isOwner: false,
      equips: {
        weapon: {
          defaultIcon: '/static/great-sword.png',
          klass: 'equip-weapon',
          placeholder: '点击选择武器',
          selected: null,
        },
        head: {
          defaultIcon: '/static/armors/head.png',
          klass: 'equip-head',
          placeholder: '点击选择头盔',
          selected: null,
        },
        chest: {
          defaultIcon: '/static/armors/chest.png',
          klass: 'equip-chest',
          placeholder: '点击选择铠甲',
          selected: null,
        },
        arms: {
          defaultIcon: '/static/armors/arms.png',
          klass: 'equip-arms',
          placeholder: '点击选择腕甲',
          selected: null,
        },
        waist: {
          defaultIcon: '/static/armors/waist.png',
          klass: 'equip-waist',
          placeholder: '点击选择腰甲',
          selected: null,
        },
        legs: {
          defaultIcon: '/static/armors/legs.png',
          klass: 'equip-legs',
          placeholder: '点击选择护腿',
          selected: null,
        },
        stone: {
          defaultIcon: '/static/armors/stone.png',
          klass: 'equip-stone',
          placeholder: '点击选择护石',
          selected: null,
        },
      },
      skillsFiltered: [],
      currentDecorationSlot: null,
      db: wx.cloud.database(),
      currentAction: '',
      saving: false,
      id: '',
      name: '',
      loading: false,
      isCopy: false,
      nameFocus: false,
      likeNum: '',
      isLiked: false,
      originalId: '',
      likedLoaded: false,
    };
  },
  computed: {
    saveLabel() {
      const { id, isCopy } = this;
      return id ? '更新配装' : isCopy ? '保存为我的配装' : '保存配装';
    },
    filters() {
      const result = {
        skills: this.skillsFiltered.map(i => i._id),
      };

      console.log('filters', result);
      return result;
    },
    fittingResult() {
      const { equips, $constants } = this;
      const { armorPartMap } = $constants;
      const skillResult = {};
      const data4submit = {};
      const tolerance = { fire: 0, water: 0, ice: 0, thunder: 0, dragon: 0 };
      // 从武器插槽、防具、防具插槽装饰品中提取技能
      Object.keys(equips).forEach(equipType => {
        const selectedEquip = equips[equipType].selected;
        if (selectedEquip) {
          if (equipType in armorPartMap) {
            Object.keys(tolerance).forEach(k => {
              tolerance[k] += selectedEquip[k];
            });
          }
          // 装备本身技能
          selectedEquip.skills_detail
            // 过滤出有技能等级的装备
            .filter(i => i.level)
            .forEach(skill => {
              singleSkillHandler(skillResult, skill);
            });

          // 装备上插槽里的技能
          const { slots = [] } = selectedEquip;
          slots
            .map(i => i.selected)
            .filter(i => i)
            .forEach(deco => {
              const skills = deco.skills_detail;
              skills.forEach(skill => singleSkillHandler(skillResult, skill));
            });

          data4submit[equipType] = {
            id: selectedEquip._id,
            name: selectedEquip.name,
            slots: slots.map(i => {
              const { size } = i;
              return i.selected ? { size, id: i.selected._id, name: i.selected.name } : { size };
            }),
          };
        }
      });

      function singleSkillHandler(skillResult, skill = {}) {
        const id = skill.id || skill._id;
        const level = (skill.level = +skill.level);
        const maxLevel = (skill.maxLevel = +skill.maxLevel);
        skill.url = `/pages/skill-detail/skill-detail?id=${id}`;
        // console.log('skill', skill);
        if (!skillResult[id]) {
          // 复制一份，否则会直接改了元数据
          skillResult[id] = { ...skill };
        } else {
          const totalLevel = +skillResult[id].level;
          // 超过最大等级则只显示最大等级，多了没用
          skillResult[id].level = totalLevel + level > maxLevel ? maxLevel : totalLevel + level;
        }
      }

      const result = {
        equips,
        skills: skillResult,
        skillIds: Object.keys(skillResult),
        data4submit,
        tolerance,
      };
      console.log('fittingResult', equips, result);
      return result;
    },
    hasSkillResults() {
      return Object.keys(this.fittingResult.skills).length;
    },
  },
  onLoad({ id }) {
    this.id = id;
    this.originalId = id;
    if (id) {
      this.getDetail();
    }
  },
  methods: {
    onLiked(v) {
      if (v) {
        this.isLiked = true;
        this.likeNum++;
      }
    },
    // 在配装器中进行保存/更新操作时需要刷新我的配装列表数据
    refreshPreviewPage(params = {}) {
      const { isStarChange, isFittingChange } = params;
      //关于获取页面的官方文档https://uniapp.dcloud.io/api/window/window
      const pageStack = getCurrentPages();
      console.log(pageStack);
      const previewPage = pageStack[pageStack.length - 2];
      // 判断上一个页面是我的配装列表
      if (previewPage) {
        const { route, options, $vm } = previewPage;
        // isFittingChange 对我的配装的操作
        if (isFittingChange && route === 'pages/fitting-list/fitting-list' && +options.type === 1) {
          previewPage.$vm.shouldRefresh = true;
        }
        // isStarChange 配装大厅的配装点赞数量更新
        if (isStarChange && route === 'pages/fitting-list/fitting-list' && +options.type === 0) {
          previewPage.$vm.shouldRefresh = true;
        }
        console.log('previewPage.$vm.shouldRefresh', previewPage.$vm.shouldRefresh);
      }
    },
    go2mylist() {
      uni.navigateTo({ url: '/pages/fitting-list/fitting-list' });
    },
    onStoneSelected(value) {
      this.equips.stone.selected = value;
      this.showWhichList = '';
    },
    doShowAddStone() {
      this.showAddStone = true;
      this.showWhichList = '';
    },
    checkLiked(id) {
      wx.cloud
        .callFunction({
          name: 'checkFittingLiked',
          data: {
            id,
          },
        })
        .then(res => {
          console.log(111, 'liked', res);
          this.isLiked = res.result;
          this.likedLoaded = true;
        });
    },
    // 数据恢复
    getDetail() {
      const { id, equips } = this;
      this.loading = true;
      wx.cloud
        .callFunction({
          name: 'getFitting',
          data: { id },
        })
        .then(res => {
          try {
            console.log('detail', JSON.parse(JSON.stringify(res.result)));
            // 根据装备id获取到的具体数据，id为key
            const { data, isOwner, name, like_num } = res.result;
            this.likeNum = like_num;
            this.name = name;
            const remoteEquipConfig = res.result.equips;
            this.isOwner = isOwner;
            if (!isOwner) {
              this.isCopy = true;
              this.checkLiked(id);
              this.id = '';
            }

            console.log('detail info', res.result);
            Object.keys(remoteEquipConfig).forEach(equipType => {
              const field = equipType === 'weapon' ? 'weapon' : equipType === 'stone' ? 'stone' : 'armor';
              // 远程配置里的信息，id配件id，slots插槽配置
              const { id, slots } = remoteEquipConfig[equipType];
              const remoteSlotsConfig = slots;
              // 预处理后的当前配件
              const selectedEquip = id ? singleEquipFormatter(data[field][id]) : null;
              if (selectedEquip) {
                // 对配件的插槽信息中的装饰品根据远程配置信息进行补全
                selectedEquip.slots.forEach((slot, idx) => {
                  const decoId = remoteSlotsConfig[idx].id;
                  slot.selected = decoId ? singleEquipFormatter(data.decoration[decoId]) : null;
                });
              }
              equips[equipType].selected = selectedEquip;
            });

            console.log(111, equips);
          } catch (err) {
            console.log(err);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$refs.uTips.show({ title: '配装获取失败，请重试', type: 'error', duration: '2000' });

          this.loading = false;
        });
    },
    async doSave() {
      const { fittingResult, id, name } = this;
      if (name === '') {
        uni.showToast({ title: '请输入配装名称', duration: 2000, icon: 'none' });
        this.nameFocus = true;
        return;
      } else {
        const nameValid = await this.$apis.checkText(name, { errMsg: '配装名称包含敏感词，请修改' });
        if (!nameValid) return;
      }
      try {
        const skills = Object.keys(fittingResult.skills).map(key => {
          const { name, level } = fittingResult.skills[key];
          return `${name}${level}`;
        });
        if (id) {
          uni.showLoading({ title: '更新中' });
          await wx.cloud.callFunction({
            name: 'updateFitting',
            data: {
              id,
              name,
              config: {
                equips: fittingResult.data4submit,
                skills,
              },
            },
          });
          this.loading = false;
          this.$refs.uTips.show({ title: '更新成功', type: 'success', duration: '2000' });
          this.refreshPreviewPage({ isFittingChange: true });
          uni.hideLoading();
          this.isOwner = true;
        } else {
          uni.showLoading({ title: '保存中' });
          const res = await wx.cloud.callFunction({
            name: 'addFitting',
            data: {
              name,
              config: {
                equips: fittingResult.data4submit,
                skills,
              },
            },
          });
          this.loading = false;
          this.$refs.uTips.show({ title: '保存成功', type: 'success', duration: '2000' });
          this.refreshPreviewPage({ isFittingChange: true });
          this.isOwner = true;
          if (res.result._id) {
            this.id = res.result._id;
          }
          uni.hideLoading();
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
        this.$refs.uTips.show({ title: this.id ? '更新失败' : '保存失败', type: 'error', duration: '2000' });
        uni.hideLoading();
      }
    },
    onSimpleListClosed() {
      this.showWhichList = '';
      this.currentDecorationSlot = null;
    },
    doShowPickerList(type) {
      this.showWhichList = type;
    },
    doShowDecoPickerList(equipType, size, slotIdx) {
      this.showWhichList = 'decoration';
      this.currentDecorationSlot = { armor: this.equips[equipType], equipType, size, slotIdx };
    },
    doDelDeco(equipType, slotIdx) {
      this.equips[equipType].selected.slots[slotIdx].selected = null;
    },
    onDecorationSelected(value) {
      console.log(111, value);
      const { armor, slotIdx } = this.currentDecorationSlot;
      armor.selected.slots[slotIdx].selected = value;

      this.currentDecorationSlot = null;
      this.showWhichList = '';
    },
    onSkillSelected(value) {
      const { skillsFiltered } = this;
      const has = skillsFiltered.findIndex(i => i._id === value._id) > -1;
      !has && skillsFiltered.push(value);
    },
    onWeaponSelect(value) {
      this.equips.weapon.selected = value;
      this.showWhichList = '';
      console.log('onWeaponSelect', value);
    },
    onArmorSelect(type, value) {
      console.log('选中的防具', value);

      this.equips[type].selected = value;
      this.showWhichList = '';
    },
    doDel(type) {
      this.equips[type].selected = null;
    },
    doDelSkill(_id) {
      this.skillsFiltered = this.skillsFiltered.filter(i => i._id !== _id);
    },
  },
  onShareAppMessage() {
    const { id } = this;
    if (id) {
      return {
        title: '分享一套怪物猎人崛起配装给你~',
        path: `/pages/peizhuangqi/peizhuangqi?id=${this.id || ''}`,
      };
    } else {
      return {
        title: '怪物猎人崛起配装器',
        path: `/pages/peizhuangqi/peizhuangqi`,
      };
    }
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
// .page {
//   background: $bg-dark;
// }
// .page-bg {
//   width: 100vw;
//   height: 100vh;
//   background: $bg-dark url(https://cdn.thinkdiffs.com/static/rise/bg-fitting.jpeg) no-repeat 50% 0;
//   background-size: contain;
// }
.main {
  padding: 10rpx 20rpx 20rpx;
}
.filters {
  margin: 0 0 10rpx;
  padding: 20rpx;
  background: #fff;
}
.skills {
  width: 40%;
}
.skill-item {
  position: relative;
  background: $color-yellow;
}
.skill-more {
  margin: 0 -10rpx 0 0;
}
.equips {
  width: 56%;
}
.sub-title {
  position: relative;
  margin: 0 auto 10rpx;
  width: 300rpx;
  height: 50rpx;
  font-size: 14px;
  font-weight: bolder;
  text-align: center;
  // color: #fff;
  // background: url(/static/bg-title2.jpeg);
  // background-size: contain;
}
.skill-icon {
  right: 10rpx;
  bottom: 10rpx;
  width: 80rpx;
  height: 80rpx;
  opacity: 0.2;
  pointer-events: none;
}
.equip-item {
  margin: 0 0 20rpx;
  &.active {
    background: $color-primary;
    .name {
      color: #fff !important;
    }
  }
}
.equip-icon {
  margin: 0 10rpx 0 0;
  width: 50rpx;
  height: 50rpx;
  border-radius: $border-radius-base;
  background: $color-yellow;
}
.skill-percent {
  margin: 15rpx 0 0;
  height: 16rpx;
}
.skill-percent-num {
  font-size: 16px;
}
.skill-percent-item {
  margin: 0 2% 0 0;
  width: 12%;
  height: 100%;
  border-radius: $border-radius-base;
  background: #fff;
  &.active {
    background: $color-primary;
  }
}
.equip-slot {
  width: 38rpx;
  height: 38rpx;
}
.equit-slot-item {
  margin: 10rpx 0 0;
  padding: 10rpx;
  background: $color-yellow;
  transition: background-color 0.3s;
  &.active {
    background: $color-primary;
    .deco-name {
      color: #fff;
    }
  }
}
.actions {
  padding: 20rpx;
}
.action-save {
}
.action-share {
}
</style>
