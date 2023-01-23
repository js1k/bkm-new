// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();

  const { config, name = '' } = event;
  const result = await db.collection('fitting').add({
    data: {
      config,
      name,
      created_at: +new Date(),
      updated_at: +new Date(),
      _openid: OPENID,
      userid: OPENID,
    },
  });

  return result;
};
