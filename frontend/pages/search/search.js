// pages/search/search.js

const apiConfig = require('../../config/api.js');

// 院校数据映射表
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

// 学科 -> 研究方向 映射表
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
    totalCount: 0,
    coopCount: 0,
    showResults: false,
    searchMode: 'filter',
    
    // 省市筛选配置 (单选)
    cityConfig: {
      searchText: '',
      showDropdown: false,
      selected: null, // {label, value}
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

    // 院校筛选配置 (多选)
    schoolConfig: {
      searchText: '',
      showDropdown: false,
      selected: [], // Array of {label, value}
      options: [],
      filteredOptions: []
    },

    // 学科筛选配置 (单选)
    subjectConfig: {
      searchText: '',
      showDropdown: false,
      selected: null, // {label, value}
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

    // 研究方向筛选配置 (多选)
    directionConfig: {
      searchText: '',
      showDropdown: false,
      selected: [], // Array of {label, value}
      options: [],
      filteredOptions: []
    },

    // 热门院校
    hotSchools: [
      { label: '清华大学', value: 'tsinghua' },
      { label: '北京大学', value: 'pku' },
      { label: '浙江大学', value: 'zju' },
      { label: '复旦大学', value: 'fudan' },
      { label: '上海交通大学', value: 'sjtu' },
    ],

    // 热门方向
    hotDirections: [
      { label: '机器学习', value: '机器学习' },
      { label: '深度学习', value: '深度学习' },
      { label: '计算机视觉', value: '计算机视觉' },
      { label: '宏观经济', value: '宏观经济' },
      { label: '金融学', value: '金融学' },
    ],

    // 其他筛选分组 (已移除 Subject 和 Direction)
    filterGroups: [
      {
        title: '职称',
        key: 'title',
        options: [
          { label: '全部', value: '', selected: true },
          { label: '教授', value: 'prof', selected: false },
          { label: '副教授', value: 'assoc', selected: false },
          { label: '讲师', value: 'lec', selected: false },
          { label: '研究员', value: 'res', selected: false },
        ]
      },
      {
        title: '招生类型',
        key: 'recruit',
        options: [
          { label: '全部', value: '', selected: true },
          { label: '硕士', value: 'master', selected: false },
          { label: '博士', value: 'phd', selected: false },
          { label: '博士后', value: 'postdoc', selected: false },
        ]
      },
      {
        title: '学术偏好',
        key: 'preference',
        options: [
          { label: '全部', value: '', selected: true },
          { label: '跨校合作', value: 'cross_school', selected: false },
          { label: '高产出学者', value: 'high_yield', selected: false },
          { label: '青年学者', value: 'young', selected: false },
        ]
      }
    ],

    currentPage: 1,
    pageSize: 10,
    tutorList: [],
    isLoading: false,
    hasMore: true,
    totalCount: 0
  },

  // 从后端获取导师列表
  fetchTutorList(isRefresh = true) {
    if (this.data.isLoading) return;
    
    this.setData({ isLoading: true });
    
    const { currentPage, pageSize, keyword } = this.data;
    const page = isRefresh ? 1 : currentPage;
    
    // 构建筛选参数
    const params = {
      page: page,
      page_size: pageSize
    };
    
    if (keyword) {
      params.keyword = keyword;
    }
    
    // 添加城市筛选
    const { cityConfig } = this.data;
    if (cityConfig.selected) {
      params.city = cityConfig.selected.label;
    }
    
    // 添加学校筛选
    const { schoolConfig } = this.data;
    if (schoolConfig.selected && schoolConfig.selected.length > 0) {
      params.school = schoolConfig.selected.map(s => s.label).join(',');
    }
    
    if (apiConfig.DEBUG) {
      console.log('[Search] 获取导师列表, 参数:', params);
    }
    
    // 构建查询字符串
    const queryString = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/tutor/list?${queryString}`,
      method: 'GET',
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.success) {
          const result = res.data.data;
          const newTutors = (result.list || []).map(tutor => ({
            id: tutor.id,
            name: tutor.name,
            avatar: tutor.avatar || '/images/default-avatar.png',
            school: tutor.school || '',
            department: tutor.department || '',
            direction: tutor.research_direction || '',
            desc: tutor.bio || `${tutor.school} ${tutor.department}`,
            tags: tutor.tags || [],
            titleTag: tutor.title || ''
          }));
          
          this.setData({
            tutorList: isRefresh ? newTutors : [...this.data.tutorList, ...newTutors],
            totalCount: result.total || 0,
            currentPage: page + 1,
            hasMore: newTutors.length === pageSize
          });
          
          if (apiConfig.DEBUG) {
            console.log('[Search] 获取成功, 共', result.total, '条');
          }
        } else {
          console.warn('[Search] 获取失败:', res.data);
          if (isRefresh) {
            this.setData({ tutorList: [], totalCount: 0 });
          }
        }
      },
      fail: (err) => {
        console.error('[Search] 请求失败:', err);
        wx.showToast({
          title: '无法连接服务器，请检查后端是否启动',
          icon: 'none',
          duration: 3000
        });
        if (isRefresh) {
          this.setData({ tutorList: [], totalCount: 0 });
        }
      },
      complete: () => {
        this.setData({ isLoading: false });
        wx.hideLoading();
      }
    });
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.fetchTutorList(false);
    }
  },

  onLoad(options) {
    this.initCitySchoolData();
    this.initSubjectDirectionData();
    
    // 获取导师统计数据
    this.fetchTutorStats();

    if (options.keyword) {
      this.setData({ 
        keyword: options.keyword,
        searchMode: 'result',
        showResults: true
      });
      this.fetchTutorList(true);
    }
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
    // Map string array to object array {label: 'xx', value: 'xx'}
    const defaultDirections = SUBJECT_DIRECTIONS_MAP['default'].map(d => ({ label: d, value: d }));
    directionConfig.options = defaultDirections;
    directionConfig.filteredOptions = defaultDirections;
    this.setData({ subjectConfig, directionConfig });
  },

  onSearchConfirm(e) {
    const keyword = e.detail?.value || this.data.keyword;
    this.setData({ 
      keyword,
      searchMode: 'result',
      showResults: true,
      currentPage: 1,
      hasMore: true
    });
    this.fetchTutorList(true);
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
    const { cityConfig } = this.data;
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
      selected: [],
      searchText: ''
    };

    this.setData({
      cityConfig: newCityConfig,
      schoolConfig: newSchoolConfig
    });
    
    // 如果已经在结果页，重新搜索
    if (this.data.showResults) {
      this.setData({ currentPage: 1, hasMore: true });
      this.fetchTutorList(true);
    }
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
  },

  toggleSelectAllSchools() {
    const { schoolConfig } = this.data;
    const currentOptions = schoolConfig.filteredOptions;
    
    const isAllSelected = currentOptions.length > 0 && currentOptions.every(opt => 
      schoolConfig.selected.some(s => s.value === opt.value)
    );

    let newSelected = [...schoolConfig.selected];

    if (isAllSelected) {
      newSelected = newSelected.filter(s => 
        !currentOptions.some(opt => opt.value === s.value)
      );
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

    // Update Directions
    const rawDirections = SUBJECT_DIRECTIONS_MAP[item.value] || SUBJECT_DIRECTIONS_MAP['default'];
    const directionOptions = rawDirections.map(d => ({ label: d, value: d }));

    const newDirectionConfig = {
      ...directionConfig,
      options: directionOptions,
      filteredOptions: directionOptions,
      // For Subject/Direction, changing subject usually invalidates direction selection 
      // because directions are specific to subjects (mostly). 
      // But unlike schools, some directions might overlap?
      // Let's clear for safety/logic correctness unless user specified otherwise.
      // User said "Like City/School", and for City/School they asked to KEEP selection.
      // However, "Machine Learning" under "CS" is same as "Machine Learning" under "AI".
      // If I clear, user loses selection. If I keep, it might be fine if value matches.
      selected: directionConfig.selected, 
      searchText: ''
    };

    this.setData({
      subjectConfig: newSubjectConfig,
      directionConfig: newDirectionConfig
    });
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
  },

  toggleSelectAllDirections() {
    const { directionConfig } = this.data;
    const currentOptions = directionConfig.filteredOptions;
    
    const isAllSelected = currentOptions.length > 0 && currentOptions.every(opt => 
      directionConfig.selected.some(s => s.value === opt.value)
    );

    let newSelected = [...directionConfig.selected];

    if (isAllSelected) {
      newSelected = newSelected.filter(s => 
        !currentOptions.some(opt => opt.value === s.value)
      );
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
  },


  // ---------------- General Filter Logic ----------------

  selectGroupOption(e) {
    const { groupIndex, optionIndex } = e.currentTarget.dataset;
    const filterGroups = this.data.filterGroups;
    const group = filterGroups[groupIndex];
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
    
    this.setData({ filterGroups });
  },

  resetFilter() {
    // Reset groups
    const filterGroups = this.data.filterGroups;
    filterGroups.forEach(group => {
      group.options.forEach(opt => opt.selected = false);
      group.options[0].selected = true;
    });

    // Reset City/School
    const defaultSchools = CITY_SCHOOLS_MAP['default'];
    this.setData({
      'cityConfig.selected': null,
      'cityConfig.searchText': '',
      'cityConfig.filteredOptions': this.data.cityConfig.options,
      'schoolConfig.options': defaultSchools,
      'schoolConfig.filteredOptions': defaultSchools,
      'schoolConfig.selected': [],
      'schoolConfig.searchText': ''
    });

    // Reset Subject/Direction
    const defaultDirections = SUBJECT_DIRECTIONS_MAP['default'].map(d => ({ label: d, value: d }));
    this.setData({
      'subjectConfig.selected': null,
      'subjectConfig.searchText': '',
      'subjectConfig.filteredOptions': this.data.subjectConfig.options,
      'directionConfig.options': defaultDirections,
      'directionConfig.filteredOptions': defaultDirections,
      'directionConfig.selected': [],
      'directionConfig.searchText': ''
    });

    this.setData({ filterGroups });
  },

  openFilter() {
    this.setData({ showResults: false, searchMode: 'filter' });
  },

  confirmFilter() {
    this.setData({ showResults: true, searchMode: 'result' });
    // 重置分页并搜索
    this.setData({
      currentPage: 1,
      hasMore: true
    });
    this.fetchTutorList(true);
  },

  doSearch() {
    // 重置分页并重新获取数据
    this.setData({
      currentPage: 1,
      hasMore: true
    });
    this.fetchTutorList(true);
  },

  // 获取导师统计数据
  fetchTutorStats() {
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/tutor/stats`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data && res.data.success) {
          const stats = res.data.data;
          this.setData({
            totalCount: stats.total_tutors || 0,
            coopCount: stats.total_coops || 0
          });
          if (apiConfig.DEBUG) {
            console.log('[Search] 获取统计数据成功:', stats);
          }
        } else {
          console.warn('[Search] 获取统计数据失败:', res.data);
        }
      },
      fail: (err) => {
        console.error('[Search] 获取统计数据失败:', err);
      }
    });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/tutor-detail/tutor-detail?id=${id}`
    });
  }
});
