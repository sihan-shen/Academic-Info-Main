Page({
  data: {
    // Original subjects list including 'All'
    allSubjects: ['全部', '计算机科学', '人工智能', '经济学', '物理学', '化学', '生物学'],
    
    // Processed sections for rendering
    sections: [],

    // Mapping of subject to available directions (kept for reference if needed, but sections will hold the data)
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

    selectedTags: [], // Array of selected direction strings
    selectedCount: 0,
    maxSelection: 50 // Increased limit to support "Select All" functionality
  },

  onLoad() {
    this.initSections();
    
    // Check if there are previously selected tags
    const savedTags = wx.getStorageSync('userInterests_v2') || [];
    
    // Check for expanded "All" and collapse them for UI
    let collapsedTags = [...savedTags];
    const { directionsMap, allSubjects } = this.data;
    
    allSubjects.forEach(subject => {
      if (subject === '全部') return;
      const dirs = directionsMap[subject] || [];
      const allSelected = dirs.length > 0 && dirs.every(d => collapsedTags.includes(d));
      
      if (allSelected) {
        // Remove specific tags
        collapsedTags = collapsedTags.filter(t => !dirs.includes(t));
        // Add special "All" tag
        collapsedTags.push(subject + ':All');
      }
    });

    this.setData({
      selectedTags: collapsedTags
    });
    this.updateSelectedCount(collapsedTags);
  },

  initSections() {
    const { allSubjects, directionsMap } = this.data;
    const sections = allSubjects
      .filter(subject => subject !== '全部')
      .map(subject => ({
        title: subject,
        directions: directionsMap[subject] || [],
        collapsed: false // Default expanded
      }));

    this.setData({ sections });
  },

  toggleSection(e) {
    const { sectionIndex } = e.currentTarget.dataset;
    const sections = this.data.sections;
    sections[sectionIndex].collapsed = !sections[sectionIndex].collapsed;
    this.setData({ sections });
  },

  // Select/Deselect all items in a subject section
  toggleSelectAll(e) {
    const { sectionIndex } = e.currentTarget.dataset;
    const section = this.data.sections[sectionIndex];
    if (!section) return;

    const allTag = section.title + ':All';
    const { selectedTags } = this.data; // Remove maxSelection check for "All" clearing
    
    // Check if currently "All" is selected
    const isAllSelected = selectedTags.includes(allTag);
    
    let newTags = [...selectedTags];
    
    if (isAllSelected) {
      // If currently "All", switch to None
      newTags = newTags.filter(tag => tag !== allTag);
    } else {
      // Switch to "All"
      // Remove any specific tags from this section first
      newTags = newTags.filter(tag => !section.directions.includes(tag));
      // Add "All" tag
      newTags.push(allTag);
    }
    
    this.setData({
      selectedTags: newTags
    });
    
    // Calculate count for display (expanding "All" tags)
    this.updateSelectedCount(newTags);
  },

  updateSelectedCount(tags) {
    const { directionsMap } = this.data;
    let count = 0;
    tags.forEach(tag => {
      if (tag.endsWith(':All')) {
        const category = tag.split(':')[0];
        count += (directionsMap[category] || []).length;
      } else {
        count++;
      }
    });
    this.setData({ selectedCount: count });
  },

  // Toggle a specific direction tag
  toggleTag(e) {
    const { tag, sectionIndex } = e.currentTarget.dataset;
    const { selectedTags, maxSelection } = this.data;
    const section = this.data.sections[sectionIndex];
    const allTag = section.title + ':All';
    
    const isAllSelected = selectedTags.includes(allTag);
    let newTags = [...selectedTags];

    if (isAllSelected) {
      // If currently "All", switch to "Specific" (remove All, add clicked)
      newTags = newTags.filter(t => t !== allTag);
      newTags.push(tag);
    } else {
      const index = newTags.indexOf(tag);
      if (index > -1) {
        newTags.splice(index, 1);
      } else {
        // Check limit
        // We need to calculate current count
        let currentRealCount = 0;
        newTags.forEach(t => {
           if (t.endsWith(':All')) {
             const c = t.split(':')[0];
             currentRealCount += (this.data.directionsMap[c] || []).length;
           } else {
             currentRealCount++;
           }
        });
        
        if (currentRealCount >= maxSelection) {
           wx.showToast({ title: `最多只能选择${maxSelection}个标签`, icon: 'none' });
           return;
        }
        newTags.push(tag);
        
        // Check if we selected all specifics -> switch to "All" tag
        const currentSectionTags = newTags.filter(t => section.directions.includes(t));
        if (currentSectionTags.length === section.directions.length) {
          newTags = newTags.filter(t => !section.directions.includes(t));
          newTags.push(allTag);
        }
      }
    }

    this.setData({ selectedTags: newTags });
    this.updateSelectedCount(newTags);
  },

  confirmSelection() {
    const { selectedTags, directionsMap, allSubjects } = this.data;
    
    // Expand "Category:All" tags back to specific tags for storage
    let expandedTags = [];
    
    selectedTags.forEach(tag => {
      if (tag.endsWith(':All')) {
        const category = tag.split(':')[0];
        const directions = directionsMap[category] || [];
        expandedTags = [...expandedTags, ...directions];
      } else {
        expandedTags.push(tag);
      }
    });
    
    // Save selection
    wx.setStorageSync('userInterests_v2', expandedTags);
    
    // Redirect to home page
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
