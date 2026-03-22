// utils/storage.js - 本地存储管理工具

const STORAGE_KEYS = {
  FAVORITE_PROJECTS: 'favorite_projects',
  FAVORITE_TUTORS: 'favorite_tutors'
};

/**
 * 收藏项目管理
 */
class FavoriteManager {
  /**
   * 获取所有收藏的项目
   */
  static getFavoriteProjects() {
    try {
      const data = wx.getStorageSync(STORAGE_KEYS.FAVORITE_PROJECTS);
      return data || [];
    } catch (e) {
      console.error('获取收藏项目失败:', e);
      return [];
    }
  }

  /**
   * 保存收藏的项目
   */
  static saveFavoriteProjects(projects) {
    try {
      wx.setStorageSync(STORAGE_KEYS.FAVORITE_PROJECTS, projects);
      return true;
    } catch (e) {
      console.error('保存收藏项目失败:', e);
      return false;
    }
  }

  /**
   * 添加收藏项目
   */
  static addFavoriteProject(project) {
    try {
      const projects = this.getFavoriteProjects();
      
      // 检查是否已收藏
      const exists = projects.some(item => item.id === project.id);
      if (exists) {
        return { success: false, message: '该项目已收藏' };
      }

      // 添加收藏时间
      const projectWithDate = {
        ...project,
        favoriteDate: new Date().toISOString(),
        favoriteTimestamp: Date.now()
      };

      projects.unshift(projectWithDate);
      
      const saved = this.saveFavoriteProjects(projects);
      if (saved) {
        return { success: true, message: '收藏成功' };
      } else {
        return { success: false, message: '收藏失败' };
      }
    } catch (e) {
      console.error('添加收藏失败:', e);
      return { success: false, message: '收藏失败' };
    }
  }

  /**
   * 取消收藏项目
   */
  static removeFavoriteProject(projectId) {
    try {
      const projects = this.getFavoriteProjects();
      const filtered = projects.filter(item => item.id !== projectId);
      
      const saved = this.saveFavoriteProjects(filtered);
      if (saved) {
        return { success: true, message: '已取消收藏' };
      } else {
        return { success: false, message: '取消收藏失败' };
      }
    } catch (e) {
      console.error('取消收藏失败:', e);
      return { success: false, message: '取消收藏失败' };
    }
  }

  /**
   * 检查项目是否已收藏
   */
  static isFavoriteProject(projectId) {
    try {
      const projects = this.getFavoriteProjects();
      return projects.some(item => item.id === projectId);
    } catch (e) {
      console.error('检查收藏状态失败:', e);
      return false;
    }
  }

  /**
   * 切换收藏状态
   */
  static toggleFavoriteProject(project) {
    const isFavorited = this.isFavoriteProject(project.id);
    
    if (isFavorited) {
      return this.removeFavoriteProject(project.id);
    } else {
      return this.addFavoriteProject(project);
    }
  }
}

module.exports = {
  FavoriteManager,
  STORAGE_KEYS
};
