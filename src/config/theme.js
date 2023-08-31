// 默认主题颜色
export const DEFAULT_PRIMARY_COLOR = '#287DFA';

// 浅色主题
export const LIGHT_THEME = 'light';

// 黑色主题
export const DARK_THEME = 'dark';

export const THEME_ENUM = [
  {
    value: LIGHT_THEME,
    label: '浅色模式'
  },
  {
    value: DARK_THEME,
    label: '暗黑模式'
  }
];

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
    /**=========================字体颜色========================== **/
    '--ant-text-color-white': '#FFFFFF',
    '--ant-third-text-color': '#8592A6',
    '--ant-second-text-color': '#455873',
    '--ant-first-text-color': '#0F294D',
    '--ant-text-placeholder-color-white': '#CED2D9',
    '--ant-text-not-optional-color-white': '#ACB4BF',

    /**=========================header 相关颜色========================== **/
    '--ant-layout-header-bg': '#FFFFFF',

    /**=========================form 相关颜色========================== **/
    '--ant-input-bg': '#FFFFFF',
    '--ant-input-border': '#d9d9d9',

    /**=========================table 相关颜色========================== **/
    '--ant-table-td-bg': '#FFFFFF',
    '--ant-table-td-border-bg': '#f0f0f0',
    '--ant-table-th-bg': '#fafafa',
    '--ant-table-th-border-bg': '#f0f0f0',
    '--ant-table-row-hover': '#fafafa',

    /**=========================其他颜色========================== **/
    '--ant-background': '#F0F2F5',
    '--ant-line-color': '#E1E5EB',
    '--ant-tips-bg': '#FFF7EB',
    '--ant-body-bg': '#F5F7FA',
    '--ant-body-color': 'rgba(0,0,0,.85)',
    '--ant-content-bg': '#FFFFFF',

    /**=========================富文本编辑器========================== **/
    '--w-e-textarea-bg-color': '#fff',
    '--w-e-toolbar-bg-color': '#fff',
    '--w-e-toolbar-color': '#595959'
  },
  [DARK_THEME]: {
    /**=========================字体颜色========================== **/
    '--ant-text-color-white': '#FFFFFF',
    '--ant-third-text-color': '#99A6BA',
    '--ant-second-text-color': '#B8C4D4',
    '--ant-first-text-color': '#FFFFFF',
    '--ant-text-placeholder-color-white': '#5C697C',
    '--ant-text-not-optional-color-white': '#5C697C',

    /**=========================header 相关颜色========================== **/
    '--ant-layout-header-bg': '#1C242E',

    /**=========================form 相关颜色========================== **/
    '--ant-input-bg': '#0D131A',
    '--ant-input-border': '#0D131A',

    /**=========================table 相关颜色========================== **/
    '--ant-table-td-bg': '#1C242E',
    '--ant-table-td-border-bg': '#FFFFFF',
    '--ant-table-th-bg': '#242F3E',
    '--ant-table-th-border-bg': '#0D131A',
    '--ant-table-row-hover': '#242F3E',

    /**=========================其他颜色========================== **/
    '--ant-background': '#0D131A',
    '--ant-line-color': '#0D131A',
    '--ant-tips-bg': '#50473B',
    '--ant-body-bg': '#0D131A',
    '--ant-body-color': '#FFFFFF',
    '--ant-content-bg': '#1C242E',

    /**=========================富文本编辑器========================== **/
    '--w-e-textarea-bg-color': '#1C242E',
    '--w-e-toolbar-bg-color': '#1C242E',
    '--w-e-toolbar-color': '#FFFFFF'
  }
};
