// pages/tutor-detail/tutor-detail.js
const apiConfig = require('../../config/api.js');

Page({
  data: {
    activeTab: 0,
    networkNodes: [],
    networkEdges: [],
    networkLines: [],
    networkCurves: [],
    networkLoading: false,
    centerNode: null,
    centerAnim: '',
    collaboratorNodes: [],
    collaboratorsList: [],
    showTooltip: false,
    tooltipX: 0,
    tooltipY: 0,
    tooltipData: {},
    isNetworkExpanded: false,
    expandedNetworkCurves: [],
    expandedCollaboratorNodes: [],
    tabs: ['个人简介', '社会关系', '成长脉络', '学术成果', '合作资源', '学生培养', '项目', '风险排查'],
    tabAnchors: ['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6', 'section-7'],
    isSticky: false,
    headerHeight: 0,
    isCollected: false,
    isLoading: false,
    tutor: null
  },

  onLoad(options) {
    this.tutorIdFromRoute = options.id || null;
    this.sectionTops = [];
    this.isAutoScrolling = false;
    this.autoScrollTimer = null;
    this.sectionAnchorIds = this.data.tabAnchors.slice();
    this.windowHeight = 0;
    try {
        const sys = wx.getSystemInfoSync();
        this.windowHeight = sys.windowHeight;
    } catch (e) {
        this.windowHeight = 600; // Fallback
    }

    // 从后端获取导师详情 - 使用真实的后端API
    if (options.id) {
      this.fetchTutorDetail(options.id);
    } else {
      // 如果没有ID，显示空状态
      this.setData({
        tutor: {
          name: '导师不存在',
          bio: '请从搜索页面选择有效的导师',
          avatar: '/images/default-avatar.png'
        }
      });
    }
  },

  // 获取导师详情
  fetchTutorDetail(tutorId) {
    if (!tutorId || !apiConfig.BASE_URL) {
      return;
    }

    this.setData({ isLoading: true });

    if (apiConfig.DEBUG) {
      console.log('[Tutor] 获取导师详情, id:', tutorId);
    }

    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/tutor/detail/${tutorId}`,
      method: 'GET',
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.success && res.data.data) {
          const tutor = res.data.data;
          
          // 格式化导师数据以适应页面显示
          const formattedTutor = {
            id: tutor.id,
            name: tutor.name,
            avatar: tutor.avatar || '/images/default-avatar.png',
            school: tutor.school || '',
            department: tutor.department || '',
            tags: tutor.tags || [],
            bio: tutor.bio || '',
            direction: tutor.research_direction || '',
            achievements: tutor.achievements_summary || '',
            service: tutor.service || '',
            guidance: tutor.guidance || '',
            papers: tutor.papers || [],
            projects: tutor.projects || [],
            coops: tutor.coops || [],
            students: tutor.students || [],
            risks: tutor.risks || [],
            socials: tutor.socials || [],
            growthPath: tutor.growthPath || []
          };

          this.setData({ 
            tutor: formattedTutor,
            isLoading: false
          }, () => {
            this.resetSectionTops();
          });

          // 获取图谱数据
          this.fetchNetworkGraph(tutorId);
        } else {
          console.warn('[Tutor] 获取导师详情失败:', res.data);
          this.setData({ isLoading: false });
        }
      },
      fail: (err) => {
        console.error('[Tutor] 获取导师详情失败:', err);
        this.setData({ isLoading: false });
      }
    });
  },

  fetchNetworkGraph(tutorId) {
    if (!tutorId) {
      this.setData({ networkLoading: false });
      return;
    }
    
    this.setData({ networkLoading: true });
    
    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/tutor/network/${tutorId}`,
      method: 'GET',
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.success && res.data.data) {
          const d = res.data.data;
          const center = d.center;
          const collaborators = d.collaborators || [];
          
          if (collaborators.length > 0) {
            // 处理节点数据 - 现代专业版布局
            const processedData = this.processNetworkLayout(center, collaborators);
            
            this.setData({
              centerNode: processedData.center,
              centerAnim: 'anim-enter',
              collaboratorNodes: processedData.collaborators,
              networkCurves: processedData.curves,
              networkLines: processedData.lines,
              networkNodes: [processedData.center, ...processedData.collaborators],
              collaboratorsList: collaborators,
              networkLoading: false,
              showTooltip: false,
              tooltipData: {}
            });
          } else {
            this.setData({
              centerNode: null,
              collaboratorNodes: [],
              networkLines: [],
              networkNodes: [],
              collaboratorsList: [],
              networkLoading: false
            });
          }
        } else {
          console.warn('[Network] 无有效数据:', res.data);
          this.setData({ networkLoading: false });
        }
      },
      fail: (err) => {
        console.error('[Network] 请求失败:', err);
        this.setData({ networkLoading: false });
      }
    });
  },

  // 处理网络布局 - 现代专业版
  processNetworkLayout(center, collaborators) {
    const count = collaborators.length;
    const positions = this.calculateNodePositions(count);
    
    // 为合作者分配位置、颜色和动画类
    const colorClasses = ['peer-indigo', 'peer-violet', 'peer-blue', 'peer-cyan', 'peer-teal'];
    const positionedCollaborators = collaborators.map((c, i) => ({
      ...c,
      pos: positions[i] || { x: 50, y: 50 },
      colorClass: colorClasses[i % colorClasses.length],
      animClass: `anim-delay-${i % 5}`
    }));
    
    // 计算连接线（CSS直线）
    const curves = positionedCollaborators.map(c => {
      const line = this.calculateConnectionLine(50, 50, c.pos.x, c.pos.y);
      return {
        x1: line.x1,
        y1: line.y1,
        length: line.length,
        angle: line.angle,
        targetId: c.id
      };
    });
    
    // 同时保留直线数据用于备用
    const lines = positionedCollaborators.map(c => {
      const dx = c.pos.x - 50;
      const dy = c.pos.y - 50;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      return {
        length: distance,
        angle: angle,
        targetId: c.id
      };
    });
    
    return {
      center: {
        id: center.id,
        name: center.name,
        avatar: center.avatar,
        school: center.school,
        type: 'center'
      },
      collaborators: positionedCollaborators,
      curves: curves,
      lines: lines
    };
  },

  // 计算连接线（使用CSS直线，从中心到合作者）
  calculateConnectionLine(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    return {
      x1: x1,
      y1: y1,
      length: length,
      angle: angle
    };
  },

  // 计算节点位置 - 优化布局，增加间距
  calculateNodePositions(count) {
    const positions = [];

    if (count === 1) {
      positions.push({ x: 78, y: 50 });
    } else if (count === 2) {
      // 水平对称，更大间距
      positions.push({ x: 15, y: 50 });
      positions.push({ x: 85, y: 50 });
    } else if (count === 3) {
      // 三角布局，更分散
      positions.push({ x: 50, y: 12 });
      positions.push({ x: 16, y: 82 });
      positions.push({ x: 84, y: 82 });
    } else if (count === 4) {
      // 四角布局，更靠边缘
      positions.push({ x: 50, y: 10 });
      positions.push({ x: 90, y: 50 });
      positions.push({ x: 50, y: 90 });
      positions.push({ x: 10, y: 50 });
    } else if (count === 5) {
      // 五角星布局，增大半径
      const radius = 38;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    } else if (count === 6) {
      // 6个节点，均匀分布
      const radius = 38;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    } else if (count <= 8) {
      // 7-8个节点，增大半径
      const radius = 39;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    } else {
      // 8+个节点，最大半径
      const radius = 40;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    }

    return positions;
  },

  // 节点长按显示详情 tooltip
  onNodeLongPress(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    
    // 获取触摸位置
    const touch = e.touches[0];
    const tooltipX = touch.clientX - 80;
    const tooltipY = touch.clientY - 100;
    
    if (type === 'center') {
      this.setData({
        showTooltip: true,
        tooltipX: tooltipX,
        tooltipY: tooltipY,
        tooltipData: {
          name: this.data.centerNode?.name || '导师',
          papers: this.data.centerNode?.papers || '多篇',
          projects: '点击查看详情',
          years: ''
        }
      });
    } else if (index !== undefined) {
      const collaborator = this.data.collaboratorNodes[index];
      if (collaborator) {
        this.setData({
          showTooltip: true,
          tooltipX: tooltipX,
          tooltipY: tooltipY,
          tooltipData: {
            name: collaborator.name,
            papers: collaborator.papers || 0,
            projects: Array.isArray(collaborator.projects) ? collaborator.projects.length : 0,
            years: '2020-2024'
          }
        });
      }
    }
    
    // 3秒后隐藏
    setTimeout(() => {
      this.setData({ showTooltip: false });
    }, 3000);
  },

  // 点击图谱空白处展开
  onNetworkBackgroundTap(e) {
    // 如果点击的是节点，不触发背景点击
    if (e.target.dataset.type || e.target.dataset.id) {
      return;
    }
    
    // 展开网络图谱
    this.expandNetwork();
  },

  // 展开网络图谱详情
  expandNetwork() {
    const { networkCurves, collaboratorNodes, collaboratorsList } = this.data;
    
    // 为展开视图计算更大的布局
    const expandedNodes = collaboratorNodes.map((node, index) => ({
      ...node,
      pos: this.calculateExpandedPosition(index, collaboratorNodes.length)
    }));
    
    // 重新计算展开视图的连接线
    const expandedCurves = expandedNodes.map(c => {
      const line = this.calculateConnectionLine(50, 50, c.pos.x, c.pos.y);
      return {
        x1: line.x1,
        y1: line.y1,
        length: line.length,
        angle: line.angle
      };
    });
    
    this.setData({
      isNetworkExpanded: true,
      expandedNetworkCurves: expandedCurves,
      expandedCollaboratorNodes: expandedNodes
    });
    
    wx.showToast({
      title: '查看合作详情',
      icon: 'none',
      duration: 1500
    });
  },

  // 计算展开视图的位置（更大更分散的布局）
  calculateExpandedPosition(index, total) {
    const positions = [];

    if (total === 1) {
      positions.push({ x: 78, y: 50 });
    } else if (total === 2) {
      // 左右更分散
      positions.push({ x: 10, y: 50 });
      positions.push({ x: 90, y: 50 });
    } else if (total === 3) {
      // 三角分布，更靠边缘
      positions.push({ x: 50, y: 8 });
      positions.push({ x: 12, y: 86 });
      positions.push({ x: 88, y: 86 });
    } else if (total === 4) {
      // 四角分布，更大间距
      positions.push({ x: 50, y: 6 });
      positions.push({ x: 94, y: 50 });
      positions.push({ x: 50, y: 94 });
      positions.push({ x: 6, y: 50 });
    } else if (total === 5) {
      // 五角分布，更大半径
      const radius = 44;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    } else if (total === 6) {
      // 6个节点
      const radius = 44;
      for (let i = 0; i < total; i++) {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    } else if (total <= 8) {
      // 7-8个节点
      const radius = 45;
      for (let i = 0; i < total; i++) {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    } else {
      // 8+个节点，最大分布
      const radius = 46;
      for (let i = 0; i < total; i++) {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        positions.push({
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        });
      }
    }

    return positions[index] || { x: 50, y: 50 };
  },

  // 关闭展开的图谱
  onCloseExpandedNetwork() {
    this.setData({
      isNetworkExpanded: false
    });
  },

  // 阻止事件冒泡（点击容器不关闭）
  onExpandedContainerTap(e) {
    e.stopPropagation();
  },

  // 点击展开视图中的节点
  onExpandedNodeTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      // 先关闭展开视图
      this.setData({ isNetworkExpanded: false });
      
      // 跳转到导师详情
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/tutor-detail/tutor-detail?id=${id}`
        });
      }, 300);
    }
  },

  onGraphNodeTap(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    
    // 点击中心节点不跳转，只提示
    if (type === 'center') {
      wx.showToast({
        title: '当前导师',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    
    // 点击合作者节点跳转
    if (id && id !== this.data.tutor?.id) {
      wx.navigateTo({
        url: `/pages/tutor-detail/tutor-detail?id=${id}`,
        success: () => {
          console.log('[Network] 跳转到导师:', id);
        },
        fail: (err) => {
          console.error('[Network] 跳转失败:', err);
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },

  onReady() {
    this.measureHeaderHeight();
    this.resetSectionTops();
    // Re-calculate after a delay to ensure layout stability (e.g. font loading, images)
    setTimeout(() => {
        this.measureHeaderHeight();
        this.resetSectionTops();
    }, 1000);
  },

  measureHeaderHeight() {
    const query = this.createSelectorQuery();
    query.select('.tutor-header').boundingClientRect((rect) => {
        if (rect) {
            this.setData({ headerHeight: rect.height });
        }
    }).exec();
  },

  onTabClick(e) {
    const index = parseInt(e.currentTarget.dataset.index, 10);
    this.isAutoScrolling = true;
    
    // Dynamic calculation of 90rpx in px
    const sys = wx.getSystemInfoSync();
    const tabsHeight = (sys.windowWidth / 750) * 90;
      
    if (this.sectionTops && this.sectionTops[index] !== undefined) {
        // sectionTops are absolute tops.
        const targetTop = Math.max(0, this.sectionTops[index] - tabsHeight + 2); // +2 for slight visual breathing room

        this.setData({ activeTab: index });
        
        wx.vibrateShort({ type: 'light' }); // Haptic feedback

        wx.pageScrollTo({
            scrollTop: targetTop,
            duration: 300
        });
    }

    clearTimeout(this.autoScrollTimer);
    this.autoScrollTimer = setTimeout(() => {
      this.isAutoScrolling = false;
    }, 600);
  },

  onPageScroll(e) {
    const scrollTop = e.scrollTop || 0;

    // Sticky Check
    if (scrollTop >= this.data.headerHeight && !this.data.isSticky) {
      this.setData({ isSticky: true });
    } else if (scrollTop < this.data.headerHeight && this.data.isSticky) {
      this.setData({ isSticky: false });
    }

    if (this.isAutoScrolling) {
      return;
    }

    if (!this.sectionTops || this.sectionTops.length === 0) {
      this.calculateSectionTops();
      return;
    }

    // 激活线：视口顶部 + 偏移。板块顶部一旦越过此线即视为进入该板块，切换标签
    // 这里的偏移量决定了切换的灵敏度。设大一点可以提前切换。
    // 使用屏幕高度的 60% 作为触发点，确保在板块进入视野中部时切换
    const activationOffset = this.windowHeight ? (this.windowHeight * 0.6) : 400;
    const activationLine = scrollTop + activationOffset;

    // 当前活跃 = 满足「板块顶 <= 激活线」的最大索引（即已进入的最后一个板块）
    let activeIndex = 0;
    for (let i = this.sectionTops.length - 1; i >= 0; i -= 1) {
      if (this.sectionTops[i] <= activationLine) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex !== this.data.activeTab) {
      this.setData({ activeTab: activeIndex });
    }
  },

  resetSectionTops() {
    this.sectionTops = [];
    const run = () => {
      this.calculateSectionTops();
    };
    wx.nextTick(run);
  },

  calculateSectionTops() {
    const query = this.createSelectorQuery();
    query.selectViewport().scrollOffset();
    (this.sectionAnchorIds || []).forEach((id) => {
      query.select(`#${id}`).boundingClientRect();
    });
    query.exec((res) => {
      if (!res || res.length === 0) return;
      const scrollOffset = res[0];
      const sectionRects = res.slice(1);
      const scrollTop = (scrollOffset && scrollOffset.scrollTop) || 0;

      const tops = [];
      sectionRects.forEach((rect) => {
        if (rect) {
          tops.push(rect.top + scrollTop);
        }
      });
      if (tops.length > 0) {
        this.sectionTops = tops;
      }
    });
  },

  onUnload() {
    clearTimeout(this.autoScrollTimer);
  },

  onCollect() {
    const tutorId = this.data.tutorId;
    if (!tutorId) {
      wx.showToast({ title: '导师ID不存在', icon: 'none' });
      return;
    }

    wx.request({
      url: `${apiConfig.BASE_URL}/api/v1/user/favorite/tutor/${tutorId}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.data && res.data.success) {
          const action = res.data.data.action;
          this.setData({ isCollected: action === 'collected' });
          wx.showToast({
            title: action === 'collected' ? '已收藏' : '已取消收藏',
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: res.data?.message || '操作失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('[TutorDetail] 收藏操作失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  onContact() {
    wx.showModal({
      title: '提示',
      content: '请先登录或开通会员以获取联系方式',
      confirmText: '去开通',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/user/user' });
        }
      }
    });
  }
})