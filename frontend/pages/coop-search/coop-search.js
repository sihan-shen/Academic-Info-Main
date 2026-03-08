// pages/coop-search/coop-search.js

// Copying data maps from search.js
const CITY_SCHOOLS_MAP = {
  'beijing': [
    { label: '清华大学', value: 'tsinghua' },
    { label: '北京大学', value: 'pku' },
    { label: '中国人民大学', value: 'ruc' },
    { label: '北京航空航天大学', value: 'buaa' },
    { label: '北京理工大学', value: 'bit' },
    { label: '北京师范大学', value: 'bnu' },
  ],
  'shanghai': [
    { label: '复旦大学', value: 'fudan' },
    { label: '上海交通大学', value: 'sjtu' },
    { label: '同济大学', value: 'tongji' },
    { label: '华东师范大学', value: 'ecnu' },
    { label: '上海大学', value: 'shu' },
  ],
  'guangdong': [
    { label: '中山大学', value: 'sysu' },
    { label: '华南理工大学', value: 'scut' },
    { label: '暨南大学', value: 'jnu' },
    { label: '深圳大学', value: 'szu' },
    { label: '南方科技大学', value: 'sustech' },
  ],
  'jiangsu': [
    { label: '南京大学', value: 'nju' },
    { label: '东南大学', value: 'seu' },
    { label: '南京航空航天大学', value: 'nuaa' },
    { label: '南京理工大学', value: 'njust' },
    { label: '苏州大学', value: 'suda' },
  ],
  'zhejiang': [
    { label: '浙江大学', value: 'zju' },
    { label: '宁波大学', value: 'nbu' },
    { label: '浙江工业大学', value: 'zjut' },
  ],
  'sichuan': [
    { label: '四川大学', value: 'scu' },
    { label: '电子科技大学', value: 'uestc' },
    { label: '西南交通大学', value: 'swjtu' },
    { label: '西南财经大学', value: 'swufe' },
  ],
  'default': [
    { label: '清华大学', value: 'tsinghua' },
    { label: '北京大学', value: 'pku' },
    { label: '浙江大学', value: 'zju' },
    { label: '复旦大学', value: 'fudan' },
    { label: '上海交通大学', value: 'sjtu' },
    { label: '南京大学', value: 'nju' },
    { label: '中国科学技术大学', value: 'ustc' },
    { label: '哈尔滨工业大学', value: 'hit' },
    { label: '西安交通大学', value: 'xjtu' },
  ]
};

const SUBJECT_DIRECTIONS_MAP = {
  'cs': [
    '软件工程', '数据库', '操作系统', '计算机网络', 
    '网络安全', '云计算', '区块链', '人机交互',
    '计算机图形学', '嵌入式系统'
  ],
  'ai': [
    '机器学习', '深度学习', '计算机视觉', '自然语言处理', 
    '强化学习', '数据挖掘', '知识图谱', '智能机器人',
    '模式识别', '神经网络'
  ],
  'econ': [
    '宏观经济', '微观经济', '金融学', '国际贸易', 
    '计量经济学', '发展经济学', '劳动经济学', '产业经济学'
  ],
  'phy': [
    '量子力学', '凝聚态物理', '粒子物理', '天体物理', 
    '光学', '声学', '等离子体物理', '力学'
  ],
  'chem': [
    '有机化学', '无机化学', '物理化学', '分析化学', 
    '高分子化学', '环境化学', '材料化学'
  ],
  'bio': [
    '分子生物学', '细胞生物学', '遗传学', '神经生物学', 
    '微生物学', '生物化学', '生态学', '生物信息学'
  ],
  'default': [
    '机器学习', '深度学习', '计算机视觉', '自然语言处理', 
    '软件工程', '数据库', '云计算', '区块链',
    '宏观经济', '微观经济', '金融学', '国际贸易',
    '量子力学', '凝聚态物理', '粒子物理',
    '有机化学', '无机化学', '物理化学',
    '分子生物学', '细胞生物学', '遗传学'
  ]
};

