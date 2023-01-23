export const levelMap = { 1: '上位', 0: '下位' };
export const primaryColor = '#fe7634';
export const weaponTypes = [
  {
    value: 1,
    name: '大剑',
    icon: '/static/great-sword.png',
    type: 1,
    desc: '比较笨重的武器，操作简单，蓄力斩伤害高，可防御。但因为攻击和移动缓慢，时机掌握不好很容易打空',
  },
  {
    value: 2,
    name: '单手剑',
    icon: '/static/sword-and-shield.png',
    type: 1,
    desc: '攻击速度快，盾牌可防御， 不用收刀就能使用道具。但伤害偏低。',
  },
  {
    value: 3,
    name: '双剑',
    icon: '/static/dual-blades.png',
    type: 1,
    desc: '攻击快，输出高，但攻击范围很小。鬼人状态下耐力槽会不断下降',
  },
  {
    value: 4,
    name: '太刀',
    icon: '/static/long-sword.png',
    type: 1,
    desc: '攻击范围大， 气刃斩爆发高，可防反，武器动作华丽。',
  },
  {
    value: 5,
    name: '大锤',
    icon: '/static/hammer.png',
    type: 1,
    desc: '可以移动蓄力，攻击节奏快，容易打出怪物眩晕，破坏力与移动性兼备。',
  },
  {
    value: 6,
    name: '狩猎笛',
    icon: '/static/hunting-horn.png',
    type: 1,
    desc:
      '通过打出不同的乐谱可以为自己和队友提供各种不同的增益效果，是一把偏辅助的武器。虽然练起来比较麻烦，但熟练的狩猎笛猎人在组队时是很受欢迎的。',
  },
  {
    value: 7,
    name: '长枪',
    icon: '/static/lance.png',
    type: 1,
    desc: '可防御绝大部分攻击，攻击精准，能从远处进行冲刺，是注重防御，比较稳健的武器。',
  },
  {
    value: 8,
    name: '铳枪',
    icon: '/static/gunlance.png',
    type: 1,
    desc:
      '与长枪很像，但在重视防御的基础上通过增加炮击大幅度提高了输出。拥有无视防御与肉质，能打出固定伤害，被称为“龙击炮”强力招式',
  },
  {
    value: 9,
    name: '斩斧',
    icon: '/static/switch-axe.png',
    type: 1,
    desc: '能在剑和斧两种形态装换，能通过觉醒+属性解放能打出不错的伤害',
  },
  {
    value: 10,
    name: '盾斧',
    icon: '/static/charge-blade.png',
    type: 1,
    desc:
      '可以说是近战操作最复杂的武器，能在斧和单手剑形态之间切换，盾牌还能防御。通过积攒并消耗属性瓶可以达成很夸张的输出，是一把非常暴力的武器。',
  },
  {
    value: 11,
    name: '操虫棍',
    icon: '/static/insect-glaive.png',
    type: 1,
    desc: '攻击速度快，可以让虫子吸取怪物不同部位的精华来强化自己，自身可以原地起跳，能比较方便的骑乘怪物。',
  },
  {
    value: 12,
    name: '弓',
    icon: '/static/bow.png',
    type: 2,
    desc:
      '攻击不消耗弹药，可移动蓄力的远程武器。新加入的“龙之一箭”蓄力时间长，不能取消，但伤害很高。使用装填瓶还能打出各种各样的属性攻击。',
  },
  {
    value: 13,
    name: '重弩炮',
    icon: '/static/heavy-bowgun.png',
    type: 2,
    desc:
      '能发射高威力的子弹的远程武器，还可以使用高输出的“机关龙弹”和“狙击龙弹”两种特殊攻击。动作慢，装填时间长。但反作用力小，装填弹药数量多',
  },
  {
    value: 14,
    name: '轻弩炮',
    icon: '/static/light-bowgun.png',
    type: 2,
    desc: '以快速射击、回避为亮点的远程武器，可在地上设置类似地雷的“起爆龙弹”。缺点是反作用力大，可填充弹药少，',
  },
];

export const rareMap = {
  1: '#b4b2b0',
  2: '#b4b52b',
  3: '#5362ed',
  4: '#368a1c',
  5: '#2c97e4',
  6: '#d1496a',
  7: '#ff0000',
};

// 装备数据表映射关系
export const dbMap = {
  skill: { table: 'armor_skill' },
  weapon: { table: 'weapon-v2' },
  head: { table: 'armor' },
  chest: { table: 'armor' },
  arms: { table: 'armor' },
  waist: { table: 'armor' },
  legs: { table: 'armor' },
  decoration: { table: 'decoration' },
};

// 防具部位映射表
export const armorPartMap = {
  head: 1,
  chest: 2,
  arms: 3,
  waist: 4,
  legs: 5,
};

export const loadText = {
  loadmore: '上拉或点击加载更多',
  loading: '努力加载中',
  nomore: '没有更多了',
};
