// pages/login/login.js
const app = getApp();

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
   * 模拟一键登录
   * 纯前端模拟，跳过微信授权弹窗，直接使用模拟数据登录
   */
  async onBypassLogin() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    try {
      // 1. 模拟网络请求延迟 (1秒)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. 模拟获取到的微信用户信息
      // 使用微信默认头像和随机昵称，模拟“已连接微信账号”
      const mockUserInfo = {
        userId: 'user_' + Date.now(),
        nickName: '微信用户_' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 微信默认头像
        phone: '138****8888',
        token: 'mock_token_' + Date.now()
      };

      console.log('模拟登录成功，用户信息:', mockUserInfo);

      // 3. 保存登录状态
      wx.setStorageSync('isLoggedIn', true);
      wx.setStorageSync('userInfo', mockUserInfo);
      
      // 更新全局状态
      if (app.globalData) {
        app.globalData.userInfo = mockUserInfo;
      }

      wx.hideLoading();
      wx.showToast({ title: '登录成功', icon: 'success' });

      // 4. 跳转逻辑
      setTimeout(() => {
        // 直接跳转到兴趣选择页面
        wx.reLaunch({
          url: '/pages/interest-selection/interest-selection'
        });
      }, 1000);

    } catch (error) {
      console.error('登录失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  /**
   * 微信一键登录（保留代码，暂不使用）
   */
  async onGetPhoneNumber(e) {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    if (e.detail.errMsg === "getPhoneNumber:ok") {
      wx.showLoading({ title: '登录中...' });

      try {
        // 1. 获取登录凭证 code
        const loginRes = await wx.login();
        if (!loginRes.code) {
          throw new Error('登录失败，请重试');
        }

        // 2. 获取手机号加密数据
        const { encryptedData, iv } = e.detail;

        // 3. TODO: 发送 code, encryptedData, iv 到后端进行解密和登录
        // const result = await request.post('/api/login/wechat', {
        //   code: loginRes.code,
        //   encryptedData,
        //   iv
        // });

        // 模拟后端请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟登录成功
        const mockUserInfo = {
          userId: 'user_' + Date.now(),
          nickname: '微信用户',
          avatarUrl: '/images/default-avatar.png',
          phone: '138****8888',
          token: 'mock_token_' + Date.now()
        };

        // 4. 保存登录状态
        wx.setStorageSync('isLoggedIn', true);
        wx.setStorageSync('userInfo', mockUserInfo);
        
        // 更新全局状态
        if (app.globalData) {
          app.globalData.userInfo = mockUserInfo;
        }

        wx.hideLoading();
        wx.showToast({ title: '登录成功', icon: 'success' });

        // 5. 跳转回原页面
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
        }, 1000);

      } catch (error) {
        console.error('登录失败:', error);
        wx.hideLoading();
        wx.showToast({ 
          title: error.message || '登录失败，请重试', 
          icon: 'none' 
        });
      }
    } else {
      // 用户拒绝授权
      console.log('用户拒绝授权手机号');
      wx.showToast({ title: '需要授权手机号才能登录', icon: 'none' });
    }
  },

  onSmsLogin() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onForgotPassword() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
})
