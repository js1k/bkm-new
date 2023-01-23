// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
// TODO: 事务
exports.main = async (event, context) => {
  const db = cloud.database();
  const { id } = event;
  const { OPENID } = cloud.getWXContext();
  const result = await Promise.all([
    db.collection('like_user_relation').add({
      data: {
        userid: OPENID,
        fittingid: id,
      },
    }),
    db
      .collection('fitting')
      .doc(id)
      .update({
        data: {
          like_num: db.command.inc(1),
        },
      }),
  ]);

  return result[0].errMsg === 'collection.add:ok' && result[1].stats.updated === 1;
};
