// pages/help/help.js
const allQuestions = [
  {
    category: '基础使用', tagClass: 'blue',
    question: '如何开始使用学术导师信息平台？',
    answer: '欢迎使用！您可以通过以下步骤开始：\n1. 首页浏览推荐导师列表\n2. 使用搜索功能查找特定导师\n3. 点击导师卡片查看详细信息\n4. 使用AI智能分析功能获取个性化推荐\n5. 开通会员解锁更多高级功能'
  },
  {
    category: '基础使用', tagClass: 'blue',
    question: '平台的数据来源可靠吗？',
    answer: '我们的数据来源非常可靠：\n· 公开学术资源：包括学术期刊、会议论文等\n· 院校官方信息：各高校导师库数据\n· 实时更新：定期同步最新学术成果\n· 人工审核：专业团队核实关键信息\n所有数据仅供参考，建议结合多方信息做决策。'
  },
  {
    category: '基础使用', tagClass: 'blue',
    question: '如何联系平台客服？',
    answer: '您可以通过以下方式联系我们：\n· 在线客服：点击页面底部"在线客服"按钮\n· 电话客服：拨打 400-888-8888\n· 邮箱反馈：support@daochacha.com\n客服工作时间为周一至周五 9:00-18:00。'
  },
  {
    category: '导师查询', tagClass: 'green',
    question: '如何搜索我需要的导师？',
    answer: '您可以通过多种方式查找导师：\n1. 在首页搜索框输入导师姓名或研究方向\n2. 使用高级筛选功能按学科、职称、院校等维度筛选\n3. 浏览导师库按分类查看\n4. 使用AI智能匹配推荐相关导师'
  },
  {
    category: '导师查询', tagClass: 'green',
    question: '导师信息包含哪些内容？',
    answer: '每位导师的信息页面包含：\n· 基本信息：姓名、职称、所属院校和院系\n· 研究方向：主要研究领域和关键词\n· 学术成果：发表论文、科研项目\n· 招生信息：招生名额、招生要求\n· 联系方式：邮箱等公开联系信息'
  },
  {
    category: '导师查询', tagClass: 'green',
    question: '如何收藏感兴趣的导师？',
    answer: '在导师详情页面，点击右上角的"收藏"按钮即可将导师加入收藏夹。您可以在"我的 > 我的收藏"中管理所有收藏的导师。基础用户可收藏5位导师，会员可收藏无限位。'
  },
  {
    category: 'AI功能', tagClass: 'purple',
    question: 'AI智能问答如何使用？',
    answer: '进入AI问答功能后，您可以直接输入问题，例如：\n· "帮我推荐计算机视觉方向的导师"\n· "分析张教授的研究方向"\n· "对比这两位导师的学术成果"\nAI将基于平台数据为您提供智能分析和建议。'
  },
  {
    category: 'AI功能', tagClass: 'purple',
    question: 'AI导师对比功能怎么用？',
    answer: '选择2-3位导师后，点击"AI对比"按钮，系统将从研究方向、学术产出、招生情况等多个维度进行智能对比分析，帮助您做出更好的选择。'
  },
  {
    category: 'AI功能', tagClass: 'purple',
    question: 'AI文献总结功能是什么？',
    answer: '该功能可以自动分析导师发表的论文，提取核心研究主题、方法论和主要贡献，帮助您快速了解导师的学术方向和研究深度，无需逐篇阅读论文。'
  },
  {
    category: 'AI功能', tagClass: 'purple',
    question: 'AI研究方向规划如何帮助我？',
    answer: '基于您的学术背景和兴趣，AI会分析当前热门研究方向的发展趋势，结合导师资源推荐最适合您的研究方向，并提供相关导师建议和学习路径规划。'
  },
  {
    category: '会员服务', tagClass: 'orange',
    question: '会员分为哪几种？有什么区别？',
    answer: '目前提供以下会员方案：\n· 基础会员（¥99/月）：无限次导师查询、详细信息展示、标准搜索、基础数据导出\n· 高级会员（¥199/月）：包含基础会员所有功能，另加AI智能分析、高级对比、优先客服\n免费用户每日有一定查询额度。'
  },
  {
    category: '会员服务', tagClass: 'orange',
    question: '如何开通会员？支持哪些支付方式？',
    answer: '在"我的"页面点击VIP卡片即可进入会员开通页面。目前支持微信支付，后续将支持更多支付方式。开通后会员权益立即生效。'
  },
  {
    category: '会员服务', tagClass: 'orange',
    question: '会员可以退款吗？',
    answer: '会员服务开通后不支持退款。如果您在使用过程中遇到任何问题，请联系客服（400-888-8888），我们将竭力为您解决。建议先使用免费试用额度体验后再决定是否开通。'
  },
  {
    category: '隐私安全', tagClass: 'red',
    question: '平台如何保护我的个人信息？',
    answer: '我们高度重视您的隐私安全：\n· 数据加密：所有个人信息采用加密传输和存储\n· 权限控制：严格的数据访问权限管理\n· 隐私协议：遵守相关法律法规\n· 匿名浏览：您的浏览记录不会被其他用户看到\n您可以在"隐私设置"中管理个人信息。'
  },
  {
    category: '隐私安全', tagClass: 'red',
    question: '我的查看记录会被保存吗？',
    answer: '您的浏览记录仅保存在本地设备上，不会上传到服务器或被其他用户查看。您可以在"隐私设置"中选择清除浏览记录。收藏数据会同步到云端以支持多设备访问。'
  },
  {
    category: '报告功能', tagClass: 'teal',
    question: '什么是匹配报告？如何生成？',
    answer: '匹配报告是基于您的学术背景和需求，AI自动生成的导师推荐报告。报告包含推荐导师列表、匹配度分析、研究方向契合度等信息。在完善个人学术档案后，点击"生成匹配报告"即可。'
  },
  {
    category: '报告功能', tagClass: 'teal',
    question: '如何导出报告数据？',
    answer: '在报告详情页面，点击右上角"导出"按钮可将报告导出为PDF格式。基础会员可导出简版报告，高级会员可导出包含详细分析的完整版报告。'
  }
];

Page({
  data: {
    activeTag: '',
    searchKey: '',
    hotQuestions: [
      '如何开始使用学术导师信息平台？',
      '平台的数据来源可靠吗？',
      '如何联系平台客服？',
      '如何搜索我需要的导师？',
      '导师信息包含哪些内容？',
      '如何和朋友讨论对比导师信息？'
    ],
    filteredQuestions: []
  },

  onLoad(options) {
    if (options && options.tag) {
      this.setData({ activeTag: options.tag });
    }
    this.filterQuestions();
  },

  onTagTap(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ activeTag: tag });
    this.filterQuestions();
  },

  onSearchInput(e) {
    this.setData({ searchKey: e.detail.value });
    this.filterQuestions();
  },

  goToService() {
    wx.navigateTo({
      url: '/pages/service/service'
    });
  },

  onToggleQuestion(e) {
    const idx = e.currentTarget.dataset.idx;
    const key = `filteredQuestions[${idx}].expanded`;
    this.setData({
      [key]: !this.data.filteredQuestions[idx].expanded
    });
  },

  filterQuestions() {
    const { activeTag, searchKey } = this.data;
    let result = allQuestions;

    if (activeTag) {
      result = result.filter(q => q.category === activeTag);
    }
    if (searchKey) {
      const key = searchKey.toLowerCase();
      result = result.filter(q => q.question.toLowerCase().includes(key));
    }

    this.setData({
      filteredQuestions: result.map(q => ({ ...q, expanded: false }))
    });
  }
});
