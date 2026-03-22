// pages/edit-profile/edit-profile.js
Page({
  data: {
    userInfo: {
      avatar: '',
      name: '学术研究者',
      phone: '138****5678',
      gender: '男',
      academicStatus: '硕士研究生',
      signature: '这位学者很懒，什么都没留下',
      institution: '',
      tutor: '',
      achievement: '这位学者很懒，什么都没留下'
    },
    showModal: false,
    currentField: {
      key: '',
      label: '',
      value: '',
      type: 'input', // input, textarea, picker
      options: [],
      maxlength: 50
    }
  },

  onLoad() {
    // 从本地存储加载用户信息
    this.loadUserInfo();
  },

  // 从本地存储加载用户信息
  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo: userInfo
        });
      }
    } catch (e) {
      console.error('加载用户信息失败:', e);
    }
  },

  // 编辑头像
  onEditAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'userInfo.avatar': tempFilePath
        });
        
        // 保存到本地存储
        this.saveToStorage();
        
        wx.showToast({
          title: '头像已更新',
          icon: 'success'
        });
      }
    });
  },

  // 编辑姓名
  onEditName() {
    this.openEditModal({
      key: 'name',
      label: '姓名',
      value: this.data.userInfo.name,
      type: 'input',
      maxlength: 20
    });
  },

  // 编辑手机号
  onEditPhone() {
    this.openEditModal({
      key: 'phone',
      label: '手机号',
      value: this.data.userInfo.phone,
      type: 'input',
      maxlength: 11
    });
  },

  // 编辑性别
  onEditGender() {
    this.openEditModal({
      key: 'gender',
      label: '性别',
      value: this.data.userInfo.gender,
      type: 'picker',
      options: ['男', '女', '保密']
    });
  },

  // 编辑学术状态
  onEditAcademicStatus() {
    this.openEditModal({
      key: 'academicStatus',
      label: '学术状态',
      value: this.data.userInfo.academicStatus,
      type: 'picker',
      options: ['本科生', '硕士研究生', '博士研究生', '博士后', '助理教授', '副教授', '教授', '研究员']
    });
  },

  // 编辑个性签名
  onEditSignature() {
    this.openEditModal({
      key: 'signature',
      label: '个性签名',
      value: this.data.userInfo.signature,
      type: 'textarea',
      maxlength: 100
    });
  },

  // 编辑所属机构
  onEditInstitution() {
    this.openEditModal({
      key: 'institution',
      label: '所属机构',
      value: this.data.userInfo.institution,
      type: 'input',
      maxlength: 50
    });
  },

  // 编辑当前导师
  onEditTutor() {
    this.openEditModal({
      key: 'tutor',
      label: '当前导师',
      value: this.data.userInfo.tutor,
      type: 'input',
      maxlength: 20
    });
  },

  // 编辑学术成就
  onEditAchievement() {
    this.openEditModal({
      key: 'achievement',
      label: '学术成就',
      value: this.data.userInfo.achievement,
      type: 'textarea',
      maxlength: 200
    });
  },

  // 打开编辑弹窗
  openEditModal(field) {
    this.setData({
      currentField: field,
      showModal: true
    });
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({
      showModal: false
    });
  },

  // 输入内容变化
  onInputChange(e) {
    this.setData({
      'currentField.value': e.detail.value
    });
  },

  // 选择器选择
  onPickerSelect(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      'currentField.value': value
    });
  },

  // 确认编辑
  onConfirmEdit() {
    const { key, value, label } = this.data.currentField;
    
    // 验证手机号
    if (key === 'phone') {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(value)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        });
        return;
      }
    }

    // 验证姓名
    if (key === 'name' && !value.trim()) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      });
      return;
    }

    // 更新数据
    this.setData({
      [`userInfo.${key}`]: value,
      showModal: false
    });

    // 保存到本地存储
    this.saveToStorage();

    wx.showToast({
      title: `${label}已更新`,
      icon: 'success'
    });

    // TODO: 这里可以调用API保存到服务器
    // this.saveUserInfo();
  },

  // 保存到本地存储
  saveToStorage() {
    try {
      wx.setStorageSync('userInfo', this.data.userInfo);
      console.log('用户信息已保存到本地');
    } catch (e) {
      console.error('保存用户信息失败:', e);
    }
  },

  // 保存用户信息到服务器
  saveUserInfo() {
    // 示例API调用
    // wx.request({
    //   url: 'your-api-endpoint',
    //   method: 'POST',
    //   data: this.data.userInfo,
    //   success: (res) => {
    //     console.log('保存成功', res);
    //   }
    // });
  },

  // 阻止滚动穿透
  preventDefault() {
    return false;
  }
})
