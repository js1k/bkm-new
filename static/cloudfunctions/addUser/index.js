// 云函数入口文件
const cloud = require('wx-server-sdk');
const uidNumber = require('uid-number');

cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();

  try {
    const user = await db.collection('user').where({ _openid: OPENID }).limit(1).get();
    return { ...user.data[0], exist: 1 };
  } catch (err) {
    // not exists
    try {
      const userid = await new Promise(resolve => {
        uidNumber(OPENID, (err, uid, gid) => {
          err ? resolve() : resolve(uid);
        });
      });

      const user = {
        userid,
        created_at: +new Date(),
        updated_at: +new Date(),
        _openid: OPENID,
      };
      await db.collection('user').add({
        data: user,
      });
      return { user, userid, new: 1, OPENID, err };
    } catch (err) {
      return { err, newerr: 1 };
    }
  }
};
