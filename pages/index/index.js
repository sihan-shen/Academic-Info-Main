// pages/index/index.js
Page({
  data: {
    showActionSheet: false,
    showCoopSheet: false,
    newsList: [
      {
        id: 1,
        title: '中国"人造太阳"EAST创造"亿度千秒"世界纪录',
        desc: '中国科学院等离子体物理研究所团队成功实现1亿摄氏度1066秒高质量燃烧，标志我国聚变能源研究从基础科学向工程实践重大跨越，为人类加快实现聚变发电奠定基础'
      },
      {
        id: 2,
        title: '中南大学湘雅医院龚学军、李宜雄教授团队',
        desc: '在胰腺癌诊治领域连续发表《Molecular Cancer》《Research》等高水平研究，构建微生物组-代谢组相互作用网络，开发无创CT影像纤维化量化模型'
      },
      {
        id: 3,
        title: '北华大学经管学院实现国家级项目双突破',
        desc: '高俊峰副教授获2025年国家社科基金一般项目《人工智能赋能网络暴力信息特征识别与风险治理研究》，徐雪娇副教授获教育部人文社科青年基金项目'
      },
      {
        id: 4,
        title: '零碳制氢技术连发《自然》《科学》',
        desc: '北京大学马丁团队开发新型催化剂，从源头消除二氧化碳排放，实现高产率氢气生产，为零碳排放工业制氢奠定科学基础'
      },
      {
        id: 5,
        title: '华中农大发现水稻耐高温"开关"',
        desc: '科研团队发现关键基因QT12，导入商业品种后在夜间高温条件下产量提升78%，为全球变暖背景下保障粮食安全提供新方案'
      }
    ]
  },

  onLoad() {

  },

  onSearch(e) {
    const keyword = e.detail.value;
    if (keyword) {
      wx.navigateTo({
        url: `/pages/search/search?keyword=${keyword}`
      });
    }
  },

  openActionSheet() {
    this.setData({ showActionSheet: true });
  },

  closeActionSheet() {
    this.setData({ showActionSheet: false });
  },

  closeAllSheets() {
    this.setData({ showActionSheet: false, showCoopSheet: false });
  },

  navigateToSearch() {
    this.closeActionSheet();
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  navigateToTutorLibrary() {
    this.closeActionSheet();
    wx.navigateTo({
      url: '/pages/tutor-library/tutor-library'
    });
  },

  navigateToCoop() {
    this.setData({ showCoopSheet: true });
  },

  navigateToResearchMatch() {
    this.closeAllSheets();
    wx.navigateTo({
      url: '/pages/research-match/research-match'
    });
  },

  navigateToCoopMining() {
    this.closeAllSheets();
    wx.navigateTo({
      url: '/pages/coop-mining/coop-mining'
    });
  },

  navigateToFav() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  }
})
