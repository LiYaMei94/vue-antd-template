import db from '@/utils/db';

const DB = new db();

export default {
  state: () => ({
    buttonList: DB.getLocal('buttonList') || [],
    menuData: null
  }),
  actions: {
    setMenuData({ commit }, val) {
      commit('setMenuData', val);
    },
    setButtonList({ commit }, val) {
      commit('setButtonList', val);
    }
  },
  mutations: {
    setMenuData(state, val) {
      DB.setLocal('menuData', val);
      state.menuData = val;
    },
    setButtonList(state, val) {
      DB.setLocal('buttonList', val);
      state.buttonList = val;
    }
  }
};
