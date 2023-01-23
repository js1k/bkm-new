// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

exports.main = async (event, context) => {
  const db = cloud.database();
  const { pageSize, pageNo, keywords, simpleWhere = {}, skills = [], maxSize } = event;
  const _ = db.command;

  const where = simpleWhere;
  if (maxSize) {
    where.size = _.lte(maxSize);
  }

  if (skills.length) {
    where.skillList = {
      skill_id: _.in(skills),
    };
  }

  // 聚合查询
  const result = await db
    .collection('decoration')
    .aggregate()
    .lookup({
      from: 'decoration_skill_relation',
      localField: '_id',
      foreignField: 'decoration_id',
      as: 'skillList',
    })
    .match(
      keywords
        ? _.and([
            _.or([
              { name: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
              { name_en: db.RegExp({ regexp: `.*${keywords}.*`, options: 'i' }) },
            ]),
            where,
          ])
        : where
    )
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .end();

  // 貌似聚合的数组数据返回在list，费聚合的返回在data
  return result;
};
