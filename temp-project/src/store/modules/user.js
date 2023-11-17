import DB from '@/utils/db';

export default {
  state: () => ({
    buttonList: DB.getSession('buttonList') || DB.getLocal('buttonList') || [],
    menuData: null,
    menuDataLoaded: false,
    userInfo: DB.getSession('userInfo') || DB.getLocal('userInfo') || { userName: 'userName', nickName: 'nickName' }
  }),
  actions: {
    setMenuData({ commit }, val) {
      commit('setMenuData', val);
    },
    setButtonList({ commit }, val) {
      commit('setButtonList', val);
    },
    setUserInfo({ commit }, val) {
      commit('setUserInfo', val);
    }
  },
  mutations: {
    setMenuData(state, val) {
      DB.setLocal('menuData', val);
      state.menuDataLoaded = true;
      state.menuData = val;
    },
    setButtonList(state, val) {
      DB.setLocal('buttonList', val);
      DB.setSession('buttonList', val);
      state.buttonList = val;
    },
    async setUserInfo(state, val) {
      DB.setLocal('userInfo', val);
      DB.setSession('userInfo', val);
      state.userInfo = val;
    }
  }
};
