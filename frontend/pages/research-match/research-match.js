// pages/research-match/research-match.js
const apiConfig = require('../../config/api.js');

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
    tutors: [],
    isLoading: false
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

    this.setData({ isLoading: true });
    wx.showLoading({ title: '匹配中...' });

    // 调用后端真实接口
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/tutor/match`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        subject: this.data.discipline,
        keywords: this.data.keywords,
        prefer_cross_school: this.data.prefs.crossSchool,
        prefer_high_output: this.data.prefs.highOutput,
        prefer_young: this.data.prefs.youngScholar
      },
      success: (res) => {
        wx.hideLoading();
        this.setData({ isLoading: false });

        if (res.data && res.data.success) {
          const tutors = res.data.data.list || [];
          
          // 格式化导师数据
          const formattedTutors = tutors.map(tutor => ({
            id: tutor.id,
            name: tutor.name,
            university: tutor.school || '未知院校',
            department: tutor.department || '未知院系',
            avatar: tutor.avatar || '/images/default-avatar.png',
            title: tutor.title || '教授',
            level: tutor.match_score >= 90 ? '高度适配' : '适配',
            matchScore: tutor.match_score || 85,
            tags: tutor.tags || [],
            papers: tutor.paper_count || 0,
            direction: tutor.direction || '',
            reason: `研究方向${tutor.match_score >= 90 ? '高度' : ''}吻合，在${tutor.direction || '该领域'}有${tutor.paper_count || 0}项相关成果。`
          }));

          this.setData({
            matched: true,
            tutors: formattedTutors
          });

          console.log('[ResearchMatch] 匹配成功:', formattedTutors);
        } else {
          wx.showToast({
            title: res.data.message || '匹配失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({ isLoading: false });
        console.error('[ResearchMatch] 请求失败:', err);
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    });
  },

  // 查看导师详情
  viewTutorDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/tutor-detail/tutor-detail?id=${id}`
    });
  },

  // 收藏导师
  onCollect(e) {
    const id = e.currentTarget.dataset.id;
    const token = wx.getStorageSync('token');
    
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/user/favorite/tutor/${id}`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data && res.data.success) {
          wx.showToast({ title: '已收藏', icon: 'success' });
        } else {
          wx.showToast({ title: res.data.message || '收藏失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  onContact(e) {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});
