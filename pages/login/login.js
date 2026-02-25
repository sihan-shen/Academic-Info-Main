// pages/login/login.js
Page({
  data: {
    account: '',
    password: '',
    agreed: false
  },

  onLoad(options) {
    // 记录从哪个页面跳转过来的
    this.redirectUrl = options.redirect || '/pages/index/index';
  },

  onAccountInput(e) {
    this.setData({ account: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onAgreementChange(e) {
    this.setData({ agreed: e.detail.value.length > 0 });
  },

  onLogin() {
    if (!this.data.account) {
      wx.showToast({ title: '请输入账号', icon: 'none' });
      return;
    }
    if (!this.data.password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    // 模拟登录
    wx.showLoading({ title: '登录中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存登录状态和用户信息
      wx.setStorageSync('isLoggedIn', true);
      wx.setStorageSync('userInfo', {
        account: this.data.account,
        isGuest: false,
        loginTime: new Date().getTime()
      });
      
      wx.showToast({ title: '登录成功', icon: 'success' });
      
      // 跳转回原页面或首页
      setTimeout(() => {
        if (this.redirectUrl.includes('index')) {
          wx.switchTab({ url: this.redirectUrl });
        } else {
          wx.redirectTo({ 
            url: this.redirectUrl,
            fail: () => {
              wx.switchTab({ url: '/pages/index/index' });
            }
          });
        }
      }, 500);
    }, 1500);
  },

  /**
   * 游客模式
   */
  onGuestMode() {
    wx.showModal({
      title: '游客模式',
      content: '游客模式下可以浏览内容，但使用功能时需要登录。是否继续？',
      confirmText: '继续',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 设置游客模式
          wx.setStorageSync('isLoggedIn', false);
          wx.setStorageSync('isGuestMode', true);
          wx.setStorageSync('userInfo', {
            account: '游客',
            isGuest: true,
            loginTime: new Date().getTime()
          });
          
          wx.showToast({
            title: '已进入游客模式',
            icon: 'success'
          });
          
          // 跳转到首页
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' });
          }, 500);
        }
      }
    });
  },

  onSmsLogin() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onForgotPassword() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onWeChatLogin() {
    wx.showToast({ title: '微信登录开发中', icon: 'none' });
  },

  onQQLogin() {
    wx.showToast({ title: 'QQ登录开发中', icon: 'none' });
  }
})
