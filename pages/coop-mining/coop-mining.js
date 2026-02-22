Page({
  data: {
    coopList: [
      {
        id: 1,
        title: '跨校AI联合实验室',
        tags: ['人工智能', '跨校合作'],
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
        desc: '高校与华为、阿里巴巴等企业开展智能制造技术研发',
        achievement: '技术转化5项，专利授权20+件',
        members: [
          { name: '陈思远', school: '上交', initial: '陈' },
          { name: '刘强', school: '复旦', initial: '刘' }
        ]
      }
    ]
  },

  onReady() {
    this.drawGraph();
  },

  drawGraph() {
    const ctx = wx.createCanvasContext('graphCanvas', this);
    const query = wx.createSelectorQuery().in(this);
    query.select('.graph-area').boundingClientRect(rect => {
      if (!rect) return;
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      const nodes = [
        { x: w * 0.12, y: h * 0.15 },
        { x: w * 0.82, y: h * 0.12 },
        { x: w * 0.10, y: h * 0.78 },
        { x: w * 0.83, y: h * 0.78 }
      ];

      ctx.setStrokeStyle('rgba(255,255,255,0.15)');
      ctx.setLineWidth(1);
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      });

      ctx.draw();
    }).exec();
  },

  onPublish() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});
