// pages/tutor-library/tutor-library.js
Page({
  data: {
    filters: [
      { id: 'beijing', name: '北京', selected: false },
      { id: 'shanghai', name: '上海', selected: false },
      { id: 'guangzhou', name: '广州', selected: false },
      { id: 'shenzhen', name: '深圳', selected: false },
      { id: 'hangzhou', name: '杭州', selected: false },
      { id: 'chengdu', name: '成都', selected: false },
      { id: 'wuhan', name: '武汉', selected: false },
      { id: 'nanjing', name: '南京', selected: false }
    ],
    showCityFilter: false,
    allCities: [
      {
        title: "直辖市",
        cities: [
          { id: 'beijing', name: '北京' },
          { id: 'shanghai', name: '上海' },
          { id: 'tianjin', name: '天津' },
          { id: 'chongqing', name: '重庆' }
        ]
      },
      {
        title: "热门省份",
        cities: [
          { id: 'guangdong', name: '广东' },
          { id: 'jiangsu', name: '江苏' },
          { id: 'zhejiang', name: '浙江' },
          { id: 'sichuan', name: '四川' },
          { id: 'hubei', name: '湖北' },
          { id: 'shaanxi', name: '陕西' },
          { id: 'shandong', name: '山东' },
          { id: 'hunan', name: '湖南' }
        ]
      },
      {
        title: "其他地区",
        cities: [
          { id: 'anhui', name: '安徽' },
          { id: 'fujian', name: '福建' },
          { id: 'heilongjiang', name: '黑龙江' },
          { id: 'henan', name: '河南' },
          { id: 'jilin', name: '吉林' },
          { id: 'liaoning', name: '辽宁' },
          { id: 'hebei', name: '河北' },
          { id: 'jiangxi', name: '江西' }
        ]
      }
    ],
    schools: [
      {
        id: 1,
        name: '清华大学',
        location: '北京',
        locationId: 'beijing',
        tutorCount: 1256
      },
      {
        id: 2,
        name: '北京大学',
        location: '北京',
        locationId: 'beijing',
        tutorCount: 1189
      },
      {
        id: 3,
        name: '浙江大学',
        location: '浙江',
        locationId: 'hangzhou',
        tutorCount: 987
      },
      {
        id: 4,
        name: '上海交通大学',
        location: '上海',
        locationId: 'shanghai',
        tutorCount: 945
      },
      {
        id: 5,
        name: '复旦大学',
        location: '上海',
        locationId: 'shanghai',
        tutorCount: 876
      }
    ],
    departments: [
      { id: 1, name: '计算机学院' },
      { id: 2, name: '信息学院' },
      { id: 3, name: '电子工程学院' },
      { id: 4, name: '自动化学院' }
    ]
  },

  onLoad(options) {

  },

  onSelectFilter(e) {
    const id = e.currentTarget.dataset.id;
    // For this design, clicking a city tag might navigate to a filtered list or filter the current list.
    // Assuming it filters the list or navigates to search. For now, let's just log it.
    console.log('Selected city:', id);
    wx.navigateTo({
      url: `/pages/search/search?keyword=${e.currentTarget.dataset.name}&type=location`
    });
  },

  onSearch(e) {
    const keyword = e.detail.value;
    if (keyword) {
      wx.navigateTo({
        url: `/pages/search/search?keyword=${keyword}&type=school`
      });
    }
  },

  navigateToSchool(e) {
    const id = e.currentTarget.dataset.id;
    const school = this.data.schools.find(s => s.id === id);
    if (school) {
      wx.navigateTo({
        url: `/pages/search/search?keyword=${school.name}&type=school`
      });
    }
  },

  navigateToDepartment(e) {
    const name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/search/search?keyword=${name}&type=department`
    });
  },
  
  showMoreCities() {
    this.setData({ showCityFilter: true });
  },

  hideCityFilter() {
    this.setData({ showCityFilter: false });
  },

  onSelectCity(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    console.log('Selected city:', name);
    this.hideCityFilter();
    wx.navigateTo({
      url: `/pages/search/search?keyword=${name}&type=location`
    });
  }
})