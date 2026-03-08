/**
 * 登录状态管理工具
 */

/**
 * 检查是否已登录
 */
function isLoggedIn() {
  try {
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    return isLoggedIn === true;
  } catch (e) {
    return false;
  }
}

/**
 * 检查是否是游客模式
 */
function isGuestMode() {
  try {
    const isGuest = wx.getStorageSync('isGuestMode');
    return isGuest === true;
  } catch (e) {
    return false;
  }
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  try {
    return wx.getStorageSync('userInfo') || null;
  } catch (e) {
    return null;
  }
}

/**
 * 检查登录状态，未登录则跳转登录页
 * @param {String} currentPage 当前页面路径，用于登录后返回
 * @returns {Boolean} 是否已登录
 */
function checkLogin(currentPage) {
  const loggedIn = isLoggedIn();
  
  if (!loggedIn) {
    // 未登录，跳转到登录页
    wx.showModal({
      title: '需要登录',
      content: '此功能需要登录后才能使用',
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          const redirectUrl = currentPage || '/pages/index/index';
          wx.navigateTo({
            url: `/pages/login/login?redirect=${redirectUrl}`
          });
        }
      }
    });
    return false;
  }
  
  return true;
}

/**
 * 退出登录
 */
function logout() {
  try {
    wx.removeStorageSync('isLoggedIn');
    wx.removeStorageSync('isGuestMode');
    wx.removeStorageSync('userInfo');
    
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    });
    
    // 跳转到登录页
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }, 500);
  } catch (e) {
    console.error('退出登录失败:', e);
  }
}

/**
 * 设置登录状态
 */
function setLoginStatus(isLoggedIn, userInfo) {
  try {
    wx.setStorageSync('isLoggedIn', isLoggedIn);
    wx.setStorageSync('userInfo', userInfo);
    
    if (isLoggedIn) {
      wx.removeStorageSync('isGuestMode');
    }
  } catch (e) {
    console.error('设置登录状态失败:', e);
  }
}

module.exports = {
  isLoggedIn,
  isGuestMode,
  getUserInfo,
  checkLogin,
  logout,
  setLoginStatus
};
