import db from '@/utils/db';

const DB = new db();

export default {
  state: () => ({
    sideMenuList: []
  }),
  actions: {
    setSideMenuList({ commit }, val) {
      commit('setSideMenuList', val);
    }
  },
  mutations: {
    setSideMenuList(state, val) {
      DB.setLocal('sideMenuList', val);
      state.sideMenuList = val;
    }
  }
};
