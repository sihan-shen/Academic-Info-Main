// pages/privacy/privacy.js
Page({
  data: {
    // 个性化推荐开关
    personalizeEnabled: true,
    
    // 权限状态
    microphoneStatus: '未授权',
    cameraStatus: '未授权',
    albumStatus: '未授权',
    locationStatus: '未授权',
    notificationStatus: '未授权',
    
    // 其他数据
    blacklistCount: 0,
    cacheSize: '12.5MB',
    version: '1.0.0'
  },

  onLoad() {
    this.checkPermissions();
    this.loadBlacklistCount();
    this.calculateCacheSize();
  },

  onShow() {
    // 每次显示页面时更新权限状态
    this.checkPermissions();
  },

  /**
   * 检查所有权限状态
   */
  checkPermissions() {
    wx.getSetting({
      success: (res) => {
        console.log('权限设置:', res.authSetting);
        
        this.setData({
          microphoneStatus: res.authSetting['scope.record'] ? '已授权' : '未授权',
          cameraStatus: res.authSetting['scope.camera'] ? '已授权' : '未授权',
          albumStatus: res.authSetting['scope.album'] || res.authSetting['scope.writePhotosAlbum'] ? '已授权' : '未授权',
          locationStatus: res.authSetting['scope.userLocation'] ? '已授权' : '未授权',
          notificationStatus: res.authSetting['scope.notificationAlertWXWork'] ? '已授权' : '未授权'
        });
      },
      fail: (err) => {
        console.error('获取权限状态失败:', err);
      }
    });
  },

  /**
   * 加载黑名单数量
   */
  loadBlacklistCount() {
    try {
      const blacklist = wx.getStorageSync('blacklist') || [];
      this.setData({
        blacklistCount: blacklist.length
      });
    } catch (e) {
      console.error('加载黑名单失败:', e);
    }
  },

  /**
   * 计算缓存大小
   */
  calculateCacheSize() {
    // 这里可以实现实际的缓存计算逻辑
    // 暂时使用模拟数据
    this.setData({
      cacheSize: '12.5MB'
    });
  },

  /**
   * 个性化推荐开关
   */
  onPersonalizeClick() {
    // 点击整行也可以触发
  },

  onPersonalizeChange(e) {
    const enabled = e.detail.value;
    this.setData({
      personalizeEnabled: enabled
    });
    
    // 保存到本地存储
    wx.setStorageSync('personalizeEnabled', enabled);
    
    wx.showToast({
      title: enabled ? '已开启个性化推荐' : '已关闭个性化推荐',
      icon: 'success'
    });
  },

  /**
   * 麦克风权限
   */
  onMicrophoneClick() {
    wx.navigateTo({
      url: '/pages/permission-guide/permission-guide?type=microphone',
      fail: () => {
        this.openSystemSetting();
      }
    });
  },

  /**
   * 相机权限
   */
  onCameraClick() {
    wx.navigateTo({
      url: '/pages/permission-guide/permission-guide?type=camera',
      fail: () => {
        this.openSystemSetting();
      }
    });
  },

  /**
   * 相册权限
   */
  onAlbumClick() {
    wx.navigateTo({
      url: '/pages/permission-guide/permission-guide?type=album',
      fail: () => {
        this.openSystemSetting();
      }
    });
  },

  /**
   * 位置权限
   */
  onLocationClick() {
    wx.navigateTo({
      url: '/pages/permission-guide/permission-guide?type=location',
      fail: () => {
        this.openSystemSetting();
      }
    });
  },

  /**
   * 通知权限
   */
  onNotificationClick() {
    wx.navigateTo({
      url: '/pages/permission-guide/permission-guide?type=notification',
      fail: () => {
        this.openSystemSetting();
      }
    });
  },

  /**
   * 更多权限
   */
  onMorePermissionClick() {
    this.openSystemSetting();
  },

  /**
   * 请求权限的通用方法
   */
  requestPermission(scope, name) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting[scope]) {
          // 已授权，提示去系统设置修改
          wx.showModal({
            title: `${name}权限`,
            content: `您已授权${name}权限，如需修改请前往系统设置`,
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.openSystemSetting();
              }
            }
          });
        } else if (res.authSetting[scope] === false) {
          // 已拒绝，引导去设置
          wx.showModal({
            title: `${name}权限`,
            content: `您已拒绝${name}权限，如需使用请前往系统设置开启`,
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.openSystemSetting();
              }
            }
          });
        } else {
          // 未授权，引导去设置
          wx.showModal({
            title: `${name}权限`,
            content: `使用${name}功能需要您的授权，请前往系统设置开启`,
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.openSystemSetting();
              }
            }
          });
        }
      }
    });
  },

  /**
   * 打开系统设置
   */
  openSystemSetting() {
    wx.openSetting({
      success: (res) => {
        console.log('打开系统设置成功:', res);
        // 设置完成后重新检查权限
        setTimeout(() => {
          this.checkPermissions();
        }, 500);
      },
      fail: (err) => {
        console.error('打开系统设置失败:', err);
        wx.showToast({
          title: '打开设置失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 账号安全
   */
  onAccountSecurityClick() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 隐私政策
   */
  onPrivacyPolicyClick() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/privacy&title=隐私政策',
      fail: () => {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 用户协议
   */
  onUserAgreementClick() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/agreement&title=用户协议',
      fail: () => {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 黑名单
   */
  onBlacklistClick() {
    wx.navigateTo({
      url: '/pages/blacklist/blacklist',
      fail: () => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 清除缓存
   */
  onClearCacheClick() {
    wx.showModal({
      title: '清除缓存',
      content: `确定要清除 ${this.data.cacheSize} 的缓存数据吗？`,
      confirmText: '清除',
      confirmColor: '#e04343',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清除中...',
            mask: true
          });

          // 清除缓存
          wx.clearStorage({
            success: () => {
              wx.hideLoading();
              this.setData({
                cacheSize: '0MB'
              });
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({
                title: '清除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 关于
   */
  onAboutClick() {
    wx.navigateTo({
      url: '/pages/about/about',
      fail: () => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  }
});
