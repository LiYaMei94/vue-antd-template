import { createStore } from 'vuex';
import global from './modules/global';
/**
 * 创建仓库和导出
 */
const store = createStore({
  state: {},
  actions: {},
  mutations: {},

  modules: {
    global
  }
});
export default store;
