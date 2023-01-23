// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'prod-8gj6ilx469840d94' });

exports.main = async (event, context) => {
  const db = cloud.database();
  // 聚合查询
  const result = await db.collection('armor_skill').limit(999).get();

  // 貌似聚合的数组数据返回在list，费聚合的返回在data
  return result;
};
