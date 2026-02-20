// pages/service/service.js
const autoReplies = {
  '如何查询导师信息？': '您可以在首页使用搜索功能查询导师信息，支持按姓名、院校、研究方向等多种方式搜索。如需更详细的筛选，可以使用"导师全库搜索"功能进行高级筛选。',
  '会员有什么特权？': '我们提供基础会员（¥99/月）和高级会员（¥299/月）两种选择。高级会员可享受无限次查询、AI智能匹配、学术合作挖掘、深度背景调查等专属特权。点击"我的"-"会员激活"了解详情。',
  '如何使用AI匹配？': '进入首页后点击"AI智能匹配"功能，系统会根据您的学术背景和研究兴趣，智能推荐最适合的导师。您也可以选择多位导师进行AI对比分析。',
  '数据导出功能在哪？': '数据导出功能位于导师详情页右上角的"更多"菜单中。基础会员可导出基础信息，高级会员可导出完整的学术分析报告。'
};

function getTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return h + ':' + m;
}

Page({
  data: {
    messages: [
      {
        type: 'bot',
        text: '您好！我是学术导师信息平台的AI智能客服，很高兴为您服务。请问有什么可以帮助您的吗？',
        time: '10:30'
      }
    ],
    quickQuestions: [
      '如何查询导师信息？',
      '会员有什么特权？',
      '如何使用AI匹配？',
      '数据导出功能在哪？'
    ],
    showQuick: true,
    inputValue: '',
    scrollToView: ''
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSend() {
    const text = this.data.inputValue.trim();
    if (!text) return;

    const time = getTimeStr();
    const messages = this.data.messages;

    messages.push({ type: 'user', text, time });

    this.setData({
      messages,
      inputValue: '',
      showQuick: false,
      scrollToView: 'msg-' + (messages.length - 1)
    });

    setTimeout(() => {
      this.botReply(text);
    }, 800);
  },

  onQuickTap(e) {
    const q = e.currentTarget.dataset.q;
    const time = getTimeStr();
    const messages = this.data.messages;

    messages.push({ type: 'user', text: q, time });

    this.setData({
      messages,
      showQuick: false,
      scrollToView: 'msg-' + (messages.length - 1)
    });

    setTimeout(() => {
      this.botReply(q);
    }, 800);
  },

  botReply(question) {
    const time = getTimeStr();
    const messages = this.data.messages;

    let reply = autoReplies[question];
    if (!reply) {
      reply = '感谢您的提问！这个问题我已记录，会尽快为您解答。您也可以拨打客服热线 400-888-8888 获取即时帮助。';
    }

    messages.push({ type: 'bot', text: reply, time });

    this.setData({
      messages,
      scrollToView: 'msg-' + (messages.length - 1)
    });
  }
});
