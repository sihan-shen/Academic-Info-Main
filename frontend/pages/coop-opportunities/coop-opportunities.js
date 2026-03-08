// pages/coop-opportunities/coop-opportunities.js
Page({
  data: {
    filterType: 'all',
    allProjects: [
      {
        id: 1,
        title: '跨校AI联合实验室',
        tags: ['人工智能', '跨校合作'],
        type: 'ai',
        desc: '清华、北大、浙大联合开展深度学习前沿研究',
        achievement: '已发表顶会论文15篇，获国家级项目资助',
        members: [
          { name: '张明华', school: '清华', initial: '张' },
          { name: '李晓芳', school: '北大', initial: '李' },
          { name: '王建国', school: '浙大', initial: '王' }
        ]
      },
      {
        id: 2,
        title: '智能制造产学研合作',
        tags: ['产学研', '技术转化'],
        type: 'ai',
        desc: '高校与华为、阿里巴巴等企业开展智能制造技术研发',
        achievement: '技术转化5项，专利授权20+件',
        members: [
          { name: '陈思远', school: '上交', initial: '陈' },
          { name: '刘强', school: '复旦', initial: '刘' }
        ]
      },
      {
        id: 3,
        title: '大数据分析研究中心',
        tags: ['大数据', '数据挖掘'],
        type: 'bigdata',
        desc: '专注于大规模数据分析与机器学习算法研究',
        achievement: '发表SCI论文12篇，主持国家自然科学基金2项',
        members: [
          { name: '赵文博', school: '中科院', initial: '赵' },
          { name: '孙丽娜', school: '北航', initial: '孙' }
        ]
      },
      {
        id: 4,
        title: '智慧城市物联网应用',
        tags: ['物联网', '智慧城市'],
        type: 'iot',
        desc: '开发基于物联网的城市管理与服务平台',
        achievement: '落地应用3个城市，获省级科技进步奖',
        members: [
          { name: '周建华', school: '同济', initial: '周' },
          { name: '吴敏', school: '东南', initial: '吴' }
        ]
      },
      {
        id: 5,
        title: '计算机视觉联合实验室',
        tags: ['人工智能', '计算机视觉'],
        type: 'ai',
        desc: '图像识别、目标检测等前沿技术研究',
        achievement: '专利申请15项，技术转让3项',
        members: [
          { name: '林志远', school: '中大', initial: '林' },
          { name: '黄晓明', school: '南大', initial: '黄' }
        ]
      },
      {
        id: 6,
        title: '工业大数据平台建设',
        tags: ['大数据', '工业互联网'],
        type: 'bigdata',
        desc: '面向制造业的数据采集、分析与优化系统',
        achievement: '服务企业50+家，创造经济效益5000万',
        members: [
          { name: '郑浩', school: '西交', initial: '郑' },
          { name: '钱雨婷', school: '天大', initial: '钱' }
        ]
      },
      {
        id: 7,
        title: '智能家居物联网生态',
        tags: ['物联网', '智能家居'],
        type: 'iot',
        desc: '构建全屋智能家居系统与生态平台',
        achievement: '产品上市销售，用户超10万',
        members: [
          { name: '冯晓东', school: '华科', initial: '冯' },
          { name: '谢婷婷', school: '武大', initial: '谢' }
        ]
      }
    ],
    displayList: []
  },

  onLoad(options) {
    // 初始化显示所有项目
    this.setData({
      displayList: this.data.allProjects
    });
  },

  // 筛选项目
  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    let displayList = [];
    
    if (type === 'all') {
      displayList = this.data.allProjects;
    } else {
      displayList = this.data.allProjects.filter(item => item.type === type);
    }

    this.setData({
      filterType: type,
      displayList: displayList
    });
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
  }
});
