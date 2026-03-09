# 项目更新指南：前端重构与 OCR 智能分析功能

本文档详细描述了如何将旧版本代码库更新至最新状态，主要包含两部分内容：
1. **前端重构**：导师详情页 (`tutor-detail`) 的模块合并、删减及跳转逻辑优化。
2. **后端功能**：OCR 简历识别与智能分析功能的实现 (`resume_service`)。

---

## 第一部分：前端重构 (Frontend)

### 1. 导师详情页 (Tutor Detail)

#### A. 删除“风险排查”模块
**目标文件**: `frontend/pages/tutor-detail/tutor-detail.wxml`, `frontend/pages/tutor-detail/tutor-detail.js`

1.  **WXML**: 删除底部的 `Tab 7: 风险排查` 及其对应的 `view` 区块 (`id="section-7"`)。
2.  **JS**: 在 `data` 对象中：
    *   从 `tabs` 数组中移除 `'风险排查'`。
    *   从 `tabAnchors` 数组中移除 `'section-7'`。
    *   删除 `risks` 字段及其相关数据。

#### B. 合并标签页为“学术合作”
**目标**: 将原有的“学术成果”、“合作资源”、“项目”三个标签合并为一个“学术合作”标签。

**修改文件**: `frontend/pages/tutor-detail/tutor-detail.js`

更新 `tabs` 和 `tabAnchors` 配置如下：

```javascript
// 修改前
// tabs: ['个人简介', '社会关系', '成长脉络', '学术成果', '合作资源', '学生培养', '项目', '风险排查'],

// 修改后 (最终状态)
tabs: ['个人简介', '社会关系', '成长脉络', '学术合作', '学生培养'],
tabAnchors: ['section-0', 'section-1', 'section-2', 'section-3', 'section-4'],
```

**修改文件**: `frontend/pages/tutor-detail/tutor-detail.wxml`

1.  删除原有的 `section-3` (学术成果), `section-4` (合作资源), `section-6` (项目)。
2.  将 `section-5` (学生培养) 的 ID 改为 `section-4`。
3.  **新增** `section-3` (学术合作)，结构如下：

```xml
<!-- Tab 3: 学术合作 -->
<view class="content-section section-even" id="section-3">
  <!-- 1. 学术合作成果总结 -->
  <view class="section-container">
      <view class="section-header">
          <view class="section-title">学术合作成果</view>
      </view>
      <view class="section-text">{{tutor.achievements}}</view>
  </view>

  <!-- 2. 重点项目与论文 (合并列表) -->
  <view class="section-container">
      <view class="section-header">
          <view class="section-title">重点项目与论文</view>
      </view>
      <view class="project-list">
          <!-- Projects -->
          <view class="project-item" wx:for="{{tutor.projects}}" wx:key="id" bindtap="onItemClick" data-id="{{item.id}}" data-type="project">
              <view class="project-header">
                  <view class="project-title">
                      <text class="tag-label tag-project">项目</text>
                      {{item.title}}
                  </view>
                  <view class="project-role">{{item.role}}</view>
              </view>
              <view class="project-desc">{{item.desc}}</view>
          </view>
          
          <!-- Coops (作为项目展示) -->
          <view class="project-item" wx:for="{{tutor.coops}}" wx:key="id" bindtap="onItemClick" data-id="{{item.id}}" data-type="coop">
              <view class="project-header">
                  <view class="project-title">
                      <text class="tag-label tag-project">项目</text>
                      {{item.name}}
                  </view>
                  <view class="project-role">{{item.type}}</view>
              </view>
              <view class="project-desc">{{item.desc}}</view>
          </view>

          <!-- Papers -->
          <view class="project-item" wx:for="{{tutor.papers}}" wx:key="id" bindtap="onItemClick" data-id="{{item.id}}" data-type="paper">
              <view class="project-header">
                  <view class="project-title">
                      <text class="tag-label tag-paper">论文</text>
                      {{item.title}}
                  </view>
                  <view class="project-role">{{item.year}}</view>
              </view>
              <view class="project-desc">{{item.journal}}</view>
          </view>
      </view>
  </view>
</view>
```

**修改文件**: `frontend/pages/tutor-detail/tutor-detail.wxss`

新增标签样式：

