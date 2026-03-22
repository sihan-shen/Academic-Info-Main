// pages/index/index.js

const authUtil = require('../../utils/auth.js');

// 页面路由常量
const PAGE_ROUTES = {
  SEARCH: '/pages/search/search',
  TUTOR_LIBRARY: '/pages/tutor-library/tutor-library',
  RESEARCH_MATCH: '/pages/research-match/research-match',
  COOP_SEARCH: '/pages/coop-search/coop-search',
  COOP_MINING: '/pages/coop-mining/coop-mining',
  FAVORITES: '/pages/favorites/favorites'
};

// 防抖延迟时间（毫秒）
const SEARCH_DEBOUNCE_DELAY = 300;

Page({
  data: {
    showActionSheet: false,
    selectedTags: [],
    activeTag: null,
    displayNewsList: [],
    newsList: [
      {
        id: 1,
        title: '中国"人造太阳"EAST创造"亿度千秒"世界纪录',
        desc: '中国科学院等离子体物理研究所团队成功实现1亿摄氏度1066秒高质量燃烧，标志我国聚变能源研究从基础科学向工程实践重大跨越，为人类加快实现聚变发电奠定基础',
        tags: ['新能源', '新材料', '物理学', '安徽', '物理']
      },
      {
        id: 2,
        title: '中南大学湘雅医院龚学军、李宜雄教授团队',
        desc: '在胰腺癌诊治领域连续发表《Molecular Cancer》《Research》等高水平研究，构建微生物组-代谢组相互作用网络，开发无创CT影像纤维化量化模型',
        tags: ['生物医学', '中南大学', '湖南']
      },
      {
        id: 3,
        title: '北华大学经管学院实现国家级项目双突破',
        desc: '高俊峰副教授获2025年国家社科基金一般项目《人工智能赋能网络暴力信息特征识别与风险治理研究》，徐雪娇副教授获教育部人文社科青年基金项目',
        tags: ['人工智能', '人文社科', '北华大学', '吉林']
      },
      {
        id: 4,
        title: '零碳制氢技术连发《自然》《科学》',
        desc: '北京大学马丁团队开发新型催化剂，从源头消除二氧化碳排放，实现高产率氢气生产，为零碳排放工业制氢奠定科学基础',
        tags: ['新能源', '新材料', '环境科学', '北京大学', '北京']
      },
      {
        id: 5,
        title: '华中农大发现水稻耐高温"开关"',
        desc: '科研团队发现关键基因QT12，导入商业品种后在夜间高温条件下产量提升78%，为全球变暖背景下保障粮食安全提供新方案',
        tags: ['生物医学', '环境科学', '华中农业大学', '湖北', '武汉']
      },
      // Added more mock data to simulate scrolling
      {
        id: 6,
        title: '图灵奖得主Yann LeCun谈AI未来',
        desc: '深度学习先驱LeCun在最新演讲中探讨了自监督学习的未来，以及如何构建具有常识推理能力的人工智能系统。',
        tags: ['人工智能', '机器学习', '深度学习']
      },
      {
        id: 7,
        title: '新型量子计算机原型机问世',
        desc: '研究团队成功构建了100量子比特的超导量子计算原型机，在特定问题求解速度上比超级计算机快一亿倍。',
        tags: ['物理学', '量子力学', '计算机科学']
      },
      {
        id: 8,
        title: 'CRISPR基因编辑治疗遗传病新进展',
        desc: '临床试验显示，利用CRISPR技术治疗镰刀型细胞贫血症效果显著，患者症状明显缓解，且无严重副作用。',
        tags: ['生物学', '生物医学', '遗传学']
      },
      {
        id: 9,
        title: '全球数字经济发展报告发布',
        desc: '报告指出，数字经济已成为全球经济增长的新引擎，区块链技术在跨境支付和供应链金融中的应用日益广泛。',
        tags: ['经济学', '金融学', '区块链', '大数据']
      },
      {
        id: 10,
        title: '新型纳米材料大幅提升电池续航',
        desc: '科学家研发出一种新型碳纳米管复合材料，应用于锂电池负极，可使电动汽车续航里程提升30%。',
        tags: ['新材料', '化学', '新能源']
      },
      {
        id: 11,
        title: '自然语言处理大模型在医疗领域的应用',
        desc: '最新的NLP大模型能够准确从电子病历中提取关键信息，辅助医生进行诊断和治疗方案制定。',
        tags: ['人工智能', '自然语言处理', '生物医学']
      }
    ]
  },

  /**
   * 页面加载时触发
   */
  onLoad(options) {
    // 初始化防抖定时器（存储在实例属性而非data中，避免不必要的响应式更新）
    this.searchTimer = null;
    
    // Initialize displayNewsList
    this.setData({
      displayNewsList: this.data.newsList
    });

    console.log('页面加载完成，数据:', this.data);
    console.log('页面参数:', options);
    
    // 确保数据正确初始化
    if (!this.data.newsList || this.data.newsList.length === 0) {
      console.warn('新闻列表为空');
    }
  },

  /**
   * 页面显示时触发
   */
  onShow() {
    console.log('页面显示，当前数据:', this.data);
    this.checkUserInterests();
  },

  checkUserInterests() {
    const interests = wx.getStorageSync('userInterests_v2');
    if (!interests || interests.length === 0) {
      wx.reLaunch({
        url: '/pages/interest-selection/interest-selection'
      });
    } else {
      // If no active tag is set (e.g. first load), set it to the first interest
      const activeTag = this.data.activeTag || interests[0];
      
      this.setData({
        selectedTags: interests,
        activeTag: activeTag
      });
      this.filterNewsList(activeTag);
    }
  },

  /**
   * 点击标签切换资讯
   */
  onTagTap(e) {
    const { tag } = e.currentTarget.dataset;
    if (tag === this.data.activeTag) return;
    
    this.setData({ activeTag: tag });
    this.filterNewsList(tag);
  },

  /**
   * 跳转到兴趣筛选页面
   */
  navigateToInterestSelection() {
    wx.navigateTo({
      url: '/pages/interest-selection/interest-selection'
    });
  },

  filterNewsList(activeTag) {
    // If no active tag, show all? Or show empty?
    // Let's assume we always have an active tag if interests exist.
    if (!activeTag) {
      this.setData({ displayNewsList: this.data.newsList });
      return;
    }

    const filtered = this.data.newsList.filter(item => {
      if (!item.tags) return false;
      return item.tags.includes(activeTag);
    });
    
    // If no specific news for this tag, maybe show a placeholder or all news?
    // User asked "presented information corresponds to the selected tag".
    // So strictly filter. If empty, show empty state or handle gracefully.
    this.setData({ displayNewsList: filtered });
  },

  /**
   * 页面渲染完成时触发
   */
  onReady() {
    console.log('页面渲染完成');
  },

  /**
   * 搜索处理（带防抖）
   */
  onSearch(e) {
    const keyword = (e.detail?.value || '').trim();
    if (!keyword) {
      return;
    }

    // 清除之前的定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    // 设置防抖，延迟后执行搜索
    this.searchTimer = setTimeout(() => {
      this.navigateToPage(PAGE_ROUTES.SEARCH, { keyword });
      this.searchTimer = null;
    }, SEARCH_DEBOUNCE_DELAY);
  },


  /**
   * 关闭所有弹窗
   */
  closeAllSheets() {
    // No sheets to close currently
    this.setData({ 
      showActionSheet: false 
    });
  },

  /**
   * 阻止默认滚动行为（用于遮罩层）
   */
  preventDefault() {
    // 阻止遮罩层下的滚动
    return false;
  },

  /**
   * 导航到简单搜索页面
   */
  navigateToSimpleSearch() {
    // 搜索功能不需要登录
    if (this.closeActionSheet) {
        this.closeActionSheet();
    } else if (this.closeAllSheets) {
        this.closeAllSheets();
    }
    
    wx.navigateTo({
      url: '/pages/search-simple/search-simple'
    });
  },

  /**
   * 导航到搜索页面 (高级筛选)
   */
  navigateToSearch() {
    // 搜索功能不需要登录
    this.closeAllSheets();
    this.navigateToPage(PAGE_ROUTES.SEARCH);
  },

  /**
   * 导航到院校导师库
   */
  navigateToTutorLibrary() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.closeAllSheets();
    this.navigateToPage(PAGE_ROUTES.TUTOR_LIBRARY);
  },

  /**
   * 导航到查合作
   */
  navigateToCoop() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.navigateToPage(PAGE_ROUTES.COOP_SEARCH);
  },

  /**
   * 导航到研究领域匹配
   */
  navigateToResearchMatch() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.navigateToPage(PAGE_ROUTES.RESEARCH_MATCH);
  },


  /**
   * 导航到收藏页面
   */
  navigateToFav() {
    if (!authUtil.checkLogin('/pages/index/index')) {
      return;
    }
    this.navigateToPage(PAGE_ROUTES.FAVORITES);
  },

  /**
   * 通用页面导航方法
   * @param {string} url - 页面路径
   * @param {object} params - 查询参数对象
   */
  navigateToPage(url, params = {}) {
    if (!url) {
      console.warn('导航失败：页面路径为空');
      return;
    }

    try {
      // 构建查询字符串
      const queryString = Object.keys(params)
        .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      wx.navigateTo({
        url: fullUrl,
        fail: (err) => {
          console.error('页面跳转失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('导航错误:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 图片加载错误处理
   */
  onImageError(e) {
    console.error('图片加载失败:', e.detail);
  },

  /**
   * 页面卸载时清理定时器
   */
  onUnload() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  }
})
