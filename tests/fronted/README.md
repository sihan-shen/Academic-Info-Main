# 小程序前端测试

本目录包含针对 `frontend` 微信小程序前端的测试代码，用于**确保项目能在微信开发者工具中成功加载并运行**。

## 测试内容

| 测试文件 | 说明 |
|---------|------|
| `validate-structure.test.js` | 校验项目结构：`app.js` / `app.json` / `app.wxss`、`project.config.json` 存在；`app.json` 中所有页面均具备 `.js` / `.json` / `.wxml` / `.wxss` 四件套；tabBar 配置的图标文件存在 |
| `validate-config.test.js` | 校验 `project.config.json`（如 `compileType`、`appid`、`setting.es6`）及 `app.json` 与页面路径、页面 json 可解析 |
| `page-logic.test.js` | 在 Node 环境 mock `wx`，加载各页面脚本，校验页面能正确注册、含 `data`/`onLoad`，以及首页/登录页/用户页/搜索页等关键方法存在且行为符合预期 |

## 运行方式

在**本目录**下执行：

```bash
# 首次运行需安装依赖
npm install

# 运行全部测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率（可选）
npm run test:coverage
```

建议在提交前或修改 `frontend` 后运行一次 `npm test`，保证在微信开发者工具中打开 `frontend` 项目时能正常编译、运行。

## 若 tabBar 图标测试失败

若 `validate-structure.test.js` 中关于 tabBar 图标的用例失败，说明 `app.json` 里配置的图标路径在 `frontend` 中不存在。请任选其一：

- 在 `frontend/images/` 下添加以下文件：`home.png`、`home-active.png`、`user.png`、`user-active.png`；或  
- 将 `frontend/app.json` 中 `tabBar.list` 的 `iconPath`、`selectedIconPath` 改为你已有的图片路径（如 `images/home-tab.png` 等）。

## 与微信开发者工具的关系

- 本测试在 **Node 环境** 下运行，不依赖微信开发者工具。
- 通过后可认为：项目结构完整、配置合法、页面脚本可正确注册且关键逻辑可执行。
- 最终仍需在**微信开发者工具**中打开 `frontend` 目录做真机预览与调试；本测试用于在提交前快速发现结构/配置/逻辑问题。
