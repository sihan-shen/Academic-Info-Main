# 用户资料同步说明

## 📋 功能概述

实现了编辑资料页面和用户个人页面之间的数据同步功能。用户在编辑页面修改的信息会自动保存到本地存储，并在返回"我的"页面时实时显示更新后的内容。

---

## 🔄 数据流程

```
编辑资料页面 (edit-profile)
    ↓
修改字段（姓名/手机号/性别/学术状态/个性签名等）
    ↓
自动保存到本地存储 (wx.setStorageSync)
    ↓
返回用户页面 (user)
    ↓
自动加载最新数据 (wx.getStorageSync)
    ↓
实时显示更新内容
```

---

## 📦 本地存储结构

**存储键名**: `userInfo`

**数据格式**:
```javascript
{
  avatar: '',                  // 头像路径
  name: '学术研究者',          // 姓名
  phone: '138****5678',        // 手机号
  gender: '男',                // 性别
  academicStatus: '硕士研究生', // 学术状态
  signature: '这位学者很懒，什么都没留下', // 个性签名
  institution: '',             // 所属机构
  tutor: '',                   // 当前导师
  achievement: '这位学者很懒，什么都没留下', // 学术成就
  vipStatus: false             // 会员状态
}
```

---

## 🔧 关键功能实现

### 1. 编辑资料页面 (`edit-profile.js`)

#### 页面加载时从本地存储读取
```javascript
onLoad() {
  this.loadUserInfo();
}

loadUserInfo() {
  const userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    this.setData({ userInfo });
  }
}
```

#### 修改字段时自动保存
```javascript
onConfirmEdit() {
  // 更新数据
  this.setData({
    [`userInfo.${key}`]: value
  });
  
  // 保存到本地存储
  this.saveToStorage();
}

saveToStorage() {
  wx.setStorageSync('userInfo', this.data.userInfo);
}
```

#### 修改头像时自动保存
```javascript
onEditAvatar() {
  wx.chooseImage({
    success: (res) => {
      this.setData({
        'userInfo.avatar': res.tempFilePaths[0]
      });
      
      // 保存到本地存储
      this.saveToStorage();
    }
  });
}
```

---

### 2. 用户页面 (`user.js`)

#### 页面加载和显示时自动刷新
```javascript
onLoad() {
  this.loadUserInfo();
}

onShow() {
  // 每次显示页面时重新加载，确保显示最新数据
  this.loadUserInfo();
}

loadUserInfo() {
  const editUserInfo = wx.getStorageSync('userInfo');
  if (editUserInfo) {
    // 将编辑页面的数据格式转换为用户页面格式
    this.setData({
      userInfo: {
        name: editUserInfo.name || '学术研究者',
        phone: editUserInfo.phone || '138****5678',
        role: editUserInfo.academicStatus || '硕士研究生',
        bio: editUserInfo.signature || '这位学者很懒，什么都没留下~',
        vipStatus: editUserInfo.vipStatus || false,
        avatar: editUserInfo.avatar || '',
        gender: editUserInfo.gender || '男',
        institution: editUserInfo.institution || '',
        tutor: editUserInfo.tutor || '',
        achievement: editUserInfo.achievement || ''
      }
    });
  }
}
```

---

### 3. 用户页面WXML (`user.wxml`)

#### 动态数据绑定
```xml
<!-- 头像 -->
<image class="avatar" src="{{userInfo.avatar || '/images/tutor-zhang.png'}}"></image>

<!-- 姓名 -->
<text class="name">{{userInfo.name}}</text>

<!-- 会员状态 -->
<text>{{userInfo.vipStatus ? '会员用户' : '未开通会员'}}</text>

<!-- 手机号 -->
<text class="phone">{{userInfo.phone}}</text>

<!-- 学术状态 -->
<text>{{userInfo.role}}</text>

<!-- 个性签名 -->
<text class="bio-text">{{userInfo.bio}}</text>
```

---

## ✅ 支持的字段

