import { DEFAULT_PRIMARY_COLOR, LIGHT_THEME } from '@/theme';
import db from '@/utils/db';
const DB = new db();

export default {
  state: () => ({
    // 主题颜色
    primary: DB.getLocal('primary-color') || DEFAULT_PRIMARY_COLOR,
    // 主题模式
    theme: DB.getLocal('theme') || LIGHT_THEME,
    allEnum: DB.getLocal('allEnum') || {}
  }),
  getters: {
    channelTypeEnum(state) {
      console.log('state', state);
    }
  },
  actions: {
    setGlobalPrimary({ commit }, val) {
      commit('setGlobalPrimary', val);
    },
    setThemeModel({ commit }, val) {
      commit('setThemeModel', val);
    },
    setAllEnum({ commit }, val) {
      commit('setAllEnum', val);
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
    setAllEnum(state, val) {
      DB.setLocal('allEnum', val);
      state.allEnum = val;
    }
  }
};
