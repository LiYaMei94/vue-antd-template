import { reactive, toRefs } from 'vue';
import route from '@/router';
import { basicLayoutRouters } from '@/router/dynamicRouter';
import _ from 'lodash';
import db from '@/utils/db';
import { useStore } from 'vuex';

const DB = new db();
// 引入 views 文件夹下所有 vue 文件
export const usePermission = (options) => {
  const { dispatch } = useStore();

  const state = reactive({});

  // 动态更新路由
  const updateRoute = async (routers) => {
    _.forEach(routers, (item) => {
      const currentRouter = _.cloneDeep(item);
      if (currentRouter.component && typeof currentRouter.component == 'string') {
        currentRouter.component = () => import(`@/views/${currentRouter.component}.vue`);
      }
      if (item.meta.isFull) {
        route.addRoute(currentRouter);
      } else {
        route.addRoute('BasicLayout', currentRouter);
      }
    });
  };

  // 获取菜单数据
  const getMenuList = async () => {
    try {
      // TODO:获取后端数据
      const result = process.env.VUE_APP_route_permission ? basicLayoutRouters : basicLayoutRouters;
      state.sideMenuList = result;
      await updateRoute(result);
      await updateMenu(result);
    } catch (error) {}
  };

  // 获取按钮数据
  const getButtonList = async () => {};

  // 更新菜单
  const updateMenu = (menuData) => {
    dispatch('setSideMenuList', menuData);
  };

  return {
    ...toRefs(state),
    updateMenu,
    updateRoute,
    getMenuList,
    getButtonList
  };
};
