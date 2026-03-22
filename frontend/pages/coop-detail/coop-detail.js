// pages/coop-detail/coop-detail.js
const { FavoriteManager } = require('../../utils/storage.js');
const apiConfig = require('../../config/api.js');

Page({
  data: {
    projectInfo: {},
    isFavorited: false,
    isLoading: true,
    coopId: ''
  },

  onLoad(options) {
    const projectId = options.id;
    this.setData({ coopId: projectId });
    this.loadProjectDetail(projectId);
  },

  onShow() {
    if (this.data.projectInfo.id) {
      this.checkFavoriteStatus();
    }
  },

  // 加载项目详情
  loadProjectDetail(projectId) {
    this.setData({ isLoading: true });

    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/coop/detail/${projectId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data && res.data.success) {
          const coopData = res.data.data;
          
          // 处理成员信息
          const mentors = (coopData.members || []).map((member, index) => ({
            id: index + 1,
            name: member.name || '未知',
            initial: (member.name || '未')[0],
            title: member.school ? `${member.school} · ${member.department || '未知学院'}` : '未知院校',
            tags: member.school ? [member.school] : []
          }));

          // 处理标签
          const tags = coopData.tags || [];
          if (tags.length === 0 && coopData.type_cn) {
            tags.push(coopData.type_cn);
          }

          // 构建项目详情数据
          const projectInfo = {
            id: coopData.id,
            title: coopData.title || '合作项目',
            tags: tags.slice(0, 3),
            partner: mentors.map(m => m.name.split('·')[0].trim()).join('、') || '多所高校',
            startDate: coopData.created_at ? coopData.created_at.substring(0, 10) : '2024-01',
            budget: '待定',
            contactCount: `${mentors.length}位（可查询详细资料）`,
            successRate: '85%',
            description: coopData.description || coopData.core_area || '暂无项目描述',
            values: [
              '学术价值：参与前沿研究，提升学术能力；',
              '技术价值：掌握核心技术，提升工程实践；',
              '资源价值：拓展学术网络，建立合作关系。'
            ],
            areas: [coopData.core_area || '研究方向待定'],
            mentors: mentors,
            partnerIntro: `高校合作方：${mentors.map(m => m.title).join('、')}`,
            partnerDetail: '对接方式：通过平台直接联系合作导师',
            partnerLink: '',
            aiAnalysis: [
              {
                id: 1,
                number: '1',
                title: '申请概率',
                content: '根据项目热度和导师响应率估算，申请成功概率约85%'
              },
              {
                id: 2,
                number: '2',
                title: '准备建议',
                content: '建议提前了解项目研究方向，准备相关研究背景资料'
              },
              {
                id: 3,
                number: '3',
                title: '沟通策略',
                content: '突出自己的研究兴趣与项目方向的匹配度'
              },
              {
                id: 4,
                number: '4',
                title: '风险提示',
                content: '合作项目需要投入较多时间，请确保有充足的精力参与'
              }
            ],
            analysisFooter: '数据来源于平台统计，仅供参考'
          };

          this.setData({
            projectInfo: projectInfo,
            isLoading: false
          });

          this.checkFavoriteStatus();

          if (apiConfig.DEBUG) {
            console.log('[CoopDetail] 加载详情成功:', coopData);
          }
        } else {
          console.warn('[CoopDetail] 加载详情失败:', res.data);
          wx.showToast({
            title: '加载详情失败',
            icon: 'none'
          });
          this.setData({ isLoading: false });
        }
      },
      fail: (err) => {
        console.error('[CoopDetail] 请求详情失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        this.setData({ isLoading: false });
      }
    });
  },

  // 检查收藏状态
  checkFavoriteStatus() {
    const isFavorited = FavoriteManager.isFavoriteProject(this.data.projectInfo.id);
    this.setData({
      isFavorited: isFavorited
    });
  },

  // 查看导师详情
  onViewMentor(e) {
    const mentorId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看导师详情',
      icon: 'none'
    });
  },

  // 收藏项目
  onSaveProject() {
    const projectInfo = this.data.projectInfo;
    
    const projectData = {
      id: projectInfo.id || Date.now(),
      title: projectInfo.title,
      tags: projectInfo.tags,
      partner: projectInfo.partner,
      startDate: projectInfo.startDate,
      budget: projectInfo.budget,
      description: projectInfo.description,
      successRate: projectInfo.successRate
    };

    const result = FavoriteManager.toggleFavoriteProject(projectData);
    
    if (result.success) {
      wx.showToast({
        title: result.message,
        icon: 'success',
        duration: 2000
      });
      this.checkFavoriteStatus();
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none',
        duration: 2000
      });
    }
  }
});
