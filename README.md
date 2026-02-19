# Academic-Info

这里是一个学术界社工型产品的仓库

## 子模块

本项目包含子模块，克隆仓库后需要额外步骤来获取子模块内容。

### 克隆包含子模块的仓库

```bash
# 方法1: 克隆时同时初始化并更新所有子模块
git clone --recursive https://github.com/your-username/Academic-Info-Main.git

# 方法2: 先克隆主仓库，再初始化子模块
git clone https://github.com/your-username/Academic-Info-Main.git
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