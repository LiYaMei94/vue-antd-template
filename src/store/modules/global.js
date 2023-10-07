import { DEFAULT_PRIMARY_COLOR, LIGHT_THEME } from '@/config/theme';
import db from '@/utils/db';
const DB = new db();

export default {
  state: () => ({
    // 主题颜色
    primary: DB.getLocal('primary-color') || DEFAULT_PRIMARY_COLOR,
    // 主题模式
    theme: DB.getLocal('theme') || LIGHT_THEME,
    // antd-design-vue 全局配置
    antConfig: DB.getLocal('antConfig') || {},
    // 标签页
    showTabs: true,
    // 当前模块
    menuModel: DB.getLocal('menuModel') || '',
    menuTopModel: DB.getLocal('menuTopModel') || '',
    tabsMenuList: DB.getSession('tabsMenuList') || []
  }),
  getters: {},
  actions: {
    setGlobalPrimary({ commit }, val) {
      commit('setGlobalPrimary', val);
    },
    setThemeModel({ commit }, val) {
      commit('setThemeModel', val);
    },
    setAntConfig({ commit }, val) {
      commit('setAntConfig', val);
    },
    setTabsMenuList({ commit }, val) {
      commit('setTabsMenuList', val);
    },
    setMenuModel({ commit }, val) {
      commit('setMenuModel', val);
    },
    setMenuTopModel({ commit }, val) {
      commit('setMenuTopModel', val);
    },
    setShowTabs({ commit }, val) {
      commit('setShowTabs', val);
    }
  },
  mutations: {
    setGlobalPrimary(state, val) {
      DB.setLocal('primary-color', val);
      state.primary = val;
    },
    setThemeModel(state, val) {
      DB.setLocal('theme', val);
      state.theme = val;
    },
    setAntConfig(state, val) {
      DB.setLocal('antConfig', val);
      state.antConfig = val;
    },
    setTabsMenuList(state, val) {
      DB.setSession('tabsMenuList', val);
      state.tabsMenuList = val;
    },
    setMenuModel(state, val) {
      DB.setLocal('menuModel', val);
      state.menuModel = val;
    },
    setMenuTopModel(state, val) {
      DB.setLocal('menuTopModel', val);
      state.menuTopModel = val;
    },
    setShowTabs(state, val) {
      state.setShowTabs = val;
    }
  }
};
