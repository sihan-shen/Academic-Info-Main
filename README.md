# Academic-Info

这里是一个学术界社工型产品的仓库

## 子模块

本项目包含子模块，克隆仓库后需要额外步骤来获取子模块内容。

当前包含的子模块：
- `crawler`: [Academic_Search](https://github.com/Radiumy/Academic_Search.git)
- `frontend`: [Academic-Info-Frontend](https://github.com/202301-Belle/Frontend)

### 克隆包含子模块的仓库

```bash
# 方法1: 克隆时同时初始化并更新所有子模块
git clone --recursive https://github.com/sihan-shen/Academic-Info-Main.git

# 方法2: 先克隆主仓库，再初始化子模块
git clone https://github.com/sihan-shen/Academic-Info-Main.git
cd Academic-Info-Main
git submodule init
git submodule update

# 或者使用简写
git submodule update --init
```

### 更新子模块

```bash
# 更新所有子模块到最新版本
git submodule update --remote

# 更新指定子模块（以 crawler 为例）
git submodule update --remote crawler
```

### 查看子模块状态

```bash
# 查看所有子模块及其状态
git submodule status

# 查看子模块列表
git submodule
```

### 添加新子模块（如需）

```bash
git submodule add https://github.com/username/repo.git path/to/submodule
```

### 移除子模块（如需）

```bash
git submodule deinit -f path/to/submodule
git rm path/to/submodule
rm -rf .git/modules/path/to/submodule
```

## 自动同步子模块

本项目配置了 GitHub Actions，当子模块有更新时，会自动同步到主仓库。

### 工作原理

1. 子模块仓库的 `main`/`master` 分支有推送时
2. 子模块的 workflow 触发主仓库的 `repository_dispatch` 事件
3. 主仓库的 workflow 自动更新子模块指针并提交

### 配置步骤

#### 1. 主仓库配置（我已使用我的Token配置）

在**主仓库** (Academic-Info-Main) 的 Settings → Secrets and variables → Actions 中添加：

| Secret 名称 | 说明 |
|-------------|------|
| `MAIN_REPO_PAT` | 具有 repo 权限的 Personal Access Token |

生成 PAT：
- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- 勾选 `repo` 权限
- 生成后添加到主仓库的 Secrets

#### 2. 子仓库配置

在**子仓库**（如 crawler）的 Settings → Secrets and variables → Actions 中添加：

| Secret 名称 | 说明 |
|-------------|------|
| `PARENT_REPO_PAT` | 主仓库的 Personal Access Token（需有主仓库 repo 权限） |

并在子仓库中创建 `.github/workflows/trigger-parent-update.yml`：

```yaml
name: Trigger Parent Update

on:
  push:
    branches:
      - master
      - main
  workflow_dispatch:

jobs:
  notify-parent:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger parent repository
        run: |
          PARENT_OWNER="sihan-shen"
          PARENT_REPO="Academic-Info-Main"
          COMMIT_SHA="${{ github.sha }}"

          curl -X POST \
            "https://api.github.com/repos/${PARENT_OWNER}/${PARENT_REPO}/dispatches" \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: token ${{ secrets.PARENT_REPO_PAT }}" \
            -H "Content-Type: application/json" \
            -d '{
              "event_type": "submodule_updated",
              "client_payload": {
                "submodule": "crawler",
                "commit_sha": "'"$COMMIT_SHA"'"
              }
            }'
```

#### 3. 手动触发同步

在主仓库的 Actions 页面，选择 "Sync Submodules" workflow，点击 "Run workflow" 可手动触发。

### 注意事项

- 确保 PAT 具有足够的权限（repo 权限）
- 并发触发会被自动阻止，避免冲突
- 如果子模块没有实际更新，不会产生提交