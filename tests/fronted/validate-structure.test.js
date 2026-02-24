/**
 * 小程序项目结构校验测试
 * 确保 frontend 目录具备微信开发者工具可识别的完整结构，能够成功加载运行
 */
const path = require('path');
const fs = require('fs');

const FRONTEND_ROOT = path.resolve(__dirname, '../../frontend');

describe('小程序项目结构校验', () => {
  describe('必需根文件', () => {
    it('应存在 app.js', () => {
      expect(fs.existsSync(path.join(FRONTEND_ROOT, 'app.js'))).toBe(true);
    });

    it('应存在 app.json', () => {
      expect(fs.existsSync(path.join(FRONTEND_ROOT, 'app.json'))).toBe(true);
    });

    it('应存在 app.wxss', () => {
      expect(fs.existsSync(path.join(FRONTEND_ROOT, 'app.wxss'))).toBe(true);
    });

    it('应存在 project.config.json（微信开发者工具项目配置）', () => {
      expect(fs.existsSync(path.join(FRONTEND_ROOT, 'project.config.json'))).toBe(true);
    });
  });

  describe('app.json 配置', () => {
    let appJson;

    beforeAll(() => {
      const content = fs.readFileSync(path.join(FRONTEND_ROOT, 'app.json'), 'utf-8');
      appJson = JSON.parse(content);
    });

    it('应包含 pages 数组且非空', () => {
      expect(Array.isArray(appJson.pages)).toBe(true);
      expect(appJson.pages.length).toBeGreaterThan(0);
    });

    it('第一项应为首页路径（用于启动页）', () => {
      expect(appJson.pages[0]).toBeTruthy();
      expect(typeof appJson.pages[0]).toBe('string');
    });

    it('应包含 window 配置', () => {
      expect(appJson.window).toBeDefined();
      expect(typeof appJson.window).toBe('object');
    });

    it('若存在 tabBar 则应有 list 且每项含 pagePath、text、iconPath、selectedIconPath', () => {
      if (!appJson.tabBar) return;
      expect(Array.isArray(appJson.tabBar.list)).toBe(true);
      appJson.tabBar.list.forEach((item, i) => {
        expect(item.pagePath).toBeDefined();
        expect(item.text).toBeDefined();
        expect(item.iconPath).toBeDefined();
        expect(item.selectedIconPath).toBeDefined();
      });
    });
  });

  describe('每个页面具备四件套', () => {
    let appJson;

    beforeAll(() => {
      const content = fs.readFileSync(path.join(FRONTEND_ROOT, 'app.json'), 'utf-8');
      appJson = JSON.parse(content);
    });

    appJson.pages.forEach((pagePath) => {
      const pageDir = path.join(FRONTEND_ROOT, pagePath);
      const baseName = path.basename(pagePath);

      describe(`页面: ${pagePath}`, () => {
        it(`应存在 ${baseName}.js`, () => {
          expect(fs.existsSync(path.join(pageDir, `${baseName}.js`))).toBe(true);
        });
        it(`应存在 ${baseName}.json`, () => {
          expect(fs.existsSync(path.join(pageDir, `${baseName}.json`))).toBe(true);
        });
        it(`应存在 ${baseName}.wxml`, () => {
          expect(fs.existsSync(path.join(pageDir, `${baseName}.wxml`))).toBe(true);
        });
        it(`应存在 ${baseName}.wxss`, () => {
          expect(fs.existsSync(path.join(pageDir, `${baseName}.wxss`))).toBe(true);
        });
      });
    });
  });

  describe('tabBar 图标文件存在', () => {
    let appJson;

    beforeAll(() => {
      const content = fs.readFileSync(path.join(FRONTEND_ROOT, 'app.json'), 'utf-8');
      appJson = JSON.parse(content);
    });

    if (appJson.tabBar && appJson.tabBar.list) {
      appJson.tabBar.list.forEach((item) => {
        it(`tabBar 图标 iconPath 存在: ${item.iconPath}`, () => {
          const fullPath = path.join(FRONTEND_ROOT, item.iconPath);
          if (!fs.existsSync(fullPath)) {
            throw new Error(
              `缺少 tabBar 图标，请在 frontend/images 添加 ${path.basename(item.iconPath)}，或将 app.json 中 iconPath 改为已有图片路径。`
            );
          }
        });
        it(`tabBar 图标 selectedIconPath 存在: ${item.selectedIconPath}`, () => {
          const fullPath = path.join(FRONTEND_ROOT, item.selectedIconPath);
          if (!fs.existsSync(fullPath)) {
            throw new Error(
              `缺少 tabBar 图标，请在 frontend/images 添加 ${path.basename(item.selectedIconPath)}，或将 app.json 中 selectedIconPath 改为已有图片路径。`
            );
          }
        });
      });
    }
  });
});
