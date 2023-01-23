// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { config, name = '', id } = event;
  const { OPENID } = cloud.getWXContext();

  const data = {
    config: db.command.set(config),
    name,
    updated_at: +new Date(),
    _openid: OPENID,
    userid: OPENID,
  };

  const result = await db.collection('fitting').doc(id).update({
    data,
  });

  return result;
};
