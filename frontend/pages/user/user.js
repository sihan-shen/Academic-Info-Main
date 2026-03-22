// pages/user/user.js

const authUtil = require('../../utils/auth.js');

Page({
  data: {
    userInfo: {
      name: '学术研究者',
      phone: '138****5678',
      role: '硕士研究生',
      bio: '这位学者很懒，什么都没留下~',
      vipStatus: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('用户页面加载');
    // 加载用户信息
    this.loadUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('用户页面显示');
    // 每次显示时刷新用户信息
    this.loadUserInfo();
  },

  /**
   * 从本地存储加载用户信息
   */
  loadUserInfo() {
    try {
      const editUserInfo = wx.getStorageSync('userInfo');
      if (editUserInfo) {
        // 将编辑页面的数据格式转换为用户页面格式
        this.setData({
          userInfo: {
            name: editUserInfo.name || '学术研究者',
            phone: editUserInfo.phone || '138****5678',
            role: editUserInfo.academicStatus || '硕士研究生',
            bio: editUserInfo.signature || '这位学者很懒，什么都没留下~',
            vipStatus: editUserInfo.vipStatus || false,
            avatar: editUserInfo.avatar || '',
            gender: editUserInfo.gender || '男',
            institution: editUserInfo.institution || '',
            tutor: editUserInfo.tutor || '',
            achievement: editUserInfo.achievement || ''
          }
        });
        console.log('用户信息已更新:', this.data.userInfo);
      }
    } catch (e) {
      console.error('加载用户信息失败:', e);
    }
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 使用auth工具退出登录
          authUtil.logout();
        }
      },
      fail: (err) => {
        console.error('显示退出确认框失败:', err);
      }
    });
  },

  /**
   * 导航到编辑资料页面
   */
  navigateToEditProfile() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile',
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 导航到帮助中心
   */
  navigateToHelp() {
    wx.navigateTo({
      url: '/pages/help/help',
      fail: (err) => {
        console.error('跳转失败:', err);
      }
    });
  },

  /**
   * 导航到客服中心
   */
  navigateToService() {
    wx.navigateTo({
      url: '/pages/service/service',
      fail: (err) => {
        console.error('跳转失败:', err);
      }
    });
  },

  /**
   * 导航到隐私设置
   */
  navigateToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy',
      fail: (err) => {
        console.error('跳转失败:', err);
      }
    });
  },

  /**
   * 导航到VIP页面
   */
  navigateToVip() {
    wx.navigateTo({
      url: '/pages/vip/vip',
      fail: (err) => {
        console.error('跳转失败:', err);
      }
    });
  },

  /**
   * 导航到收藏页面
   */
  navigateToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites',
      fail: (err) => {
        console.error('跳转失败:', err);
      }
    });
  }
})
