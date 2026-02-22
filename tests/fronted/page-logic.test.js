/**
 * 页面逻辑单元测试（在 Node 环境 mock wx，校验页面注册与关键逻辑）
 * 确保各页面可被正确注册且关键方法存在、可调用
 */
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const FRONTEND_ROOT = path.resolve(__dirname, '../../frontend');

function loadPageObject(pagePath, opts = {}) {
  const fullPath = path.join(FRONTEND_ROOT, pagePath);
  const baseName = path.basename(pagePath);
  const jsPath = path.join(fullPath, `${baseName}.js`);
  const code = fs.readFileSync(jsPath, 'utf-8');

  let capturedPageConfig = null;
  const Page = (config) => {
    capturedPageConfig = config;
  };
  const wx = opts.wx || {
    navigateTo: jest.fn(),
    switchTab: jest.fn(),
    reLaunch: jest.fn(),
    showToast: jest.fn(),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
    showModal: jest.fn((o) => o.success && o.success({ confirm: false })),
    getStorageSync: jest.fn(() => null),
    setStorageSync: jest.fn(),
    login: jest.fn((o) => o.success && o.success({})),
  };

  const context = vm.createContext({
    Page,
    wx,
    getApp: () => ({}),
    global: globalThis,
    console,
  });
  vm.runInContext(code, context);
  return opts.returnWx ? { config: capturedPageConfig, wx } : capturedPageConfig;
}

function getAppPages() {
  const appJsonPath = path.join(FRONTEND_ROOT, 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
  return appJson.pages || [];
}

describe('页面逻辑单元测试', () => {
  getAppPages().forEach((pagePath) => {
    describe(`页面 ${pagePath}`, () => {
      let pageConfig;

      beforeAll(() => {
        try {
          pageConfig = loadPageObject(pagePath);
        } catch (e) {
          pageConfig = null;
        }
      });

      it('应能正确加载并注册为 Page（无语法错误且调用了 Page）', () => {
        expect(pageConfig).not.toBeNull();
        expect(typeof pageConfig).toBe('object');
      });

      it('应包含 data 对象', () => {
        if (!pageConfig) return;
        expect(pageConfig.data).toBeDefined();
        expect(typeof pageConfig.data).toBe('object');
      });

      it('若包含 onLoad 则应为函数', () => {
        if (!pageConfig || !('onLoad' in pageConfig)) return;
        expect(typeof pageConfig.onLoad).toBe('function');
      });
    });
  });

  describe('首页 index 关键方法', () => {
    let pageConfig;

    beforeAll(() => {
      pageConfig = loadPageObject('pages/index/index');
    });

    it('应有 onSearch、navigateToSearch、navigateToTutorLibrary 等方法', () => {
      expect(typeof pageConfig.onSearch).toBe('function');
      expect(typeof pageConfig.navigateToSearch).toBe('function');
      expect(typeof pageConfig.navigateToTutorLibrary).toBe('function');
    });

    it('closeActionSheet 应能安全调用', () => {
      const setData = jest.fn();
      pageConfig.closeActionSheet.call({ setData });
      expect(setData).toHaveBeenCalledWith({ showActionSheet: false });
    });
  });

  describe('登录页 login 校验逻辑', () => {
    let pageConfig;
    let wxMock;

    beforeAll(() => {
      const result = loadPageObject('pages/login/login', { returnWx: true });
      pageConfig = result.config;
      wxMock = result.wx;
    });

    it('未填账号时 onLogin 应触发“请输入账号”提示', () => {
      wxMock.showToast.mockClear();
      pageConfig.onLogin.call({
        data: { account: '', password: 'x', agreed: true },
        setData: jest.fn(),
      });
      expect(wxMock.showToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: '请输入账号', icon: 'none' })
      );
    });

    it('未勾选协议时 onLogin 应触发“请先同意用户协议”提示', () => {
      wxMock.showToast.mockClear();
      pageConfig.onLogin.call({
        data: { account: 'a', password: 'p', agreed: false },
        setData: jest.fn(),
      });
      expect(wxMock.showToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: '请先同意用户协议', icon: 'none' })
      );
    });
  });

  describe('用户页 user 导航方法', () => {
    let pageConfig;

    beforeAll(() => {
      pageConfig = loadPageObject('pages/user/user');
    });

    it('应包含 navigateToEditProfile、navigateToHelp、navigateToFavorites 等', () => {
      expect(typeof pageConfig.navigateToEditProfile).toBe('function');
      expect(typeof pageConfig.navigateToHelp).toBe('function');
      expect(typeof pageConfig.navigateToFavorites).toBe('function');
    });
  });

  describe('搜索页 search 筛选与分页', () => {
    let pageConfig;

    beforeAll(() => {
      pageConfig = loadPageObject('pages/search/search');
    });

    it('应有 toggleFilter、resetFilter、applyFilter、prevPage、nextPage', () => {
      expect(typeof pageConfig.toggleFilter).toBe('function');
      expect(typeof pageConfig.resetFilter).toBe('function');
      expect(typeof pageConfig.applyFilter).toBe('function');
      expect(typeof pageConfig.prevPage).toBe('function');
      expect(typeof pageConfig.nextPage).toBe('function');
    });

    it('onLoad 接收 keyword 时应写入 data', () => {
      const setData = jest.fn();
      pageConfig.onLoad.call({ setData }, { keyword: 'test' });
      expect(setData).toHaveBeenCalledWith({ keyword: 'test' });
    });
  });
});
