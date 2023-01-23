// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

exports.main = async (event, context) => {
  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();

  const { pageSize, pageNo, simpleWhere = {}, skills = [] } = event;
  const _ = db.command;

  const where = simpleWhere;
  where._openid = OPENID;

  if (skills.length) {
    where.skillList = {
      skill_id: _.in(skills),
    };
  }

  // 聚合查询
  const result = await db
    .collection('stone')
    .where(where)
    .orderBy('updated_at', 'desc')
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .get();

  // 貌似聚合的数组数据返回在list，费聚合的返回在data
  return result;
};
