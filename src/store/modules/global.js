import { DEFAULT_PRIMARY_COLOR, LIGHT_THEME } from '@/theme';
import db from '@/utils/db';
const DB = new db();

export default {
  state: () => ({
    // 主题颜色
    primary: DB.getLocal('primary-color') || DEFAULT_PRIMARY_COLOR,
    // 折叠菜单
    isCollapse: false,
    theme: DB.getLocal('theme') || LIGHT_THEME
  }),
  getters: {},
  actions: {
    setGlobalPrimary({ commit }, val) {
      commit('setGlobalPrimary', val);
    },
    setIsDrak({ commit }, val) {
      commit('setIsDrak', val);
    },
    setThemeModel({ commit }, val) {
      commit('setThemeModel', val);
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
    }
  }
};
