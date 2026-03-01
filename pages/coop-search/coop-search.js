// pages/coop-search/coop-search.js

Page({
  data: {
    keyword: '',
    totalCount: 328, // Initial count
    searchMode: 'filter', // 'filter'
    uploadedFile: null, // 存储上传的文件信息
    
    // 筛选选项数据
    filterData: {
      groups: [
        {
          title: '合作类型',
          key: 'coop_type',
          options: [
            { label: '全部', value: '', selected: true },
            { label: '跨校合作', value: 'cross_school', selected: false },
            { label: '产学研', value: 'industry_uni', selected: false },
            { label: '国际合作', value: 'intl', selected: false },
            { label: '联合实验室', value: 'joint_lab', selected: false },
            { label: '技术转化', value: 'tech_transfer', selected: false },
          ]
        },
        {
          title: '研究领域',
          key: 'field',
          options: [
            { label: '全部', value: '', selected: true },
            { label: '人工智能', value: 'ai', selected: false },
            { label: '生物医药', value: 'bio', selected: false },
            { label: '新能源', value: 'energy', selected: false },
            { label: '智能制造', value: 'manufacturing', selected: false },
            { label: '大数据', value: 'big_data', selected: false },
            { label: '芯片半导体', value: 'chip', selected: false },
            { label: '新材料', value: 'materials', selected: false },
          ]
        },
        {
          title: '所在区域',
          key: 'region',
          options: [
            { label: '全部', value: '', selected: true },
            { label: '京津冀', value: 'jjj', selected: false },
            { label: '长三角', value: 'csj', selected: false },
            { label: '珠三角', value: 'zsj', selected: false },
            { label: '中西部', value: 'west', selected: false },
            { label: '海外', value: 'overseas', selected: false },
          ]
        },
        {
          title: '项目阶段',
          key: 'stage',
          options: [
            { label: '全部', value: '', selected: true },
            { label: '基础研究', value: 'basic', selected: false },
            { label: '关键技术攻关', value: 'key_tech', selected: false },
            { label: '产业化应用', value: 'application', selected: false },
          ]
        },
        {
          title: '经费规模',
          key: 'funding',
          options: [
            { label: '全部', value: '', selected: true },
            { label: '50万以下', value: 'lt50', selected: false },
            { label: '50-200万', value: '50_200', selected: false },
            { label: '200-500万', value: '200_500', selected: false },
            { label: '500万以上', value: 'gt500', selected: false },
          ]
        }
      ]
    }
  },

  onLoad(options) {
    // 默认显示筛选面板
    this.updateTotalCount();
  },

  // 选择分组里的选项
  selectGroupOption(e) {
    const { groupIndex, optionIndex } = e.currentTarget.dataset;
    const filterData = this.data.filterData;
    const group = filterData.groups[groupIndex];
    const option = group.options[optionIndex];
    
    // 1. 处理选中逻辑 (单选)
    if (option.value === '') {
      // 如果点击的是"全部"
      if (option.selected) return; // 已经是选中状态，不处理
      group.options.forEach(opt => opt.selected = false);
      option.selected = true;
    } else {
      // 点击其他选项
      if (option.selected) {
        // 如果当前已选中，则取消选中，并自动选中"全部"
        option.selected = false;
        group.options[0].selected = true; 
      } else {
        // 如果当前未选中，则选中该项，并取消其他所有选项（包括"全部"）
        group.options.forEach(opt => opt.selected = false);
        option.selected = true;
      }
    }
    
    this.setData({
      filterData: filterData
    });

    // 更新匹配数量
    this.updateTotalCount();
  },

  updateTotalCount() {
    // 模拟根据筛选条件变化更新数量
    // 随机生成一个数量，让用户感觉在实时计算
    const base = 50;
    const random = Math.floor(Math.random() * 300);
    this.setData({
      totalCount: base + random
    });
  },

  // 确认筛选 - 跳转到合作挖掘页面（社工模型）
  confirmFilter() {
    wx.showLoading({ title: '匹配中...', mask: true });
    
    // 收集筛选条件（如果有API，这里会传递参数）
    const filters = {};
    this.data.filterData.groups.forEach(group => {
       const selected = group.options.find(o => o.selected && o.value !== '');
       if (selected) {
         filters[group.key] = selected.value;
       }
    });

    setTimeout(() => {
      wx.hideLoading();
      // 跳转到合作项目列表页 (coop-opportunities)
      wx.navigateTo({
        url: '/pages/coop-opportunities/coop-opportunities'
      });
    }, 500);
  }
})