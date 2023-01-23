// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event;
  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();

  const weaponIds = { name: 'weapon', collection: 'weapon-v2', ids: [] };
  const armorIds = { name: 'armor', collection: 'armor', ids: [] };
  const decoIds = { name: 'decoration', collection: 'decoration', ids: [] };
  const stoneIds = { name: 'stone', collection: 'stone', ids: [] };

  const promiseArr = [weaponIds, armorIds, decoIds, stoneIds];
  // 保存的原始装备信息
  let originEquips = {};
  let originName = '';
  // let originSkills = [];
  let originDetail = {};
  let isOwner = false;

  const result = await db
    .collection('fitting')
    .doc(id)
    .get()
    .then(res => {
      originDetail = res.data;
      isOwner = originDetail._openid === OPENID;
      const { equips, skills } = originDetail.config;
      originEquips = equips;
      // originSkills = skills;
      originName = originDetail.name;
      console.log('detail info', equips);
      Object.keys(equips).forEach(equipType => {
        const { id, slots } = equips[equipType];
        switch (equipType) {
          // 武器
          case 'weapon':
            weaponIds.ids.push(id);
            break;
          // 护石
          case 'stone':
            stoneIds.ids.push(id);
            break;
          // 防具
          default:
            armorIds.ids.push(id);
            break;
        }

        decoIds.ids.push(...slots.map(i => i.id).filter(i => i));
      });

      return Promise.all([
        ...promiseArr.map(item => {
          const { collection, ids } = item;
          if (ids.length === 0) {
            return Promise.resolve([]);
          } else {
            return db
              .collection(collection)
              .where({
                _id: db.command.in(ids),
              })
              .get()
              .then(res => {
                return res.data;
              });
          }
        }),
      ]);
    });
  return {
    id,
    isOwner,
    equips: originEquips,
    like_num: originDetail.like_num,
    // skills: originSkills,
    name: originName,
    data: promiseArr.reduce((map, item, idx) => {
      map[item.name] = result[idx].reduce((m, i) => {
        m[i._id] = i;
        return m;
      }, {});
      return map;
    }, {}),
  };
};
