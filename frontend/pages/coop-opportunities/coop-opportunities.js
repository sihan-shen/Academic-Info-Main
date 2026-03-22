// pages/coop-opportunities/coop-opportunities.js

const apiConfig = require('../../config/api.js');

Page({
  data: {
    filterType: 'all',
    allProjects: [],
    displayList: [],
    isLoading: false,
    page: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad(options) {
    // 从后端加载真实数据
    this.loadCoopList(true);
  },

  // 从后端加载合作项目列表
  loadCoopList(isRefresh = false) {
    if (isRefresh) {
      this.setData({
        page: 1,
        hasMore: true,
        allProjects: []
      });
    }

    if (this.data.isLoading || (!isRefresh && !this.data.hasMore)) {
      return;
    }

    this.setData({ isLoading: true });

    const { page, pageSize, filterType } = this.data;
    
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/coop/list`,
      method: 'GET',
      data: {
        page: page,
        page_size: pageSize,
        type: filterType === 'all' ? '' : filterType
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data && res.data.success) {
          const result = res.data.data;
          const newProjects = result.list || [];
          
          // 处理数据格式，确保与页面显示兼容
          const processedProjects = newProjects.map(item => ({
            id: item.id,
            title: item.title,
            tags: item.tags || [],
            type: this.getProjectType(item.tags),
            desc: item.desc || '',
            achievement: item.achievement || '',
            members: item.members || []
          }));

          const allProjects = isRefresh 
            ? processedProjects 
            : [...this.data.allProjects, ...processedProjects];

          this.setData({
            allProjects: allProjects,
            displayList: allProjects,
            page: page + 1,
            hasMore: newProjects.length === pageSize
          });

          if (apiConfig.DEBUG) {
            console.log('[CoopOpportunities] 加载成功:', result.total, '条');
          }
        } else {
          console.warn('[CoopOpportunities] 加载失败:', res.data);
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('[CoopOpportunities] 请求失败:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ isLoading: false });
        wx.hideLoading();
      }
    });
  },

  // 根据标签判断项目类型
  getProjectType(tags) {
    if (!tags || tags.length === 0) return 'other';
    
    const tagStr = tags.join(',').toLowerCase();
    
    if (tagStr.includes('人工智能') || tagStr.includes('ai') || tagStr.includes('机器学习') || tagStr.includes('深度学习')) {
      return 'ai';
    }
    if (tagStr.includes('大数据') || tagStr.includes('bigdata') || tagStr.includes('数据挖掘')) {
      return 'bigdata';
    }
    if (tagStr.includes('物联网') || tagStr.includes('iot') || tagStr.includes('智能')) {
      return 'iot';
    }
    
    return 'other';
  },

  // 筛选项目
  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    
    this.setData({
      filterType: type
    });
    
    // 重新加载数据
    this.loadCoopList(true);
  },

  // 查看详情
  onViewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coop-detail/coop-detail?id=${id}`
    });
  },

  // 发起申请
  onApply(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '发起合作申请',
      icon: 'none'
    });
    // TODO: 跳转到申请页面或弹出申请表单
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadCoopList(true);
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    this.loadCoopList(false);
  }
});
