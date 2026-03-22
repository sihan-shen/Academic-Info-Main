# 后端开发接口与数据对接说明文档

## 1. 概述
本文档定义了小程序前端与后端服务器之间的数据交互接口及字段规范。后端主要负责用户认证、数据存储（爬虫数据+用户数据）、业务逻辑处理（收藏、预约、匹配）。

## 2. 核心模块

### 2.1 用户模块 (User)
**功能**: 微信登录、用户信息维护、会员状态管理。

#### A. 登录 (Login)
*   **接口**: `POST /api/user/login`
*   **输入**: `code` (微信登录凭证)
*   **输出**:
    *   `token` (JWT, 用于后续鉴权)
    *   `userInfo` (包含 `nickname`, `avatar`, `vipStatus`, `vipExpireDate`)

#### B. 获取用户信息 (Get User Info)
*   **接口**: `GET /api/user/profile`
*   **输出**: `userInfo` 对象。

#### C. 更新用户信息 (Update User Info)
*   **接口**: `PUT /api/user/profile`
*   **输入**: `nickname`, `avatar`, `school`, `major`, `grade` (年级)

### 2.2 导师模块 (Tutor)
**功能**: 导师列表查询、详情展示、筛选。

#### A. 导师列表 (List Tutors)
*   **接口**: `GET /api/tutor/list`
*   **参数**:
    *   `page`: 页码 (默认1)
    *   `pageSize`: 每页数量 (默认10)
    *   `keyword`: 搜索关键词 (姓名/研究方向)
    *   `school`: 学校筛选 (可选)
    *   `department`: 学院筛选 (可选)
    *   `city`: 城市筛选 (可选)
*   **输出**:
    *   `list`: 导师简略信息列表 `[{ id, name, title, school, department, tags, avatar, direction, desc, titleTag }]` <!-- Added direction, desc, titleTag based on frontend usage -->
    *   `total`: 总记录数

#### B. 导师详情 (Get Tutor Detail)
*   **接口**: `GET /api/tutor/detail/:id`
*   **参数**: `id` (导师ID)
*   **输出**:
    *   `tutor`: 包含爬虫抓取的所有详细字段。
        *   基础信息: `id`, `name`, `avatar`, `school`, `department`, `tags`, `bio`, `direction`, `titleTag` <!-- Added direction, titleTag -->
        *   详细板块:
            *   `growthPath`: 成长脉络 `[{ year, content, type }]` <!-- Added based on frontend usage -->
            *   `achievements`: 学术成果描述 (String) <!-- Added based on frontend usage -->
            *   `papers`: 论文列表 `[{ id, title, journal, year }]`
            *   `coops`: 合作资源 `[{ id, name, type, desc }]`
            *   `guidance`: 学生培养描述 (String) <!-- Added based on frontend usage -->
            *   `students`: 学生列表 `[{ id, name, year, dest }]`
            *   `projects`: 项目列表 `[{ id, title, role, desc }]`
            *   `risks`: 风险排查 `[{ id, type, content }]`
            *   `service`: 社会兼职描述 (String) <!-- Added based on frontend usage -->
            *   `socials`: 社会关系列表 `[{ id, role, org }]`
    *   `isCollected`: Boolean (当前用户是否收藏)

### 2.3 业务交互模块 (Interaction)

#### A. 收藏/取消收藏 (Toggle Favorite)
*   **接口**: `POST /api/user/favorite`
*   **输入**:
    *   `type`: "tutor" | "project"
    *   `targetId`: 目标ID
*   **输出**: `status` (collected/uncollected)

#### B. 获取收藏列表 (Get Favorites)
*   **接口**: `GET /api/user/favorites`
*   **参数**: `type` ("tutor" | "project")
*   **输出**: 收藏对象的列表。

#### C. 预约咨询 (Book Consultation - 仅VIP)
*   **接口**: `POST /api/service/book`
*   **输入**: `tutorId`, `date`, `message`
*   **输出**: `bookingId`, `status` (pending)

### 2.4 智能匹配模块 (Research Match)
**功能**: 根据用户输入的学科方向和关键词，推荐匹配度高的导师。

#### A. 提交匹配请求 (Submit Match)
*   **接口**: `POST /api/match/submit`
*   **输入**:
    *   `discipline`: 学科方向 (String)
    *   `keywords`: 研究兴趣关键词 (String, 逗号分隔)
    *   `preferences`: 偏好设置 `{ crossSchool: Boolean, highOutput: Boolean, youngScholar: Boolean }`
*   **输出**:
    *   `matchId`: 匹配任务ID (用于异步查询结果，或直接返回结果)
    *   `results`: 匹配导师列表 `[{ tutorId, matchScore, matchReason, ...tutorInfo }]`

### 2.5 合作机会模块 (Cooperation Opportunities)
**功能**: 展示跨校合作项目、产学研机会。

#### A. 项目列表 (List Projects)
*   **接口**: `GET /api/project/list`
*   **参数**: `type` (ai/bigdata/iot/all), `page`, `pageSize`
*   **输出**: 项目列表 `[{ id, title, tags, desc, members: [{ name, school }] }]`

#### B. 项目详情 (Get Project Detail)
*   **接口**: `GET /api/project/detail/:id`
*   **输出**: 项目详细信息。

#### C. 申请加入 (Apply Project)
*   **接口**: `POST /api/project/apply`
*   **输入**: `projectId`, `reason`, `resume` (简历链接)
*   **输出**: `applicationId`

## 3. 数据库设计建议 (Schema Suggestion)

### User Table
*   `id`, `openid`, `nickname`, `avatar`, `vip_status`, `vip_expire_date`, `created_at`

### Tutor Table (爬虫数据源)
*   `id`, `name`, `school_id`, `department_id`, `title`, `bio`, `email`, `phone`, `avatar_url`, `personal_page_url`, `crawled_at`

### Tutor_Details Table (扩展信息)
*   `tutor_id`, `research_direction`, `achievements_summary`, `papers_json`, `projects_json`, `students_json`, `socials_json`

### School Table
*   `id`, `name`, `location`, `level`, `logo_url`

### Department Table
*   `id`, `school_id`, `name`

### Favorite Table
*   `user_id`, `target_type`, `target_id`, `created_at`

### Match_History Table
*   `user_id`, `discipline`, `keywords`, `result_json`, `created_at`
