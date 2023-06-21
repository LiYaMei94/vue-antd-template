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
    '--ant-layout-bg': '#f0f2f5'
  },
  [DARK_THEME]: {
    '--ant-layout-header-bg': '#001529',
    '--ant-layout-content-bg': '#001529',
    '--ant-layout-bg': '#73767a'
  }
};
