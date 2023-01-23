// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { id } = event;
  const { OPENID } = cloud.getWXContext();
  const result = await db
    .collection('like_user_relation')
    .where({
      fittingid: id,
      userid: OPENID,
    })
    .limit(1)
    .get()
    .then(res => res.data);

  return result.length > 0;
};
