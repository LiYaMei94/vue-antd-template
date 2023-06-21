import { ConfigProvider } from 'ant-design-vue';
import { useStore } from 'vuex';
import { THEME_COLOR, DEFAULT_PRIMARY_COLOR, MAIN_THEME_MAP } from '@/theme';

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
  const { state, dispatch } = useStore();
  const { global } = state || {};

  // console.log('map', map.state);
  // 修改主题颜色
  const changePrimaryColor = (val) => {
    val = val || DEFAULT_PRIMARY_COLOR;

    // 修改antd的主题色
    ConfigProvider.config({
      theme: {
        primaryColor: val
      }
    });

    // 其他主题颜色变化
    // document.documentElement.style.setProperty('--ant-primary-color', val);
    dispatch('setGlobalPrimary', val);
  };

  // 设置主题模式 ==> light、dark
  const setThemeColor = (type) => {
    type = type || global?.theme;
    const html = document.documentElement;
    // 当前主题模式配置
    const themeConfig = MAIN_THEME_MAP[type];
    // 当前主题模式下颜色
    const themeColor = THEME_COLOR[type];
    const primaryColor = global?.primary || MAIN_THEME_MAP[type]?.antd?.primaryColor;

    dispatch('setThemeModel', type);
    dispatch('setGlobalPrimary', primaryColor);

    // 根据模式添加类名
    html.setAttribute('class', themeConfig?.theme);

    // 设置antd主题色
    ConfigProvider.config({
      theme: {
        ...MAIN_THEME_MAP[type]?.antd,
        primaryColor
      }
    });

    // 添加当前主题模式下配置的颜色
    for (const [key, value] of Object.entries(themeColor)) {
      document.documentElement.style.setProperty(key, value);
    }
  };

  const initTheme = () => {
    setThemeColor();
  };

  return {
    initTheme,
    changePrimaryColor,
    setThemeColor
  };
};
