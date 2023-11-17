import { DEFAULT_PRIMARY_COLOR, LIGHT_THEME } from '@/config/theme';
import DB from '@/utils/db';

export default {
  state: () => ({
    // 主题颜色
    primary: DB.getLocal('primary-color') || DEFAULT_PRIMARY_COLOR,
    // 主题模式
    theme: DB.getSession('theme') || DB.getLocal('theme') || LIGHT_THEME,
    // antd-design-vue 全局配置
    antConfig: DB.getLocal('antConfig') || {},
    // 标签页
    showTabs: true,
    // 当前模块
    menuModel: DB.getSession('menuModel') || DB.getLocal('menuModel') || null,
    menuTopModel: DB.getSession('menuTopModel') || DB.getLocal('menuTopModel') || null,
    tabsMenuList: DB.getSession('tabsMenuList') || DB.getLocal('tabsMenuList') || [],
    layoutSiderCollapsed: false,
    projectInfo: DB.getSession('projectInfo') || DB.getLocal('projectInfo') || []
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
    clearMenuInfo({ commit }) {
      commit('clearMenuInfo');
    },
    setShowTabs({ commit }, val) {
      commit('setShowTabs', val);
    },
    setLayoutSiderCollapsed({ commit }, val) {
      commit('setLayoutSiderCollapsed', val);
    },
    setProjectInfo({ commit }, val) {
      commit('setProjectInfo', val);
    }
  },
  mutations: {
    setGlobalPrimary(state, val) {
      DB.setSession('primary-color', val);
      DB.setLocal('primary-color', val);
      state.primary = val;
    },
    setThemeModel(state, val) {
      DB.setSession('theme', val);
      DB.setLocal('theme', val);
      state.theme = val;
    },
    setAntConfig(state, val) {
      DB.setLocal('antConfig', val);
      state.antConfig = val;
    },
    setTabsMenuList(state, val) {
      DB.setSession('tabsMenuList', val);
      DB.setLocal('tabsMenuList', val);
      state.tabsMenuList = val;
    },
    setMenuModel(state, val) {
      DB.setSession('menuModel', val);
      DB.setLocal('menuModel', val);
      state.menuModel = val;
    },
    setMenuTopModel(state, val) {
      DB.setSession('menuTopModel', val);
      DB.setLocal('menuTopModel', val);
      state.menuTopModel = val;
    },
    clearMenuInfo(state) {
      DB.deleteSession('menuTopModel');
      DB.deleteLocal('menuTopModel');
      DB.deleteSession('menuModel');
      DB.deleteLocal('menuModel');
      state.menuTopModel = null;
      state.menuModel = null;
    },
    setShowTabs(state, val) {
      state.setShowTabs = val;
    },
    setLayoutSiderCollapsed(state, val) {
      state.layoutSiderCollapsed = val;
    },
    setProjectInfo(state, val) {
      DB.setSession('projectInfo', val);
      DB.setLocal('projectInfo', val);
      state.projectInfo = val;
    }
  }
};
