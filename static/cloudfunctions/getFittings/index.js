// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  const { pageNo, pageSize } = event;
  const { OPENID } = cloud.getWXContext();
  const db = cloud.database();
  const result = await db
    .collection('fitting')
    .where({
      _openid: OPENID,
    })
    .orderBy('updated_at', 'desc')
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .get();

  return result;
};
