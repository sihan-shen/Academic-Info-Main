// app.js

const authUtil = require('./utils/auth.js');

/**
 * 小程序应用入口
 */
App({
  /**
   * 小程序初始化完成时触发
   */
  onLaunch(options) {
    console.log('小程序启动', options);
    this.initApp();
    this.checkLoginStatus();
  },

  /**
   * 小程序显示时触发
   */
  onShow(options) {
    console.log('小程序显示', options);
  },

  /**
   * 小程序隐藏时触发
   */
  onHide() {
    console.log('小程序隐藏');
  },

  /**
   * 小程序错误处理
   */
  onError(msg) {
    console.error('小程序错误:', msg);
    // 避免频繁弹出错误提示
    if (!this._errorToastTimer) {
    wx.showToast({
      title: '程序异常，请稍后重试',
      icon: 'none',
      duration: 2000
    });
      // 3秒内不重复显示错误提示
      this._errorToastTimer = setTimeout(() => {
        this._errorToastTimer = null;
      }, 3000);
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const isLoggedIn = authUtil.isLoggedIn();
    const isGuest = authUtil.isGuestMode();
    
    console.log('登录状态检查:', { isLoggedIn, isGuest });
    
    // 如果既未登录也不是游客模式，跳转到登录页
    if (!isLoggedIn && !isGuest) {
      console.log('未登录，跳转到登录页');
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }, 500);
    }
  },

  /**
   * 初始化应用
   */
  initApp() {
    // 初始化错误提示定时器
    this._errorToastTimer = null;
    
    // 检查更新
    this.checkUpdate();
    
    // 初始化用户信息
    this.initUserInfo();
    
    // 记录启动日志（可选，生产环境可移除）
    if (this.globalData.debug) {
      this.logLaunch();
    }
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (!wx.canIUse('getUpdateManager')) {
      console.warn('当前微信版本过低，无法使用更新功能');
      return;
    }

    try {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          confirmText: '立即更新',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          },
          fail: (err) => {
            console.error('显示更新弹窗失败:', err);
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败');
        wx.showToast({
          title: '更新失败，请稍后重试',
          icon: 'none',
          duration: 2000
        });
      });
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    try {
      // 从本地存储获取用户信息
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  },

  /**
   * 记录启动日志（开发调试用）
   */
  logLaunch() {
    try {
      const logs = wx.getStorageSync('logs') || [];
      logs.unshift(Date.now());
      // 只保留最近50条日志
      if (logs.length > 50) {
        logs.splice(50);
      }
      wx.setStorageSync('logs', logs);
    } catch (error) {
      console.error('记录日志失败:', error);
    }
  },

  /**
   * 用户登录
   */
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 这里应该将 res.code 发送到后台换取 openId, sessionKey, unionId
            console.log('登录成功，code:', res.code);
            resolve(res);
          } else {
            reject(new Error('登录失败'));
          }
        },
        fail: (error) => {
          console.error('登录失败:', error);
          reject(error);
        }
      });
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (!wx.getUserProfile) {
        reject(new Error('当前微信版本过低，无法使用getUserProfile'));
        return;
      }

      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          this.globalData.userInfo = res.userInfo;
          // 保存到本地存储
          try {
            wx.setStorageSync('userInfo', res.userInfo);
          } catch (error) {
            console.error('保存用户信息失败:', error);
            // 存储失败不影响返回用户信息
          }
          resolve(res.userInfo);
        },
        fail: (error) => {
          console.error('获取用户信息失败:', error);
          reject(error);
        }
      });
    });
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    debug: false // 开发模式开关
  }
})
