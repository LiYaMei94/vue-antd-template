import { reactive, toRefs } from 'vue';
import route from '@/router';
import { routerData } from '@/router/dynamicRouter';
import _ from 'lodash';
import db from '@/utils/db';
import { useStore } from 'vuex';
import { ROUTE_MENU_TYPE_TOP, ROUTE_MENU_TYPE_SIDE } from '@/utils/const';

const DB = new db();
export const usePermission = (options) => {
  const { dispatch } = useStore();

  const state = reactive({});

  // 动态更新路由
  const updateRoute = async (routers) => {
    _.forEach(routers, (item) => {
      const currentRouter = _.cloneDeep(item);
      if (currentRouter.component && typeof currentRouter.component == 'string') {
        // FIXME:component是页面地址
        currentRouter.component = () => import(`@/views/${currentRouter.component}.vue`);
      }
      if (item.meta.isFull) {
        route.addRoute('UpperMiddleLayout', currentRouter);
      } else {
        route.addRoute('BasicLayout', currentRouter);
      }
    });
    // console.log(route.getRoutes());
  };

  // 获取菜单数据
  const getMenuData = async () => {
    try {
      // TODO:获取后端数据
      const result = process.env.VUE_APP_route_permission ? routerData : routerData;
      const sideMenuRouteData = [];
      const topMenuRouteData = [];
      result.forEach((item) => {
        // FIXME:需要和后端数据做处理
        const typeStr = item?.meta?.type?.join(',');
        if (typeStr?.includes(ROUTE_MENU_TYPE_TOP)) {
          topMenuRouteData.push(item);
        }
        if (typeStr?.includes(ROUTE_MENU_TYPE_SIDE)) {
          sideMenuRouteData.push(item);
        }
      });
      await updateRoute([...sideMenuRouteData, ...topMenuRouteData]);
      dispatch('setMenuData', { side: sideMenuRouteData || [], top: topMenuRouteData || [] });
    } catch (error) {}
  };

  // 获取按钮数据
  const getButtonList = async () => {
    dispatch('setButtonList', []);
  };

  return {
    ...toRefs(state),
    updateRoute,
    getMenuData,
    getButtonList
  };
};
