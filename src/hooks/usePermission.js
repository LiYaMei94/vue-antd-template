import { reactive, toRefs } from 'vue';
import route from '@/router';
import _ from 'lodash';
import { useStore } from 'vuex';
import { isNull, isString, treeToArr } from '@/utils/utils';
import { getUserInfo, getRoutesInfo } from '@/api/user';
import { routerData } from '@/router/dynamicRouter';
import { CONST_STRING_1 } from '@/utils/const';

/**
 *
 * @param {*} options
 * @returns
 */
export const usePermission = (options) => {
  const { dispatch } = useStore();
  const isPermission = process.env?.VUE_APP_route_permission === 'true';
  const state = reactive({});

  // 重新分配角色刷新;
  const refresh = () => {
    isPermission ? getRouteData() : setDefaultMenu();
    getUserData();
  };

  /**
   * 获取路由数据
   */
  const getRouteData = async () => {
    try {
      const routeInfo = (await getRoutesInfo())?.data;
      let newRouteInfo = routeInfo; // 所有路由数据
      // FIXME:删除业务平台和管理平台这级的菜单
      // const deleteIndex = _.findIndex(routeInfo, (item) => item?.menuType === MENU_TYPE_R);
      // if (!isNull(deleteIndex)) {
      //   _.forEach(routeInfo, (item) => {
      //     newRouteInfo = item.children?.length ? newRouteInfo.concat(item.children) : newRouteInfo;
      //   });
      // }
      // 路由
      const routes = filterRouter(newRouteInfo);
      // 顶部导航
      const topMenuData = filterTopMenu(_.cloneDeep(newRouteInfo));
      // 侧边栏
      const sideMenuData = filterSideMenu(_.cloneDeep(newRouteInfo));
      // console.log('topMenuData', topMenuData);
      // console.log('sideMenuData', sideMenuData);
      // 设置路由
      addRoute(treeToArr(routes));
      // 设置菜单
      dispatch('setMenuData', { side: sideMenuData, top: topMenuData || [] });
    } catch (error) {
      console.error('hooks-usePermission-getRouteData', error);
    }
  };

  /**
   * 过滤路由数据
   * @param {*} asyncRouterMap
   * @returns
   */
  const filterRouter = (asyncRouterMap) => {
    try {
      return asyncRouterMap.map((route) => {
        if (route?.children?.length > 0) {
          // 设置redirect地址
          route.redirect = setRedirect(route);
          route.children = filterChildren(route.children, route.name, route.name);
        }
        return route;
      });
    } catch (error) {
      console.error('hooks-usePermission-filterRouter', error);
    }
  };

  /**
   * 子路由
   * @param {*} children
   * @param {*} modelName
   * @param {*} parentName
   * @returns
   */
  const filterChildren = (children, modelName, parentName) => {
    try {
      return children.map((child) => {
        child = {
          ...child,
          redirect: setRedirect(child),
          meta: {
            ...child.meta,
            modelName,
            parentName
          }
        };
        if (child?.children?.length > 0) {
          child.children = filterChildren(child?.children, modelName, child.name);
        }
        return child;
      });
    } catch (error) {
      console.error('hooks-usePermission-filterChildren', error);
    }
  };

  /**
   * 设置重定向地址
   * @param {*} route
   * @returns
   */
  const setRedirect = (route) => {
    try {
      const redirect =
        route?.redirect && !isNull(route?.redirect)
          ? route.redirect
          : route?.children?.length && !route?.children[0]?.hidden
          ? route?.children[0]?.path
          : ``;
      return redirect;
    } catch (error) {
      console.error('hooks-usePermission-setRedirect', error);
    }
  };

  /**
   * 添加路由
   * @param {*} routers
   */
  const addRoute = (routers) => {
    try {
      _.forEach(routers, (router) => {
        const newRouter = _.cloneDeep(router);
        delete router?.children;
        // 设置组件
        if (!isNull(router.component) && isString(router.component)) {
          router.component = () => import(`@/views/${newRouter.component}.vue`);
        }
        if (!isNull(router?.path)) {
          if (router?.meta?.pageLayout !== CONST_STRING_1) {
            route.addRoute({ ...router });
          } else {
            route.addRoute('BasicLayout', { ...router });
          }
        }
      });
      // console.log('所有路由', route.getRoutes());
    } catch (error) {
      console.error('hooks-usePermission-addRoute', error);
    }
  };

  /**
   * 顶部导航菜单
   * @param {*} asyncRouterMap
   * @returns
   */
  const filterTopMenu = (asyncRouterMap) => {
    try {
      return asyncRouterMap.filter((route) => {
        if (route?.children?.length > 0) {
          delete route['children'];
        }
        return [];
      });
    } catch (error) {
      console.error('hooks-usePermission-filterTopMenu', error);
    }
  };

  /**
   * 侧边导航
   * @param {*} asyncRouterMap
   * @returns
   */
  const filterSideMenu = (asyncRouterMap) => {
    try {
      const menuMap = {};
      asyncRouterMap.map((route) => {
        const model = _.cloneDeep(route);
        if (model.name) {
          menuMap[model.name] = filterSideChildren(model.children);
        }
      });
      return menuMap;
    } catch (error) {
      console.error('hooks-usePermission-filterSideMenu', error);
    }
  };

  const filterSideChildren = (childrenMap = []) => {
    try {
      return childrenMap.filter((el) => {
        if (el?.hidden) {
          return false;
        }
        if (el?.children?.length > 0) {
          el.children = filterSideChildren(el.children);
        }
        return true;
      });
    } catch (error) {
      console.error('hooks-usePermission-filterSideChildren', error);
    }
  };

  // 用户信息&&按钮权限
  const getUserData = async () => {
    try {
      const result = await getUserInfo({});
      const userInfo = result?.data?.user || {};
      const permissions = result?.data?.permissions || [];
      dispatch('setButtonList', permissions);
      dispatch('setUserInfo', userInfo);
    } catch (error) {}
  };

  // 不校验路由权限，使用本地的路由即可
  const setDefaultMenu = () => {
    const topMenuData = filterTopMenu(_.cloneDeep(routerData));
    const sideMenuData = filterSideMenu(_.cloneDeep(routerData));
    // 设置菜单
    dispatch('setMenuData', { side: sideMenuData, top: topMenuData || [] });
  };

  return {
    ...toRefs(state),
    refresh,
    getRouteData,
    getUserData,
    setDefaultMenu
  };
};