```css
/* Tag Labels */
.tag-label {
  display: inline-block;
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 12rpx;
  vertical-align: middle;
  font-weight: normal;
  line-height: 1.4;
}

.tag-project {
  background: #e6f7ff;
  color: #1890ff;
  border: 1rpx solid #91d5ff;
}

.tag-paper {
  background: #f6ffed;
  color: #52c41a;
  border: 1rpx solid #b7eb8f;
}
```

#### C. 页面跳转逻辑
**目标**: 实现列表项跳转到合作详情页，以及合作详情页跳转回导师详情页。

**修改文件**: `frontend/pages/tutor-detail/tutor-detail.js`

添加 `onItemClick` 方法：

```javascript
  onItemClick(e) {
    const { id, type } = e.currentTarget.dataset;
    if (type === 'project' || type === 'coop') {
      wx.navigateTo({
        url: `/pages/coop-detail/coop-detail?id=${id}`
      });
    } else if (type === 'paper') {
      wx.showToast({
        title: '论文详情页暂未开放',
        icon: 'none'
      });
    }
  },
```

### 2. 合作项目详情页 (Coop Detail)

**修改文件**: `frontend/pages/coop-detail/coop-detail.js`

修正 `onContactMentor` 方法，使其能跳转：

```javascript
  // 联系导师
  onContactMentor(e) {
    const mentorId = e.currentTarget.dataset.id;
    // 跳转到导师详情页
    wx.navigateTo({
      url: `/pages/tutor-detail/tutor-detail?id=${mentorId}`
    });
  },
```

---

## 第二部分：后端 OCR 智能分析功能 (Backend)

此功能用于上传简历（图片或PDF），通过百度 OCR 提取文字，再通过 DeepSeek 进行语义分析提取研究方向。

### 1. 配置文件
**目标文件**: `backend/app/core/config/services.py`

定义第三方服务的 Keys：

```python
from pydantic_settings import BaseSettings

class ServiceSettings(BaseSettings):
    # Baidu OCR (请替换为实际 Key)
    BAIDU_API_KEY: str = "ZPA1nlXx9BmrOgTWxo70NjPW"
    BAIDU_SECRET_KEY: str = "0CVc5WM9QT4z7kVGg5plrCrvVFVVbKGv"
    
    # DeepSeek
    DEEPSEEK_API_KEY: str = "sk-e42acdb8f235474ba583c116faf8de4e"
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"

    class Config:
        env_file = ".env"

service_settings = ServiceSettings()
```

### 2. 核心服务逻辑
**目标文件**: `backend/app/services/resume_service.py`

需实现 `ResumeService` 类，包含以下核心方法：

1.  **Dependencies**:
    *   `httpx` (HTTP请求)
    *   `fitz` (PyMuPDF, 用于PDF转图片)
    *   `base64`

2.  **主要方法**:
    *   `get_baidu_access_token()`: 获取百度 OAuth Token。
    *   `extract_text_from_image(image_content)`: 调用百度通用文字识别接口。
    *   `extract_text_from_pdf(pdf_content)`: 使用 `fitz` 将 PDF 前3页转为图片，循环调用 `extract_text_from_image`。
    *   `analyze_resume_text(text)`: 调用 DeepSeek API。

**DeepSeek Prompt 示例**:
```python
prompt = """
你是一个专业的学术简历分析助手。请分析以下简历内容，提取出用户的“研究方向”和“学术背景”。
请严格按照以下 JSON 格式输出：
{
    "research": ["方向1", "方向2", ...],
    "background": ["学历信息", "学校名称", ...]
}
简历内容如下：
"""
```

### 3. API 接口
**目标文件**: `backend/app/api/v1/analysis.py`

实现 `/upload` 接口：

```python
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_service import resume_service

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    # 1. 读取文件内容
    content = await file.read()
    
    # 2. 根据类型提取文字
    if file.content_type == "application/pdf":
        text = await resume_service.extract_text_from_pdf(content)
    elif file.content_type.startswith("image/"):
        text = await resume_service.extract_text_from_image(content)
        
    # 3. LLM 分析
    result = await resume_service.analyze_resume_text(text)
    return result
```

---

## 依赖包要求 (requirements.txt)

确保后端环境安装了以下库：
*   `fastapi`
*   `httpx`
*   `pymupdf` (即 fitz)
*   `python-multipart` (用于文件上传)
