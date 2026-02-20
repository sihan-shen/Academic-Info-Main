// pages/user/user.js
Page({
  data: {

  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  navigateToEditProfile() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    });
  },

  navigateToHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },

  navigateToService() {
    wx.navigateTo({
      url: '/pages/service/service'
    });
  },

  navigateToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },

  navigateToVip() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    });
  },

  navigateToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  }
})