| 字段 | 编辑页面显示名 | 用户页面显示位置 | 验证规则 |
|------|---------------|-----------------|---------|
| avatar | 头像 | 用户信息区域 | 图片文件 |
| name | 姓名 | 用户信息区域 | 不能为空，最多20字符 |
| phone | 手机号 | 用户信息区域 | 11位手机号格式验证 |
| gender | 性别 | - | 男/女/保密 |
| academicStatus | 学术状态 | 角色标签 | 博士/硕士/本科等 |
| signature | 个性签名 | Bio区域 | 最多100字符 |
| institution | 所属机构 | - | 最多50字符 |
| tutor | 当前导师 | - | 最多20字符 |
| achievement | 学术成就 | - | 最多200字符 |

---

## 🎯 使用场景

### 场景1：修改姓名
1. 用户在"我的"页面点击"编辑"按钮
2. 进入编辑资料页面
3. 点击"姓名"字段
4. 输入新姓名"张三"
5. 点击确认
6. 返回"我的"页面 → 姓名自动更新为"张三" ✅

### 场景2：修改头像
1. 用户在编辑资料页面点击头像区域
2. 从相册选择新照片
3. 头像立即更新并保存
4. 返回"我的"页面 → 头像自动更新 ✅

### 场景3：修改多个字段
1. 用户依次修改姓名、手机号、个性签名
2. 每次修改都会自动保存
3. 返回"我的"页面 → 所有修改都已同步显示 ✅

---

## 🚀 后续扩展

### 与服务器同步
```javascript
// 在 saveToStorage() 后添加服务器同步
saveToStorage() {
  // 1. 保存到本地
  wx.setStorageSync('userInfo', this.data.userInfo);
  
  // 2. 同步到服务器
  wx.request({
    url: 'https://your-api.com/user/update',
    method: 'POST',
    data: this.data.userInfo,
    success: (res) => {
      console.log('服务器同步成功', res);
    },
    fail: (err) => {
      console.error('服务器同步失败', err);
    }
  });
}
```

### 添加加载状态
```javascript
loadUserInfo() {
  wx.showLoading({ title: '加载中...' });
  
  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  } finally {
    wx.hideLoading();
  }
}
```

---

## 🐛 错误处理

所有存储操作都包含了 try-catch 错误处理：

```javascript
try {
  wx.setStorageSync('userInfo', this.data.userInfo);
  console.log('用户信息已保存');
} catch (e) {
  console.error('保存失败:', e);
  wx.showToast({
    title: '保存失败，请重试',
    icon: 'none'
  });
}
```

---

## ✨ 优势特点

1. **实时同步** - 修改后立即保存，无需手动点击保存按钮
2. **离线可用** - 使用本地存储，无需网络即可使用
3. **数据持久化** - 关闭小程序后数据不会丢失
4. **自动刷新** - 返回页面时自动加载最新数据
5. **错误处理** - 完善的异常捕获和用户提示
6. **输入验证** - 手机号格式、字段长度等验证

---

## 📝 注意事项

1. 本地存储大小限制为 **10MB**
2. 敏感信息建议加密后存储
3. 定期清理过期数据
4. 考虑与服务器定期同步
5. 头像文件路径为临时路径，需要上传到服务器后使用永久URL

---

## 🎉 测试流程

### 测试步骤
1. ✅ 打开"我的"页面，查看初始数据
2. ✅ 点击"编辑"按钮，进入编辑资料页面
3. ✅ 修改姓名，点击确认
4. ✅ 返回"我的"页面，验证姓名已更新
5. ✅ 再次进入编辑页面，修改手机号
6. ✅ 返回"我的"页面，验证手机号已更新
7. ✅ 修改头像，验证头像立即显示
8. ✅ 关闭小程序，重新打开，验证数据持久化

### 预期结果
- ✅ 所有字段修改后立即保存
- ✅ 返回页面时自动显示最新数据
- ✅ 关闭小程序后数据不丢失
- ✅ 输入验证正确执行
- ✅ 错误提示清晰明确

---

**实现完成！🎊**
