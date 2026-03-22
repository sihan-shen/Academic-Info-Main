// pages/search-simple/search-simple.js
Page({
  data: {
    keyword: '',
    hotTags: [
      '清华大学', '人工智能', '机器视觉', '张明远',
      '北京大学', '大数据', '深度学习', '985博导'
    ]
  },

  onLoad(options) {
    if (options.keyword) {
      this.setData({ keyword: options.keyword });
    }
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  clearInput() {
    this.setData({ keyword: '' });
  },

  onSearch() {
    const keyword = this.data.keyword.trim();
    if (!keyword) return;
    
    // 跳转到结果页（也就是 search 页面，但带上 keyword）
    // search 页面默认就会根据 keyword 触发搜索并展示结果列表
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
    });
  },

  onTagTap(e) {
    const keyword = e.currentTarget.dataset.tag;
    this.setData({ keyword });
    this.onSearch();
  }
})