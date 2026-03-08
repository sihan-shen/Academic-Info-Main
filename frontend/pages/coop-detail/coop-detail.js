// pages/coop-detail/coop-detail.js
const { FavoriteManager } = require('../../utils/storage.js');

Page({
  data: {
    projectInfo: {},
    isFavorited: false
  },

  onLoad(options) {
    const projectId = options.id;
    // 根据项目ID加载项目详情
    this.loadProjectDetail(projectId);
  },

  onShow() {
    // 每次显示页面时检查收藏状态
    if (this.data.projectInfo.id) {
      this.checkFavoriteStatus();
    }
  },

  // 加载项目详情
  loadProjectDetail(projectId) {
    // 模拟项目数据
    const projectData = {
      1: {
        id: 1,
        title: '跨学科AI等纳匹配系统研发项目',
        tags: ['项目拓展率93%', '优先对接', '跨学科匹配'],
        partner: 'XXX大学、XXX大学',
        startDate: '2024-01-2026.12',
        budget: '56067元',
        contactCount: '3位（可查询详细资料）',
        successRate: '93%',
        description: '本项目由XX科技公司与XXX大学合作，整合XX科技公司的算法及资源与XXX大学的导向资源，共同开发一款基于AI的精准对接平台，学术合作挖掘AI平台。专家合作挖掘AI。',
        values: [
          '学术价值：参与理解主要算法与决策中心，导致并提供学术帮助学术模型；',
          '技术价值：挖掘业出挂法业优化及数据，研讨未来医类策略；',
          '资源价值：拓印优生非享学学术资源高，包推未来人脉网络。'
        ],
        areas: [
          '首选任领：参与理解组并与拍好研究间申请，研生拉研生构中心；',
          '学术技术：需要理解预知集成的设计支易高，对整技回输生拍解决策略；',
          '数据分析：为导师与导课选析对接，研讨策略答生策略与数据分析基答疑策略；',
          '问题探寻：导拍研究拍答疑及及分告答及答所答讨，搜研答及策策策略出对研基策略。'
        ],
        mentors: [
          {
            id: 1,
            name: '张华平',
            initial: '张',
            title: '清华大学 · 互联网计算学院',
            tags: ['清华']
          },
          {
            id: 2,
            name: '李晓芳',
            initial: '李',
            title: '北京大学 · 软科学学院',
            tags: ['数据采集技术']
          },
          {
            id: 3,
            name: '王建国',
            initial: '王',
            title: '浙江大学 · 控制科学工程学院',
            tags: ['智能控制系统']
          }
        ],
        partnerIntro: '企业方：XX科技公司（AI领域创新企业）；擅长方向（项数及部品系统）；\n高校方：XXX大学（双一流高校），导师资源主要师，在学术信息理信系统建设方面研究深)',
        partnerDetail: '对接方式： 通过指导培训等对接进展项目担任并拍策略',
        partnerLink: 'mentor@xxx.com',
        aiAnalysis: [
          {
            id: 1,
            number: '1',
            title: '申请概率',
            content: '77%左信组并对学科导师的组申请，研生拍研生构中心组研生拍告组申告'
          },
          {
            id: 2,
            number: '2',
            title: '准备建议',
            content: '准备项目核心心高及策略，研究拍研生拍初研企及及本及及策略解析及及策策解化场答策略高'
          },
          {
            id: 3,
            number: '3',
            title: '沟通策略',
            content: '导导师与导策略，对整技回输拍答应拍组织导策高，推研答及及策策策略及策答解策略'
          },
          {
            id: 4,
            number: '4',
            title: '风险提示',
            content: '导拍研究拍答疑及及分告成及所答谈，让研答与双万告研及所及及及'
          }
        ],
        analysisFooter: '请联系单本导师确保得导师常务及合作信息数据权，仅供会作参考，最终以实际的策略'
      },
      // 其他项目数据可以按照同样的格式添加
      2: {
        id: 2,
        title: '智能制造产学研合作',
        tags: ['产学研深度融合', '商业价值高', '技术落地'],
        partner: '上海交通大学、复旦大学',
        startDate: '2023-06-2025.12',
        budget: '120000元',
        contactCount: '2位（可查询详细资料）',
        successRate: '91%',
        description: '高校与华为、阿里巴巴等企业开展智能制造技术研发，专注于工业互联网、智能生产线优化等前沿领域，推动产学研深度融合。',
        values: [
          '技术价值：接触企业级智能制造技术栈，提升工程实践能力；',
          '产业价值：深入了解制造业数字化转型需求，把握产业发展趋势；',
          '转化价值：研究成果可直接应用于企业生产，具有较高的商业价值。'
        ],
        areas: [
          '智能制造：参与智能生产线设计与优化，研究自动化控制系统；',
          '工业互联网：开发设备互联与数据采集平台，实现生产过程可视化；',
          '数据分析：分析生产数据，优化生产流程，提升生产效率；',
          '技术转化：将研究成果转化为实际产品，推动技术落地应用。'
        ],
        mentors: [
          {
            id: 4,
            name: '陈思远',
            initial: '陈',
            title: '上海交通大学 · 机械与动力工程学院',
            tags: ['上交']
          },
          {
            id: 5,
            name: '刘强',
            initial: '刘',
            title: '复旦大学 · 计算机科学技术学院',
            tags: ['复旦']
          }
        ],
        partnerIntro: '企业方：华为、阿里巴巴等国内领先科技企业；\n高校方：上海交通大学、复旦大学等双一流高校，在智能制造领域具有深厚研究积淀。',
        partnerDetail: '对接方式：通过企业导师与高校导师共同指导，定期开展技术交流与项目评审。',
        partnerLink: 'cooperation@company.com',
        aiAnalysis: [
          {
            id: 1,
            number: '1',
            title: '申请概率',
            content: '85%的申请者具备相关技术背景，成功率较高，建议充分准备技术方案。'
          },
          {
            id: 2,
            number: '2',
            title: '准备建议',
            content: '需具备智能制造、工业互联网等相关知识，了解企业实际需求，准备详细的技术方案。'
          },
          {
            id: 3,
            number: '3',
            title: '沟通策略',
            content: '主动与企业导师沟通，了解企业技术需求，展示自己的技术能力与研究成果。'
          },
          {
            id: 4,
            number: '4',
            title: '风险提示',
            content: '项目涉及企业核心技术，需签署保密协议，注意知识产权归属问题。'
          }
        ],
        analysisFooter: '以上信息由AI分析生成，仅供参考，具体合作细节请与导师确认。'
      }
    };

    // 如果找不到对应项目，使用默认数据
    const defaultData = projectData[1];
    const projectInfo = projectData[projectId] || defaultData;

    this.setData({
      projectInfo: projectInfo
    });

    // 检查收藏状态
    this.checkFavoriteStatus();
  },

  // 检查收藏状态
  checkFavoriteStatus() {
    const isFavorited = FavoriteManager.isFavoriteProject(this.data.projectInfo.id);
    this.setData({
      isFavorited: isFavorited
    });
  },

  // 联系导师
  onContactMentor(e) {
    const mentorId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看导师详情',
      icon: 'none'
    });
    // TODO: 跳转到导师详情页
    // wx.navigateTo({
    //   url: `/pages/tutor-detail/tutor-detail?id=${mentorId}`
    // });
  },

  // 收藏项目
  onSaveProject() {
    const projectInfo = this.data.projectInfo;
    
    // 准备收藏数据（只保存必要信息）
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
      
      // 更新收藏状态
      this.checkFavoriteStatus();
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none',
        duration: 2000
      });
    }
  },
});
