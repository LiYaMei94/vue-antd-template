// 默认主题颜色
export const DEFAULT_PRIMARY_COLOR = '#287DFA';

// 浅色主题
export const LIGHT_THEME = 'light';

// 黑色主题
export const DARK_THEME = 'dark';

// 主题枚举
export const MAIN_THEME_MAP = {
  [LIGHT_THEME]: {
    theme: LIGHT_THEME,
    antd: {
      primaryColor: DEFAULT_PRIMARY_COLOR,
      errorColor: '#EE3B28',
      successColor: '#4FB443',
      warningColor: '#FF9500',
      infoColor: DEFAULT_PRIMARY_COLOR
    }
  },
  [DARK_THEME]: {
    theme: DARK_THEME,
    antd: {
      primaryColor: '#8AA1F8',
      errorColor: '#F37668',
      successColor: '#84CA7B',
      warningColor: '#FFB866',
      infoColor: '#8AA1F8'
    }
  }
};

// 主题模式自定义颜色
export const THEME_COLOR = {
  [LIGHT_THEME]: {
    '--ant-layout-header-bg': '#ffffff',
    '--ant-layout-content-bg': '#ffffff',
    '--ant-layout-bg': '#f0f2f5',
    '--ant-header-icon-bg': '#000000',
    '--ant-line': '#E1E5EB',
    '--ant-background': '#F0F2F5',
    '--ant-tips-bg': '#FFF7EB',
    '--ant-table-bg': '#F5F7FA'
  },
  [DARK_THEME]: {
    '--ant-layout-header-bg': '#0D131A',
    '--ant-layout-content-bg': '#252B31',
    '--ant-layout-bg': '#73767a',
    '--ant-header-icon-bg': '#ffffff',
    '--ant-line': '#39404C',
    '--ant-background': '#0D131A',
    '--ant-tips-bg': '#50473B',
    '--ant-table-bg': '#1C242E'
  }
};
