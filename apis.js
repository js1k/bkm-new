// const db = wx.cloud.database();

export const addUser = () => {
  wx.cloud
    .callFunction({
      name: 'addUser',
    })
    .then(res => {
      console.log(111111, res);
    });
};

export const checkText = (text, options) => {
  const { errMsg = '内容中包含敏感词，请重新输入' } = options || {};
  uni.showLoading({ title: '' });
  return new Promise(resolve => {
    wx.cloud
      .callFunction({
        name: 'checkText',
        data: { text },
      })
      .then(res => {
        uni.hideLoading();
        console.log('文件检测', res);
        if (+res.result.errCode === 0) {
          resolve(true);
        } else {
          uni.showModal({ content: errMsg, showCancel: false });
          resolve(false);
        }
      })
      .catch(err => {
        console.log('文件检测 err', err);
        resolve(true);
        uni.hideLoading();
      });
  });
};
