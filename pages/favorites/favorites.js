// pages/favorites/favorites.js
const { FavoriteManager } = require('../../utils/storage.js');

Page({
  data: {
    activeTab: 0,
    tutorList: [
      {
        id: 1,
        name: '张明华',
        avatar: '/images/tutor-zhang.png',
        school: '清华大学',
        department: '计算机科学与技术系',
        direction: '人工智能',
        date: '2026-02-08'
      },
      {
        id: 2,
        name: '李晓芳',
        avatar: '/images/tutor-li.png',
        school: '北京大学',
        department: '信息科学技术学院',
        direction: '机器学习',
        date: '2026-02-07'
      }
    ],
    projectList: []
  },

  onLoad() {
    this.loadFavoriteProjects();
  },

  onShow() {
    // 每次显示页面时重新加载收藏的项目
    this.loadFavoriteProjects();
  },

  // 加载收藏的项目
  loadFavoriteProjects() {
    const projects = FavoriteManager.getFavoriteProjects();
    
    // 格式化项目数据用于显示
    const formattedProjects = projects.map(item => {
      // 格式化日期
      const date = item.favoriteDate ? new Date(item.favoriteDate) : new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      return {
        id: item.id,
        title: item.title,
        leader: item.partner || '未知',
        progress: this.calculateProgress(item),
        date: formattedDate,
        tags: item.tags || [],
        budget: item.budget,
        successRate: item.successRate
      };
    });

    this.setData({
      projectList: formattedProjects
    });
  },

  // 计算项目进度（基于收藏时间和成功率）
  calculateProgress(item) {
    if (item.successRate) {
      // 如果有成功率，使用成功率
      const rate = parseInt(item.successRate);
      return isNaN(rate) ? 50 : rate;
    }
    // 默认返回50%
    return 50;
  },

  onTabClick(e) {
    this.setData({ activeTab: parseInt(e.currentTarget.dataset.index) });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/tutor-detail/tutor-detail?id=${id}`
    });
  },

  // 跳转到项目详情
  navigateToProjectDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coop-detail/coop-detail?id=${id}`
    });
  }
})