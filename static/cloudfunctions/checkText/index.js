// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.text,
    });
    return result;
  } catch (err) {
    return { errCode: 1 };
  }
};
