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
      primaryColor: 'rgb(24, 144, 255)',
      errorColor: '#F37668',
      successColor: '#84CA7B',
      warningColor: '#FFB866',
      infoColor: 'rgb(24, 144, 255)'
    }
  }
};

// 主题模式自定义颜色
export const THEME_COLOR = {
  [LIGHT_THEME]: {
    /**=========================字体颜色========================== **/
    '--private-third-text-color': '#8592A6', // 三级
    '--private-second-text-color': '#455873', // 二级
    '--private-first-text-color': '#0F294D', // 一级
    '--private-placeholder-text-color': '#CED2D9', // placeholder
    '--private-primary-text-color': 'rgba(15, 41, 77, 1)', // 默认字体颜色

    /**=========================背景色========================== **/
    '--private-content-bg': '#FFFFFF', // 内容背景
    '--private-body-bg': '#F5F7FA', // body背景
    '--private-table-header-bg': '#fafafa', // table header

    /**=========================线、边框========================== **/
    '--private-line-color': '#E1E5EB',
    '--private-border-color': '#E1E5EB',
    '--private-table-border-color': '#f0f0f0',

    /**=========================form 禁止点击 相关颜色========================== **/
    '--private-form-disabled-bg': '#f5f5f5',
    '--private-form-disabled-border': '#d9d9d9',
    '--private-not-optional-text-color': '#ACB4BF', // 不可点击、不可选择
    '--private-form-border': '#d9d9d9',
    '--private-form-icon': 'rgba(0,0,0,.25)',
    '--private-show-count-suffix-text-color': 'rgba(0, 0, 0, 0.45)',
    '--private-form-dropdown-hover-bg': '#f5f5f5',

    /**=========================hover========================== **/
    '--private-primary-color-hover': 'rgba(0, 83, 247, 0.8)'
  },
  [DARK_THEME]: {
    /**=========================字体颜色========================== **/
    '--private-third-text-color': '#99A6BA', // 三级
    '--private-second-text-color': '#B8C4D4', // 二级
    '--private-first-text-color': '#FFFFFF', // 一级
    '--private-placeholder-text-color': '#5C697C', // placeholder
    '--private-primary-text-color': 'hsla(0,0%,100%,.65)', // 默认字体颜色
    '--darkreader-text--ant-primary-color': '#409fe7',

    /**=========================背景色========================== **/
    '--private-content-bg': 'rgb(36, 37, 37)', // 内容背景
    '--private-body-bg': 'rgb(42, 44, 44)', // body背景
    '--private-dark-active-bg': '#113545', // FIXME: 侧边菜单active的背景色
    '--private-table-header-bg': 'rgb(39, 40, 39)', // table header

    /**=========================线、边框========================== **/
    '--private-line-color': '#0D131A',
    '--private-border-color': '#0D131A',
    '--private-table-border-color': 'rgba(143, 132, 117, 0.06)',

    /**=========================form 禁止点击 相关颜色========================== **/
    '--private-form-disabled-bg': 'rgb(42, 44, 44)',
    '--private-form-disabled-border': 'rgb(69, 72, 71)',
    '--private-not-optional-text-color': '#8D9095',
    '--private-not-optional-text-bg': '',
    '--private-form-border': 'rgb(69, 72, 71)',
    '--private-form-icon': 'rgba(229, 224, 216, 0.25)',
    '--private-show-count-suffix-text-color': 'rgba(0, 0, 0, 0.45)',
    '--private-form-dropdown-hover-bg': 'transparent',

    /**=========================hover========================== **/
    '--private-primary-color-hover': 'rgba(0, 83, 247, 0.8)'
  }
};
