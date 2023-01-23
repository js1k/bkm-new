export function safeParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return fallback;
  }
}

// 对数据库返回的武器、防具、装饰品每项进行预处理
export const singleEquipFormatter = item => {
  const result = { ...item };
  // 有插槽的配件：防具、武器
  // 无插槽的配件：装饰品
  if (result.deco_num) {
    // 插槽信息[1,1,1]标识位置（大小）1-3的插槽都可以插装饰品；[0,0,0]标识三个位置的插槽都不能插
    // [2,1,0]标识小插槽2个中插槽1个
    const slots = result.deco_num.split(';').reduce((arr, num, sizeIdx) => {
      if (num > 0) {
        for (let i = 0; i < num; i++) {
          arr.push({
            icon: `/static/deco-slot/deco-${sizeIdx + 1}.png`,
            size: sizeIdx + 1,
            selected: null,
          });
        }
      }
      return arr;
    }, []);
    result.slots = slots;
  }

  // 存储防具技能信息
  result.skills_detail = safeParse(result.skills_detail, []).map(i => {
    return { ...i, nameWithLv: `${i.name}${i.level || ''}` };
  });

  result.maxLvLabel = `MAX ${result.maxLevel || result.max_level}`;

  return result;
};

const format = function (template, vars) {
  return template.replace(/\$\{([^\{\}]*)\}/g, function (_, name) {
    const value = vars[name.trim()];
    return value == null ? '' : value + '';
  });
};

const toLen = function (source, len) {
  return (
    Array.prototype.join.call(
      {
        length: len + 1,
      },
      '0'
    ) + source
  ).slice(-len);
};

export const formatDate = function (template, date) {
  if (!date) {
    return '';
  }
  template = template.replace(/\$([a-zA-Z])/g, function (_, key) {
    return '${' + key + '}';
  });
  date = new Date(date);
  const DAY = ['日', '一', '二', '三', '四', '五', '六'];
  return format(template, {
    Y: toLen(date.getFullYear(), 4),
    y: toLen(date.getFullYear(), 2),
    M: toLen(date.getMonth() + 1, 2),
    d: toLen(date.getDate(), 2),
    D: DAY[date.getDay()],
    H: toLen(date.getHours(), 2),
    m: toLen(date.getMinutes(), 2),
    s: toLen(date.getSeconds(), 2),
  });
};

export const getAdSlot = options => {
  const { key = '_id', pageNo } = options || {};
  const ad = { type: 'ad' };
  ad[key] = +new Date() + Math.random();
  // 在列表里的广告出现策略，第一页出现一次，以后每2页出现一次
  if (pageNo !== undefined) {
    return pageNo % 2 === 0 ? [ad] : [];
  }
  // 不在列表里，或者不使用列表策略的时候，就是要加一个广告
  else {
    return [ad];
  }
};

// 获取用户头像昵称
// export const getBasicUserInfo = detail => {
//   return new Promise(resolve => {
//     // 通过按钮获取到的数据
//     if (detail) {
//       console.log('通过按钮获取到用户基础信息', detail);
//       resolve(detail);
//     }
//     // 主动获取用户数据
//     else {
//       uni.getUserInfo({
//         success(detail) {
//           resolve(detail);
//           console.log('用户之前授权过，本次免授权获取用户基础信息', detail);
//         },
//       });
//     }
//   });
// };

// export function getUserInfoFromStorage() {
//   return safeParse(uni.getStorageSync('MH_USERINFO'), {});
// }

// export function setUserInfoToStorage({ userid, nickName, _id }) {
//   uni.setStorageSync('MH_USERINFO', JSON.stringify({ userid, nickName, _id }));
// }

// 注册前先确认下是否已经存在了
// export async function addUser({ db, user = {} }) {
//   const { userid } = user;
//   return new Promise(resolve => {
//     db.collection('user')
//       .where({ userid })
//       .limit(1)
//       .get({
//         success(res) {
//           if (res.data.length) {
//             const userInfo = res.data[0] || {};
//             setUserInfoToStorage(userInfo);
//             console.log('获取到注册用户信息', userInfo);
//             resolve(userInfo);
//           } else {
//             db.collection('user')
//               .add({
//                 data: user,
//               })
//               .then(res => {
//                 resolve(res);
//                 console.log('未获取到注册用户，注册了一个', user);
//                 setUserInfoToStorage(user);
//               })
//               .catch(() => {
//                 resolve({});
//               });
//           }
//         },
//         fail(err) {
//           console.log(err);
//           resolve({});
//         },
//       });
//   });
// }

// export async function updateUser({ db, user = {} }) {
//   const { _id, userid, _openid, ...restUserInfo } = user;
//   return new Promise(resolve => {
//     db.collection('user')
//       .doc(_id)
//       .update({
//         data: restUserInfo,
//         success(res) {
//           resolve(res.data);
//           console.log('更新用户信息成功', res.data);
//           setUserInfoToStorage({ _id, userid, nickName: restUserInfo.nickName });
//         },
//         fail() {},
//       });
//   });
// }

// export async function getOrAddUser({ db, basicUserInfo = {} }) {
//   const userInfo = getUserInfoFromStorage();
//   const { userid, nickName, _id } = userInfo;
//   if (userid) {
//     console.log(111, userid, nickName, basicUserInfo);
//     if (!nickName && basicUserInfo.nickName) {
//       return await updateUser({ db, user: { ...basicUserInfo, _id } });
//     } else {
//       return userInfo;
//     }
//   }
//   // 没有则创建用户
//   else {
//     const userid = await getUserId();
//     return await addUser({ db, user: { userid, ...basicUserInfo } });
//   }
// }

// export function getUserId() {
//   return new Promise(resolve => {
//     wx.login({
//       success(res) {
//         const { code } = res;

//         if (code) {
//           console.log('code', code);
//           uni.request({
//             url: `https://api.thinkdiffs.com/wx?service=doLogin&code=${code}`,
//             data: { code },
//             success: res => {
//               const { userid } = res.data;
//               resolve(userid);
//               console.log(res.data);
//             },
//             fail(err) {
//               console.log(err);
//               resolve('');
//             },
//           });
//         } else {
//           console.log('登录失败！' + res.errMsg);
//           resolve('');
//         }
//       },
//     });
//   });
// }
