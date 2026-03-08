// pages/permission-guide/permission-guide.js
Page({
  data: {
    permissionType: '',
    permissionName: '',
    permissionIcon: '',
    permissionReason: '',
    permissionScopes: []
  },

  onLoad(options) {
    const type = options.type || 'microphone';
    this.initPermissionData(type);
  },

  /**
   * 初始化权限数据
   */
  initPermissionData(type) {
    const permissionConfig = {
      microphone: {
        name: '麦克风权限',
        icon: '🎙️',
        reason: '麦克风权限用于语音输入和语音搜索功能，帮助您更便捷地使用导师查询服务。',
        scopes: [
          '语音输入搜索关键词',
          '语音记录备忘和笔记',
          '与导师进行语音交流',
          '使用语音识别功能'
        ]
      },
      camera: {
        name: '相机权限',
        icon: '📷',
        reason: '相机权限用于拍摄照片、扫描二维码等功能，让您可以快速分享和记录信息。',
        scopes: [
          '拍摄个人资料照片',
          '扫描导师名片二维码',
          '拍照记录学术资料',
          '使用AR识别功能'
        ]
      },
      album: {
        name: '相册权限',
        icon: '🖼️',
        reason: '相册权限用于上传图片和保存图片功能，方便您管理和分享学术资料。',
        scopes: [
          '上传个人头像照片',
          '保存导师联系方式',
          '分享学术成果图片',
          '导出数据为图片'
        ]
      },
      location: {
        name: '位置权限',
        icon: '📍',
        reason: '位置权限用于获取您的地理位置，为您推荐附近的导师和学术机构。',
        scopes: [
          '查找附近的导师',
          '推荐本地学术活动',
          '显示机构地理位置',
          '计算距离和导航'
        ]
      },
      notification: {
        name: '通知权限',
        icon: '🔔',
        reason: '通知权限用于及时推送重要消息和提醒，让您不错过任何重要信息。',
        scopes: [
          '接收导师回复通知',
          '获取系统重要提醒',
          '提醒待办事项',
          '推送学术资讯'
        ]
      }
    };

    const config = permissionConfig[type] || permissionConfig.microphone;
    
    this.setData({
      permissionType: type,
      permissionName: config.name,
      permissionIcon: config.icon,
      permissionReason: config.reason,
      permissionScopes: config.scopes
    });
  },

  /**
   * 前往设置
   */
  onConfirm() {
    wx.showLoading({
      title: '打开设置中...',
      mask: true
    });

    setTimeout(() => {
      wx.hideLoading();
      
      wx.openSetting({
        success: (res) => {
          console.log('打开系统设置成功:', res);
          
          // 检查权限是否已授权
          this.checkPermissionStatus(res.authSetting);
        },
        fail: (err) => {
          console.error('打开系统设置失败:', err);
          wx.showToast({
            title: '打开设置失败，请稍后重试',
            icon: 'none',
            duration: 2000
          });
        },
        complete: () => {
          // 用户从设置页面返回后，返回上一页
          setTimeout(() => {
            wx.navigateBack({
              fail: () => {
                // 如果返回失败，跳转到隐私设置页面
                wx.redirectTo({
                  url: '/pages/privacy/privacy'
                });
              }
            });
          }, 500);
        }
      });
    }, 300);
  },

  /**
   * 检查权限状态
   */
  checkPermissionStatus(authSetting) {
    const scopeMap = {
      microphone: 'scope.record',
      camera: 'scope.camera',
      album: 'scope.album',
      location: 'scope.userLocation',
      notification: 'scope.notificationAlertWXWork'
    };

    const scope = scopeMap[this.data.permissionType];
    
    if (authSetting[scope]) {
      wx.showToast({
        title: '权限已开启',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '您可以随时在设置中开启',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 暂不开启
   */
  onCancel() {
    wx.showModal({
      title: '提示',
      content: '暂不开启权限可能会影响部分功能的使用，您可以随时在设置中开启。',
      confirmText: '我知道了',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack({
            fail: () => {
              wx.redirectTo({
                url: '/pages/privacy/privacy'
              });
            }
          });
        }
      }
    });
  }
});
