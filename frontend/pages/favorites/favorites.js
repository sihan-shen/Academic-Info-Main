// pages/favorites/favorites.js
const apiConfig = require('../../config/api.js');

Page({
  data: {
    activeTab: 'tutor', // tutor | project
    tutorList: [],
    projectList: [],
    isLoading: false
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadFavorites();
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 加载收藏列表
  loadFavorites() {
    const token = wx.getStorageSync('token');
    
    if (!token) {
      console.log('[Favorites] 未登录，跳过加载');
      return;
    }

    this.setData({ isLoading: true });

    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/user/favorites`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        console.log('[Favorites] 收藏数据:', res.data);
        if (res.data && res.data.success) {
          const data = res.data.data;
          
          // 格式化导师数据
          const tutors = (data.tutors || []).map(tutor => ({
            id: tutor.id,
            name: tutor.name,
            school: tutor.school,
            department: tutor.department,
            avatar: tutor.avatar || '/images/default-avatar.png',
            direction: tutor.direction,
            date: this.formatDate(tutor.date)
          }));

          // 格式化项目数据
          const coops = (data.coops || []).map(coop => ({
            id: coop.id,
            title: coop.title,
            type: coop.type,
            tags: coop.tags || [],
            date: this.formatDate(coop.date)
          }));

          this.setData({
            tutorList: tutors,
            projectList: coops
          });

          console.log('[Favorites] 导师收藏:', tutors.length, '项目收藏:', coops.length);
        }
      },
      fail: (err) => {
        console.error('[Favorites] 加载失败:', err);
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  // 取消收藏导师
  onRemoveTutor(e) {
    const id = e.currentTarget.dataset.id;
    const token = wx.getStorageSync('token');
    
    wx.showModal({
      title: '提示',
      content: '确定取消收藏该导师？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${apiConfig.BASE_URL}/api/v1/user/favorite/tutor/${id}`,
            method: 'POST',
            header: {
              'Authorization': `Bearer ${token}`
            },
            success: (res) => {
              if (res.data && res.data.success) {
                wx.showToast({ title: '已取消收藏', icon: 'success' });
                this.loadFavorites(); // 刷新列表
              }
            },
            fail: (err) => {
              console.error('[Favorites] 取消收藏失败:', err);
              wx.showToast({ title: '操作失败', icon: 'none' });
            }
          });
        }
      }
    });
  },

  // 取消收藏项目
  onRemoveProject(e) {
    const id = e.currentTarget.dataset.id;
    const token = wx.getStorageSync('token');
    
    wx.showModal({
      title: '提示',
      content: '确定取消收藏该项目？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${apiConfig.BASE_URL}/api/v1/user/favorite/coop/${id}`,
            method: 'POST',
            header: {
              'Authorization': `Bearer ${token}`
            },
            success: (res) => {
              if (res.data && res.data.success) {
                wx.showToast({ title: '已取消收藏', icon: 'success' });
                this.loadFavorites(); // 刷新列表
              }
            },
            fail: (err) => {
              console.error('[Favorites] 取消收藏失败:', err);
              wx.showToast({ title: '操作失败', icon: 'none' });
            }
          });
        }
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

  // 查看项目详情
  viewProjectDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coop-detail/coop-detail?id=${id}`
    });
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
});
