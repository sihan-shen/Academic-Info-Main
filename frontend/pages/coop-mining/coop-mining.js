// pages/coop-mining/coop-mining.js
const apiConfig = require('../../config/api.js');

Page({
  data: {
    activeCooperationFields: [],
    potentialProjectCount: 0,
    recommendedProjects: [],
    isLoading: true
  },

  onLoad() {
    console.log('[CoopMining] 页面加载');
    this.loadCoopOverview();
    this.loadRecommendations();
  },

  // 加载合作数据概览
  loadCoopOverview() {
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/coop/stats/overview`,
      method: 'GET',
      success: (res) => {
        console.log('[CoopMining] 概览接口返回:', res.data);
        if (res.data && res.data.success) {
          const data = res.data.data;
          const activeFields = (data.activeFields || []).map(field => field.name);
          
          this.setData({
            activeCooperationFields: activeFields.slice(0, 3),
            potentialProjectCount: data.potentialProjectCount || 0,
            isLoading: false
          });
          
          console.log('[CoopMining] 设置数据:', {
            activeCooperationFields: activeFields.slice(0, 3),
            potentialProjectCount: data.potentialProjectCount || 0
          });
        }
      },
      fail: (err) => {
        console.error('[CoopMining] 加载概览失败:', err);
        this.setData({ isLoading: false });
      }
    });
  },

  // 加载推荐项目
  loadRecommendations() {
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/coop/recommendations?limit=10`,
      method: 'GET',
      success: (res) => {
        console.log('[CoopMining] 推荐接口返回:', res.data);
        if (res.data && res.data.success) {
          const projects = res.data.data.list || [];
          this.setData({
            recommendedProjects: projects
          });
          console.log('[CoopMining] 设置推荐项目:', projects.length);
        }
      },
      fail: (err) => {
        console.error('[CoopMining] 加载推荐失败:', err);
      }
    });
  },

  // 查看项目详情
  navigateToProjectDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coop-detail/coop-detail?id=${id}`
    });
  },

  // 跳转到潜在合作项目列表
  navigateToOpportunities() {
    wx.navigateTo({
      url: '/pages/coop-opportunities/coop-opportunities'
    });
  }
});
