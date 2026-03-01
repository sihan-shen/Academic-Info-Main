Page({
  data: {
    // Subject areas acting as filters
    subjects: ['全部', '计算机科学', '人工智能', '经济学', '物理学', '化学', '生物学'],
    currentSubject: '全部',

    // Mapping of subject to available directions
    directionsMap: {
      '全部': [
        '机器学习', '深度学习', '计算机视觉', '自然语言处理', 
        '软件工程', '数据库', '云计算', '区块链',
        '宏观经济', '微观经济', '金融学', '国际贸易',
        '量子力学', '凝聚态物理', '粒子物理',
        '有机化学', '无机化学', '物理化学',
        '分子生物学', '细胞生物学', '遗传学'
      ],
      '计算机科学': [
        '软件工程', '数据库', '操作系统', '计算机网络', 
        '网络安全', '云计算', '区块链', '人机交互',
        '计算机图形学', '嵌入式系统'
      ],
      '人工智能': [
        '机器学习', '深度学习', '计算机视觉', '自然语言处理', 
        '强化学习', '数据挖掘', '知识图谱', '智能机器人',
        '模式识别', '神经网络'
      ],
      '经济学': [
        '宏观经济', '微观经济', '金融学', '国际贸易', 
        '计量经济学', '发展经济学', '劳动经济学', '产业经济学'
      ],
      '物理学': [
        '量子力学', '凝聚态物理', '粒子物理', '天体物理', 
        '光学', '声学', '等离子体物理', '力学'
      ],
      '化学': [
        '有机化学', '无机化学', '物理化学', '分析化学', 
        '高分子化学', '环境化学', '材料化学'
      ],
      '生物学': [
        '分子生物学', '细胞生物学', '遗传学', '神经生物学', 
        '微生物学', '生物化学', '生态学', '生物信息学'
      ]
    },

    // Currently displayed directions based on currentSubject
    displayedDirections: [],

    selectedTags: [], // Array of selected direction strings
    selectedCount: 0,
    maxSelection: 5
  },

  onLoad() {
    // Initialize displayed directions
    this.updateDisplayedDirections('全部');

    // Check if there are previously selected tags
    const savedTags = wx.getStorageSync('userInterests_v2') || [];
    this.setData({
      selectedTags: savedTags,
      selectedCount: savedTags.length
    });
  },

  updateDisplayedDirections(subject) {
    const directions = this.data.directionsMap[subject] || [];
    this.setData({
      currentSubject: subject,
      displayedDirections: directions
    });
  },

  // Select a subject filter
  selectSubject(e) {
    const { subject } = e.currentTarget.dataset;
    if (subject === this.data.currentSubject) return;
    this.updateDisplayedDirections(subject);
  },

  // Toggle a specific direction tag
  toggleTag(e) {
    const { tag } = e.currentTarget.dataset;
    const { selectedTags, maxSelection } = this.data;
    
    const index = selectedTags.indexOf(tag);
    let newTags = [...selectedTags];

    if (index > -1) {
      // Deselect
      newTags.splice(index, 1);
    } else {
      // Select
      if (newTags.length >= maxSelection) {
        wx.showToast({
          title: `最多只能选择${maxSelection}个标签`,
          icon: 'none'
        });
        return;
      }
      newTags.push(tag);
    }

    this.setData({
      selectedTags: newTags,
      selectedCount: newTags.length
    });
  },

  confirmSelection() {
    const { selectedTags } = this.data;
    
    // Save selection
    wx.setStorageSync('userInterests_v2', selectedTags);
    
    // Redirect to home page
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
