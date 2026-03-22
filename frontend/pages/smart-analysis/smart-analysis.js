// pages/smart-analysis/smart-analysis.js - 智能分析主页
Page({
  data: {
    hasAnalyzed: false,
    isEditing: false,
    analyzedTags: {
      research: ['人工智能', '深度学习', '计算机视觉'],
      background: ['计算机科学', '清华大学']
    }
  },

  onLoad() {
    // 页面加载时的逻辑
    console.log('[SmartAnalysis] 页面加载');
  },

  // 处理简历上传
  handleUpload() {
    console.log('[SmartAnalysis] 点击上传');
    
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf', 'doc', 'docx'],
      success: (res) => {
        const file = res.tempFiles[0];
        console.log('[SmartAnalysis] 上传文件:', file);
        
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 2000
        });
        
        // 模拟分析完成
        this.setData({
          hasAnalyzed: true
        });
      },
      fail: (err) => {
        console.log('[SmartAnalysis] 上传失败或取消:', err);
      }
    });
  },

  // 切换编辑状态
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  // 删除标签
  deleteTag(e) {
    const { type, index } = e.currentTarget.dataset;
    const key = `analyzedTags.${type}`;
    const tags = this.data.analyzedTags[type];
    
    tags.splice(index, 1);
    this.setData({
      [key]: tags
    });
  },

  // 添加标签
  addTag(e) {
    const { type } = e.currentTarget.dataset;
    wx.showModal({
      title: '添加标签',
      content: '',
      editable: true,
      placeholderText: '请输入标签内容',
      success: (res) => {
        if (res.confirm && res.content) {
          const key = `analyzedTags.${type}`;
          const tags = this.data.analyzedTags[type];
          tags.push(res.content);
          this.setData({
            [key]: tags
          });
        }
      }
    });
  },

  // 跳转到社工模型页面
  navigateToCoopMining() {
    console.log('[SmartAnalysis] 点击社工模型');
    
    // 直接进入，不做限制
    wx.navigateTo({
      url: '/pages/coop-mining/coop-mining',
      success: () => {
        console.log('[SmartAnalysis] 跳转社工模型成功');
      },
      fail: (err) => {
        console.error('[SmartAnalysis] 跳转社工模型失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 跳转到智能导师匹配页面
  navigateToResearchMatch() {
    console.log('[SmartAnalysis] 点击智能推导师');
    
    // 直接进入，不做限制
    wx.navigateTo({
      url: '/pages/research-match/research-match',
      success: () => {
        console.log('[SmartAnalysis] 跳转智能推导师成功');
      },
      fail: (err) => {
        console.error('[SmartAnalysis] 跳转智能推导师失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