Page({
  data: {
    keyword: '',
    totalCount: 328, 
    searchMode: 'filter',
    uploadedFile: null,
    
    // --- Complex Filters (City/School, Subject/Direction) ---
    
    // 所在省市 (City)
    cityConfig: {
      searchText: '',
      showDropdown: false,
      selected: null,
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' },
        { label: '江苏', value: 'jiangsu' },
        { label: '浙江', value: 'zhejiang' },
        { label: '四川', value: 'sichuan' },
      ],
      filteredOptions: []
    },

    // 所属院校 (School)
    schoolConfig: {
      searchText: '',
      showDropdown: false,
      selected: [], 
      options: [],
      filteredOptions: []
    },

    // 学科领域 (Subject)
    subjectConfig: {
      searchText: '',
      showDropdown: false,
      selected: null, 
      options: [
        { label: '计算机科学', value: 'cs' },
        { label: '人工智能', value: 'ai' },
        { label: '经济学', value: 'econ' },
        { label: '物理学', value: 'phy' },
        { label: '化学', value: 'chem' },
        { label: '生物学', value: 'bio' },
      ],
      filteredOptions: []
    },

    // 研究方向 (Direction)
    directionConfig: {
      searchText: '',
      showDropdown: false,
      selected: [], 
      options: [],
      filteredOptions: []
    },

    // Hot Lists
    hotSchools: [
      { label: '清华大学', value: 'tsinghua' },
      { label: '北京大学', value: 'pku' },
      { label: '浙江大学', value: 'zju' },
      { label: '复旦大学', value: 'fudan' },
      { label: '上海交通大学', value: 'sjtu' },
    ],

    hotDirections: [
      { label: '机器学习', value: '机器学习' },
      { label: '深度学习', value: '深度学习' },
      { label: '计算机视觉', value: '计算机视觉' },
      { label: '宏观经济', value: '宏观经济' },
      { label: '金融学', value: '金融学' },
    ],

    // Simple Filters (Remaining groups)
    // Removing 'field' and 'region' as they are now complex filters
    filterData: {
      groups: [
        {
          title: '导师职称',
          key: 'tutor_title',
          options: [
            { label: '全部', value: '', selected: true },
            { label: '院士', value: 'academician', selected: false },
            { label: '杰青', value: 'jieqing', selected: false },
            { label: '优青', value: 'youqing', selected: false },
            { label: '长江学者', value: 'changjiang', selected: false },
            { label: '教授', value: 'professor', selected: false },
            { label: '副教授', value: 'associate_professor', selected: false },
          ]
        }
      ]
    }
  },

  onLoad(options) {
    this.initCitySchoolData();
    this.initSubjectDirectionData();
    this.updateTotalCount();
  },

  initCitySchoolData() {
    const { cityConfig, schoolConfig } = this.data;
    cityConfig.filteredOptions = cityConfig.options;
    const defaultSchools = CITY_SCHOOLS_MAP['default'];
    schoolConfig.options = defaultSchools;
    schoolConfig.filteredOptions = defaultSchools;
    this.setData({ cityConfig, schoolConfig });
  },

  initSubjectDirectionData() {
    const { subjectConfig, directionConfig } = this.data;
    subjectConfig.filteredOptions = subjectConfig.options;
    const defaultDirections = SUBJECT_DIRECTIONS_MAP['default'].map(d => ({ label: d, value: d }));
    directionConfig.options = defaultDirections;
    directionConfig.filteredOptions = defaultDirections;
    this.setData({ subjectConfig, directionConfig });
  },

  // ---------------- UI Helpers ----------------
  
  closeDropdowns() {
    this.setData({
      'cityConfig.showDropdown': false,
      'schoolConfig.showDropdown': false,
      'subjectConfig.showDropdown': false,
      'directionConfig.showDropdown': false
    });
  },
  
  doNothing() {},

  // ---------------- City Filter ----------------

  toggleCityDropdown(e) {
    this.setData({
      'cityConfig.showDropdown': true,
      'schoolConfig.showDropdown': false,
      'subjectConfig.showDropdown': false,
      'directionConfig.showDropdown': false
    });
  },

  onCityInput(e) {
    const val = e.detail.value;
    const { cityConfig } = this.data;
    const filtered = cityConfig.options.filter(opt => opt.label.includes(val));
    this.setData({
      'cityConfig.searchText': val,
      'cityConfig.filteredOptions': filtered,
      'cityConfig.showDropdown': true
    });
  },

  selectCity(e) {
    const { item } = e.currentTarget.dataset;
    const { cityConfig, schoolConfig } = this.data;
    
    const newCityConfig = {
      ...cityConfig,
      selected: item,
      searchText: item.label,
      showDropdown: false
    };

    const schoolList = CITY_SCHOOLS_MAP[item.value] || CITY_SCHOOLS_MAP['default'];
    const newSchoolConfig = {
      ...schoolConfig,
      options: schoolList,
      filteredOptions: schoolList,
      selected: schoolConfig.selected, // Preserve selection
      searchText: ''
    };

    this.setData({
      cityConfig: newCityConfig,
      schoolConfig: newSchoolConfig
    });
    this.updateTotalCount();
  },

  // ---------------- School Filter ----------------

  toggleSchoolDropdown(e) {
    this.setData({
      'schoolConfig.showDropdown': true,
      'cityConfig.showDropdown': false,
      'subjectConfig.showDropdown': false,
      'directionConfig.showDropdown': false
    });
  },

  onSchoolInput(e) {
    const val = e.detail.value;
    const { schoolConfig } = this.data;
    const filtered = schoolConfig.options.filter(opt => opt.label.includes(val));
    this.setData({
      'schoolConfig.searchText': val,
      'schoolConfig.filteredOptions': filtered,
      'schoolConfig.showDropdown': true
    });
  },

  toggleSchoolSelect(e) {
    const { item } = e.currentTarget.dataset;
    const { schoolConfig } = this.data;
    let selected = [...schoolConfig.selected];
    
    const idx = selected.findIndex(s => s.value === item.value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(item);
    }

    this.setData({
      'schoolConfig.selected': selected
    });
    this.updateTotalCount();
  },

  toggleSelectAllSchools() {
    const { schoolConfig } = this.data;
    const currentOptions = schoolConfig.filteredOptions;
    const isAllSelected = currentOptions.length > 0 && currentOptions.every(opt => 
      schoolConfig.selected.some(s => s.value === opt.value)
    );

    let newSelected = [...schoolConfig.selected];
    if (isAllSelected) {
      newSelected = newSelected.filter(s => !currentOptions.some(opt => opt.value === s.value));
    } else {
      currentOptions.forEach(opt => {
        if (!newSelected.some(s => s.value === opt.value)) {
          newSelected.push(opt);
        }
      });
    }

    this.setData({
      'schoolConfig.selected': newSelected
    });
    this.updateTotalCount();
  },

  // ---------------- Subject Filter ----------------

  toggleSubjectDropdown(e) {
    this.setData({
      'subjectConfig.showDropdown': true,
      'directionConfig.showDropdown': false,
      'cityConfig.showDropdown': false,
      'schoolConfig.showDropdown': false
    });
  },

  onSubjectInput(e) {
    const val = e.detail.value;
    const { subjectConfig } = this.data;
    const filtered = subjectConfig.options.filter(opt => opt.label.includes(val));
    this.setData({
      'subjectConfig.searchText': val,
      'subjectConfig.filteredOptions': filtered,
      'subjectConfig.showDropdown': true
    });
  },

  selectSubject(e) {
    const { item } = e.currentTarget.dataset;
    const { subjectConfig, directionConfig } = this.data;
    
    const newSubjectConfig = {
      ...subjectConfig,
      selected: item,
      searchText: item.label,
      showDropdown: false
    };

    const rawDirections = SUBJECT_DIRECTIONS_MAP[item.value] || SUBJECT_DIRECTIONS_MAP['default'];
    const directionOptions = rawDirections.map(d => ({ label: d, value: d }));

    const newDirectionConfig = {
      ...directionConfig,
      options: directionOptions,
      filteredOptions: directionOptions,
      selected: directionConfig.selected, 
      searchText: ''
    };

    this.setData({
      subjectConfig: newSubjectConfig,
      directionConfig: newDirectionConfig
    });
    this.updateTotalCount();
  },

  // ---------------- Direction Filter ----------------

  toggleDirectionDropdown(e) {
    this.setData({
      'directionConfig.showDropdown': true,
      'subjectConfig.showDropdown': false,
      'cityConfig.showDropdown': false,
      'schoolConfig.showDropdown': false
    });
  },

  onDirectionInput(e) {
    const val = e.detail.value;
    const { directionConfig } = this.data;
    const filtered = directionConfig.options.filter(opt => opt.label.includes(val));
    this.setData({
      'directionConfig.searchText': val,
      'directionConfig.filteredOptions': filtered,
      'directionConfig.showDropdown': true
    });
  },

  toggleDirectionSelect(e) {
    const { item } = e.currentTarget.dataset;
    const { directionConfig } = this.data;
    let selected = [...directionConfig.selected];
    
    const idx = selected.findIndex(s => s.value === item.value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(item);
    }

    this.setData({
      'directionConfig.selected': selected
    });
    this.updateTotalCount();
  },

  toggleSelectAllDirections() {
    const { directionConfig } = this.data;
    const currentOptions = directionConfig.filteredOptions;
    const isAllSelected = currentOptions.length > 0 && currentOptions.every(opt => 
      directionConfig.selected.some(s => s.value === opt.value)
    );

    let newSelected = [...directionConfig.selected];
    if (isAllSelected) {
      newSelected = newSelected.filter(s => !currentOptions.some(opt => opt.value === s.value));
    } else {
      currentOptions.forEach(opt => {
        if (!newSelected.some(s => s.value === opt.value)) {
          newSelected.push(opt);
        }
      });
    }

    this.setData({
      'directionConfig.selected': newSelected
    });
    this.updateTotalCount();
  },

  // ---------------- General Filter Logic ----------------

  selectGroupOption(e) {
    const { groupIndex, optionIndex } = e.currentTarget.dataset;
    const filterData = this.data.filterData;
    const group = filterData.groups[groupIndex];
    const option = group.options[optionIndex];
    
    if (option.value === '') {
      if (option.selected) return;
      group.options.forEach(opt => opt.selected = false);
      option.selected = true;
    } else {
      if (option.selected) {
        option.selected = false;
        group.options[0].selected = true; 
      } else {
        group.options.forEach(opt => opt.selected = false);
        option.selected = true;
      }
    }
    
    this.setData({
      filterData: filterData
    });
    this.updateTotalCount();
  },

  updateTotalCount() {
    const base = 50;
    const random = Math.floor(Math.random() * 300);
    this.setData({
      totalCount: base + random
    });
  },

  confirmFilter() {
    wx.showLoading({ title: '匹配中...', mask: true });
    
    // Collect complex filters if needed, but here we just navigate
    const filters = {};
    // ... logic to collect filters ...
    
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/coop-opportunities/coop-opportunities'
      });
    }, 500);
  }
});
