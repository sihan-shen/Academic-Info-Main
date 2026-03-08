Page({
  data: {
    hasAnalyzed: false,
    isEditing: false, // 是否处于编辑模式
    analyzedTags: {
      research: [],
      background: []
    }
  },

  onLoad(options) {
    // 检查是否有之前分析过的记录（可选）
    // const analyzed = wx.getStorageSync('hasAnalyzedCV');
    // if (analyzed) {
    //   this.setData({ hasAnalyzed: true });
    // }
  },

  // 模拟上传和分析
  handleUpload() {
    console.log('handleUpload clicked');
    const that = this;
    
    wx.showActionSheet({
      itemList: ['从微信聊天选择文件', '手机文件上传'],
      success: (res) => {
        // 模拟选择文件
        wx.showLoading({
          title: '正在上传...',
        });

        setTimeout(() => {
          wx.hideLoading();
          wx.showLoading({
            title: '智能分析中...',
          });

          // 模拟分析过程
          setTimeout(() => {
            wx.hideLoading();
            
            // 模拟分析出的标签结果
            // 根据"查导师"（研究方向）和"查合作"（学术背景/合作需求）生成
            that.setData({
              hasAnalyzed: true,
              analyzedTags: {
                research: ['人工智能', '深度学习', '计算机视觉'], // 查导师相关
                background: ['硕士', '985/211', '发表过SCI']     // 查合作相关
              }
            });

            wx.showToast({
              title: '分析完成',
              icon: 'success'
            });

            // 保存状态
            // wx.setStorageSync('hasAnalyzedCV', true);
            
          }, 1500); // 1.5秒分析时间

        }, 1000); // 1秒上传时间
      },
      fail: (res) => {
        console.log('ActionSheet failed:', res.errMsg);
      }
    });
  },

  // 切换编辑模式
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  // 删除标签
  deleteTag(e) {
    const { type, index } = e.currentTarget.dataset;
    const { analyzedTags } = this.data;
    
    // 创建新数组以避免直接修改 data
    const newList = [...analyzedTags[type]];
    newList.splice(index, 1);
    
    this.setData({
      [`analyzedTags.${type}`]: newList
    });
  },

  // 添加标签
  addTag(e) {
    const { type } = e.currentTarget.dataset;
    const that = this;
    
    wx.showModal({
      title: '添加标签',
      editable: true,
      placeholderText: '请输入标签内容',
      success(res) {
        if (res.confirm && res.content.trim()) {
          const newTag = res.content.trim();
          const { analyzedTags } = that.data;
          const newList = [...analyzedTags[type], newTag];
          
          that.setData({
            [`analyzedTags.${type}`]: newList
          });
        }
      }
    });
  },

  navigateToCoopMining() {
    if (!this.data.hasAnalyzed) {
      wx.showModal({
        title: '提示',
        content: '请先上传简历',
        showCancel: false,
        confirmText: '去上传',
        success: (res) => {
          if (res.confirm) {
            // Option to trigger upload directly if user confirms
            // this.handleUpload(); 
            // Or just close the modal
          }
        }
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/coop-mining/coop-mining'
    });
  },

  navigateToResearchMatch() {
    if (!this.data.hasAnalyzed) {
      wx.showModal({
        title: '提示',
        content: '请先上传简历',
        showCancel: false,
        confirmText: '去上传',
        success: (res) => {
          if (res.confirm) {
            // this.handleUpload();
          }
        }
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/research-match/research-match'
    });
  }
});
