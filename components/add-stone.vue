<template>
  <view>
    <u-modal
      title="添加新护石"
      width="80%"
      ref="uModal"
      :async-close="true"
      :show-cancel-button="true"
      :value="show"
      @confirm="doSave"
      @cancel="$emit('close')"
    >
      <view class="add-stone">
        <view class="card mb4">
          <u-input maxlength="20" v-model="name" placeholder="请输入护石名" height="36"></u-input>
        </view>
        <view class="card mb4">
          <view class="skill item flex-sb" v-for="(skill, idx) in skills" :key="idx" @click="doShowSkillPicker(idx)">
            <view v-if="skill" class="flex-sb flex1">
              <view class="flex1 fwb">{{ skill.name }}</view>
              <view class="flex0">Lv{{ skill.level }}</view>
            </view>
            <view v-else class="gray9 fs12">点击添加技能{{ idx + 1 }}</view>
            <u-icon name="arrow-right" class="flex0 more ml2"></u-icon>
          </view>
          <view class="item flex-sb" @click="showSlotPicker = true">
            <text v-if="slot.value" class="fwb">{{ slot.label }}</text>
            <text v-else class="gray9 fs12">设置插槽</text>
            <u-icon name="arrow-right" class="flex0 more ml2"></u-icon>
          </view>
        </view>
        <!-- 为了让配装对其他猎人更有参考价值，请按照游戏的合理规则创建护石哦～ -->
        <u-alert-tips type="warning" title="友情提醒" description="请按照游戏的合理规则创建护石哦～"></u-alert-tips>
      </view>
    </u-modal>
    <u-select
      v-model="showSkillPicker"
      mode="mutil-column-auto"
      z-index="99999"
      :list="skillList"
      :defaultValue="defaultValue"
      @confirm="onSkillSelected"
    ></u-select>
    <u-select
      v-model="showSlotPicker"
      mode="single-column"
      z-index="99999"
      :list="slotList"
      :defaultValue="slot"
      @confirm="onSlotSelected"
    ></u-select>
  </view>
</template>
<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    value: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      name: '',
      skillList: [],
      skills: [undefined, undefined],
      slot: {},
      showSkillPicker: false,
      currentSkill: -1,
      defaultValue: [],
      showSlotPicker: false,
      slotList: [
        // label是参考的配装器网站上的表示法，value是我们的内部的表示法
        // label表示1小孔，2中孔，3大孔，没有顺序
        // value有顺序，小-中-大，数字表示个数
        { value: '0;0;0', label: '0;0;0' },
        { value: '1;0;0', label: '1;0;0' },
        { value: '2;0;0', label: '1;1;0' },
        { value: '3;0;0', label: '1;1;1' },
        { value: '0;1;0', label: '2;0;0' },
        { value: '1;1;0', label: '2;1;0' },
        { value: '2;1;0', label: '2;1;1' },
        { value: '0;2;0', label: '2;2;0' },
        { value: '1;2;0', label: '2;2;1' },
        { value: '0;0;1', label: '3;0;0' },
        { value: '1;0;1', label: '3;1;0' },
        { value: '2;0;1', label: '3;1;1' },
        { value: '0;1;1', label: '3;2;0' },
        { value: '1;1;1', label: '3;2;1' },
      ].map(i => {
        return { value: i.value, label: `Lv ${i.label.split(';').join('-')}` };
      }),
    };
  },
  computed: {
    params() {
      const { name, slot, skills } = this;
      const skillIds = [];
      const $skills = skills
        .filter(i => i)
        .map(skill => {
          const { idx, ...restSkill } = skill;
          skillIds.indexOf(restSkill.id) === -1 && skillIds.push(restSkill.id);
          return restSkill;
        });
      return {
        name,
        deco_num: slot.value,
        skills_detail: JSON.stringify($skills),
        skillList: skillIds.map(i => {
          return { skill_id: i };
        }),
      };
    },
  },
  watch: {
    value: {
      deep: true,
      handler(nv, ov) {
        if (nv !== ov) {
        }
      },
      immediate: true,
    },
    show(nv) {
      if (nv) {
        this.name = '';
        this.skillList = [];
        this.skills = [undefined, undefined];
        this.slot = {};
        this.showSkillPicker = false;
        this.currentSkill = -1;
        this.defaultValue = [];
        this.getSkills();
      }
    },
  },
  created() {},
  methods: {
    doValid() {
      const { name, deco_num } = this.params;
      let msg = '';
      if (!name) {
        msg = '请输入护石名';
      } else if (!deco_num) {
        msg = '请选择护石插槽';
      } else if (this.skills.filter(i => i).length === 0) {
        msg = '请设置至少一个技能';
      }
      if (msg) {
        uni.showToast({ title: msg, duration: 2000, icon: 'none' });
        this.$refs.uModal.clearLoading();
      }
      return !msg;
    },
    doSave() {
      const { params } = this;
      if (!this.doValid()) return;
      this.$apis.checkText(params.name).then(res => {
        if (res) {
          wx.cloud
            .callFunction({
              name: 'addStone',
              data: params,
            })
            .then(() => {
              this.$emit('close', 1);
              uni.showToast({ title: '添加成功', duration: 2000, icon: 'none' });
            })
            .catch(() => {
              uni.showToast({ title: '添加失败，请重试', duration: 2000, icon: 'none' });
              this.$refs.uModal.clearLoading();
            });
        } else {
          this.$refs.uModal.clearLoading();
        }
      });
    },
    onSlotSelected(e) {
      this.slot = e[0];
    },
    doShowSkillPicker(idx) {
      this.showSkillPicker = true;
      this.currentSkill = idx;
      if (this.skills[idx]) {
        const { skillIdx, levelIdx } = this.skills[idx];
        this.defaultValue = [skillIdx, levelIdx];
        console.log(this.defaultValue);
      }
    },
    onSkillSelected(e) {
      console.log(e);
      const [skill, level] = e;
      const { _id, max_level, name, idx } = skill.extra;
      this.skills.splice(this.currentSkill, 1, {
        id: _id,
        name: name,
        level: level.value,
        maxLevel: max_level,
        skillIdx: idx,
        levelIdx: level.extra.idx,
      });

      console.log(111, this.skills);
    },
    async getSkills() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'getAllSkills',
        });
        this.skillList = res.result.data.map((i, idx) => {
          const { _id, name, max_level } = i;
          const levels = [];
          for (let i = 0; i < max_level; i++) {
            levels.push(1);
          }
          return {
            value: _id,
            label: name,
            extra: { ...i, idx },
            children: levels.map((_, idx) => {
              return {
                value: idx + 1,
                label: `Lv ${idx + 1}`,
                extra: { idx },
              };
            }),
          };
        });
        console.log(this.skillList);
      } catch (err) {
        console.log(err);
        uni.showToast({ title: '获取技能列表失败请重试', duration: 2000 });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.add-stone {
  padding: 20rpx 38rpx;
  background: $color-yellow;
}
.item {
  padding: 20rpx 0;
}
.skill {
  border-bottom: 1px dashed #ddd;
}
</style>
