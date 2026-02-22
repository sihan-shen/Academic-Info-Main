Page({
  data: {
    discipline: '',
    keywords: '',
    prefs: {
      crossSchool: false,
      highOutput: false,
      youngScholar: false
    },
    matched: false,
    tutors: []
  },

  onFieldInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },

  togglePref(e) {
    const key = e.currentTarget.dataset.key;
    const path = `prefs.${key}`;
    this.setData({ [path]: !this.data.prefs[key] });
  },

  onMatch() {
    if (!this.data.discipline.trim()) {
      wx.showToast({ title: '请输入学科方向', icon: 'none' });
      return;
    }
    if (!this.data.keywords.trim()) {
      wx.showToast({ title: '请输入研究兴趣关键词', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '匹配中...' });

    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        matched: true,
        tutors: [
          {
            id: 1,
            name: '张明华',
            university: '清华大学',
            department: '计算机科学与技术系',
            avatar: '/images/default-avatar.png',
            level: '高度适配',
            tags: ['人工智能', '国家级项目', '博士生导师'],
            papers: 58,
            reason: '研究方向高度吻合，近5年发表相关主题高影响力论文15篇。'
          },
          {
            id: 2,
            name: '李晓芳',
            university: '北京大学',
            department: '信息科学技术学院',
            avatar: '/images/default-avatar.png',
            level: '适配',
            tags: ['机器学习', '国家杰青', '博士生导师'],
            papers: 42,
            reason: '学术背景匹配，在自然语言处理领域有深厚积累。'
          },
          {
            id: 3,
            name: '王建国',
            university: '浙江大学',
            department: '控制科学与工程学院',
            avatar: '/images/default-avatar.png',
            level: '适配',
            tags: ['智能控制', '长江学者', '博士生导师'],
            papers: 36,
            reason: '跨学科合作潜力大，实验室资源丰富。'
          }
        ]
      });
    }, 800);
  },

  onCollect(e) {
    wx.showToast({ title: '已收藏', icon: 'success' });
  },

  onContact(e) {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});
