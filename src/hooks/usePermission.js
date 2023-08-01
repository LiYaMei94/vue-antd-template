import { reactive, toRefs } from 'vue';
import route from '@/router';
import { routerData } from '@/router/dynamicRouter';
import _ from 'lodash';
import db from '@/utils/db';
import { useStore } from 'vuex';
import { ROUTE_MENU_TYPE_TOP, ROUTE_MENU_TYPE_SIDE, ROUTE_MENU_MAP } from '@/utils/const';

const DB = new db();
export const usePermission = (options) => {
  const { dispatch } = useStore();

  const state = reactive({});

  // 动态更新路由
  const updateRoute = async (routers) => {
    _.forEach(routers, (item) => {
      const currentRouter = _.cloneDeep(item);
      const layout = ROUTE_MENU_MAP[item.meta.layout];
      if (currentRouter.component && typeof currentRouter.component == 'string') {
        // FIXME:component是页面地址
        currentRouter.component = () => import(`@/views/${currentRouter.component}.vue`);
      }
      // 添加路由
      if (layout) {
        route.addRoute(layout, currentRouter);
      } else {
        route.addRoute(currentRouter);
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
          let newItem = _.cloneDeep(item);
          // FIXME:顶部菜单不展示子菜单
          newItem = { ...newItem, children: [] };
          topMenuRouteData.push(newItem);
        }
        if (typeStr?.includes(ROUTE_MENU_TYPE_SIDE)) {
          sideMenuRouteData.push(item);
        }
      });
      await updateRoute([...topMenuRouteData, ...sideMenuRouteData]);
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
