/**
 * 小程序配置文件校验测试
 * 校验 project.config.json、app.json 等是否符合微信开发者工具要求
 */
const path = require('path');
const fs = require('fs');

const FRONTEND_ROOT = path.resolve(__dirname, '../../frontend');

describe('小程序配置文件校验', () => {
  describe('project.config.json', () => {
    let projectConfig;

    beforeAll(() => {
      const filePath = path.join(FRONTEND_ROOT, 'project.config.json');
      expect(fs.existsSync(filePath)).toBe(true);
      projectConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });

    it('应包含 compileType 且为 miniprogram', () => {
      expect(projectConfig.compileType).toBe('miniprogram');
    });

    it('应包含 appid（用于真机与体验版）', () => {
      expect(projectConfig.appid).toBeDefined();
      expect(typeof projectConfig.appid).toBe('string');
    });

    it('应包含 setting 配置', () => {
      expect(projectConfig.setting).toBeDefined();
      expect(typeof projectConfig.setting).toBe('object');
    });

    it('setting 应开启 es6 以支持现代语法', () => {
      expect(projectConfig.setting.es6).toBe(true);
    });
  });

  describe('app.json 与 pages 路径一致', () => {
    it('app.json 中所有 pages 路径对应的目录存在', () => {
      const appJson = JSON.parse(
        fs.readFileSync(path.join(FRONTEND_ROOT, 'app.json'), 'utf-8')
      );
      appJson.pages.forEach((pagePath) => {
        const dir = path.join(FRONTEND_ROOT, path.dirname(pagePath));
        expect(fs.existsSync(dir)).toBe(true);
      });
    });
  });

  describe('页面 json 配置合法', () => {
    let appJson;

    beforeAll(() => {
      appJson = JSON.parse(
        fs.readFileSync(path.join(FRONTEND_ROOT, 'app.json'), 'utf-8')
      );
    });

    appJson.pages.forEach((pagePath) => {
      const baseName = path.basename(pagePath);
      const jsonPath = path.join(FRONTEND_ROOT, pagePath, `${baseName}.json`);

      it(`${pagePath} 的 json 可解析且为对象`, () => {
        const content = fs.readFileSync(jsonPath, 'utf-8');
        const parsed = JSON.parse(content);
        expect(typeof parsed).toBe('object');
      });
    });
  });
});
