// 默认主题颜色
export const DEFAULT_PRIMARY_COLOR = 'rgba(0, 83, 247, 1)';

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
      primaryColor: '0A99FF',
      errorColor: '#D33939',
      successColor: '#3FA14A',
      warningColor: '#DF6802',
      infoColor: '0A99FF'
    }
  }
};

// 主题模式自定义颜色
export const THEME_COLOR = {
  [LIGHT_THEME]: {
    /**=========================覆盖ant design vue 颜色========================== **/
    '--ant-primary-color': 'rgba(0, 83, 247, 1)',
    '--ant-primary-color-hover': 'rgba(0, 83, 247, 0.9)',
    /**=========================覆盖element plus 颜色========================== **/
    '--el-color-primary': 'rgba(0, 83, 247, 1)',
    '--el-color-primary-light-5': 'rgba(0, 83, 247, 0.9)',
    '--el-color-primary-light-3': 'rgba(0, 83, 247, 0.9)',
    '--el-color-primary-light-7': 'rgba(0, 83, 247, 0.9)',
    /**=========================覆盖 v-form 颜色========================== **/
    '--private-v-form-left-bg': '#FAFBFD',
    /**=========================主色========================== **/
    '--private-primary-color': 'rgba(0, 83, 247, 1)',
    '--private-primary-color-1': 'rgba(0, 83, 247, 0.1)',
    '--private-primary-color-2': 'rgba(0, 83, 247, 0.2)',
    '--private-primary-color-3': 'rgba(0, 83, 247, 0.3)',
    '--private-primary-color-5': 'rgba(0, 83, 247, 0.5)',
    '--private-primary-color-6': 'rgba(0, 83, 247, 0.6)',
    '--private-primary-color-65': 'rgba(0, 83, 247, 0.65)',
    '--private-primary-color-8': 'rgba(0, 83, 247, 0.8)',
    /**=========================辅助色========================== **/
    '--private-success-color': 'rgba(79, 180, 67, 1)',
    '--private-success-color-1': 'rgba(79, 180, 67, 0.1)',
    '--private-success-color-3': 'rgba(79, 180, 67, 0.3)',

    '--private-error-color': 'rgba(238, 59, 40, 1)',
    '--private-error-color-1': 'rgba(238, 59, 40, 0.1)',
    '--private-error-color-3': 'rgba(238, 59, 40, 0.3)',

    '--private-warning-color': 'rgba(255, 149, 0, 1)',
    '--private-warning-color-1': 'rgba(255, 149, 0, 0.1)',
    '--private-warning-color-3': 'rgba(255, 149, 0, 0.3)',
    /**=========================字体颜色========================== **/
    '--private-third-text-color': '#8592A6', // 三级
    '--private-second-text-color': '#455873', // 二级
    '--private-first-text-color': '#0F294D', // 一级
    '--private-placeholder-text-color': '#CED2D9', // placeholder
    '--private-not-optional-text-color': '#ACB4BF', // 不可点击、不可选择

    /**=========================背景色========================== **/
    '--private-content-bg': '#FFFFFF', // 内容背景
    '--private-bg-1': '#F4F5F8',
    '--private-bg-2': '#F0F2F5',
    '--private-tip-bg': '#FFF7EB',
    '--private-table-header-bg': '#F5F7FA', // table header bg
    '--private-table-bg': '#F5F7FA', // table bg
    '--private-header-shadow': 'rgba(15, 41, 77, 0.15)', // header shadow
    '--private-mask-bg': 'rgba(0, 0, 0, 0.25)', // 遮罩层

    /**=========================线、边框========================== **/
    '--private-line-color-1': '#DADFE6',
    '--private-line-color-2': '#E1E5EB',
    '--private-table-border-color': '#F0F2F5', // table边框
    '--private-webkit-scrollbar-thumb-bg': 'rgba(15, 41, 77, 0.3) ',

    /**=========================form 相关颜色========================== **/
    '--private-form-disabled-bg': '#F5F7FA',
    '--private-form-disabled-border': '#DADFE6',
    '--private-form-border': '#DADFE6',
    '--private-form-icon': '#8592A6',
    '--private-form-dropdown-hover-bg': 'rgba(0, 83, 247, 0.1)'
  },
  [DARK_THEME]: {
    /**=========================覆盖ant design vue 颜色========================== **/
    '--ant-primary-color': 'rgba(0, 83, 247, 1)',
    '--ant-primary-color-hover': 'rgba(0, 83, 247, 0.9)',
    /**=========================覆盖element plus 颜色========================== **/
    '--el-color-primary': 'rgba(0, 83, 247, 1)',
    '--el-color-primary-light-5': 'rgba(0, 83, 247, 0.9)',
    '--el-color-primary-light-3': 'rgba(0, 83, 247, 0.9)',
    '--el-color-primary-light-7': 'rgba(0, 83, 247, 0.9)',
    /**=========================覆盖 v-form 颜色========================== **/
    '--private-v-form-left-bg': '#1C242E',
    /**=========================主色========================== **/
    '--private-primary-color': 'rgba(0, 83, 247, 1)',
    '--private-primary-color-1': 'rgba(0, 83, 247, 0.1)',
    '--private-primary-color-2': 'rgba(0, 83, 247, 0.2)',
    '--private-primary-color-3': 'rgba(0, 83, 247, 0.3)',
    '--private-primary-color-5': 'rgba(0, 83, 247, 0.5)',
    '--private-primary-color-6': 'rgba(0, 83, 247, 0.6)',
    '--private-primary-color-65': 'rgba(0, 83, 247, 0.65)',
    '--private-primary-color-8': 'rgba(0, 83, 247, 0.8)',
    /**=========================辅助色========================== **/
    '--private-success-color': 'rgba(63, 161, 74, 1)',
    '--private-success-color-1': 'rgba(63, 161, 74, 0.1)',
    '--private-success-color-3': 'rgba(63, 161, 74, 0.3)',

    '--private-error-color': 'rgba(211, 57, 57, 1)',
    '--private-error-color-1': 'rgba(211, 57, 57, 0.1)',
    '--private-error-color-3': 'rgba(211, 57, 57, 0.3)',

    '--private-warning-color': 'rgba(223, 104, 2, 1)',
    '--private-warning-color-1': 'rgba(223, 104, 2, 0.1)',
    '--private-warning-color-3': 'rgba(223, 104, 2, 0.3)',
    /**=========================字体颜色========================== **/
    '--private-third-text-color': '#99A6BA', // 三级
    '--private-second-text-color': '#B8C4D4', // 二级
    '--private-first-text-color': '#FFFFFF', // 一级
    '--private-placeholder-text-color': '#5C697C', // placeholder
    '--private-not-optional-text-color': '#5C697C', // 不可点击、不可选择

    /**=========================背景色========================== **/
    '--private-content-bg': '#1C242E', // 内容背景
    '--private-bg-1': '#0D131A',
    '--private-bg-2': '#1C242E',
    '--private-tip-bg': '#50473B',
    '--private-table-header-bg': '#1C242E', // table header bg
    '--private-table-bg': '#1C242E', // table bg
    '--private-header-shadow': 'rgba(15, 41, 77, 0.15)', // header shadow
    '--private-mask-bg': 'rgba(0, 0, 0, 0.25)', // 遮罩层

    /**=========================线、边框========================== **/
    '--private-line-color-1': '#6C7C95',
    '--private-line-color-2': '#39404C',
    '--private-table-border-color': '#1C242E', // table边框
    '--private-webkit-scrollbar-thumb-bg': 'rgba(255, 255, 255, 0.3) ',

    /**=========================form 相关颜色========================== **/
    '--private-form-disabled-bg': '#39404C',
    '--private-form-disabled-border': '#6C7C95',
    '--private-form-disabled-color': '#5C697C',
    '--private-form-border': '#6C7C95',
    '--private-form-icon': '#99A6BA',
    '--private-form-dropdown-hover-bg': 'rgba(0, 83, 247, 0.1)'
  }
};
