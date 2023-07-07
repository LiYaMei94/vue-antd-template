import { createStore } from 'vuex';
import global from './modules/global';
import user from './modules/user';
/**
 * 创建仓库和导出
 */
const store = createStore({
  state: {},
  actions: {},
  mutations: {},

  modules: {
    global,
    user
  }
});
export default store;
