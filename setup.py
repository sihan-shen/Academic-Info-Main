from setuptools import setup, find_packages

# 读取依赖（如果有 requirements.txt，可自动导入，没有则手动写）
def read_requirements():
    try:
        with open("requirements.txt", "r", encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip() and not line.startswith("#")]
    except FileNotFoundError:
        return ["fastapi", "uvicorn", "pymongo"]  # 手动指定核心依赖

setup(
    name="academic-info",  # 项目名（自定义）
    version="0.1.0",       # 版本号
    packages=find_packages(where="."),  # 扫描当前目录下所有含 __init__.py 的模块
    package_dir={"": "."},              # 模块根目录为当前目录
    install_requires=read_requirements(),  # 项目依赖
    python_requires=">=3.8",             # Python 版本要求
)