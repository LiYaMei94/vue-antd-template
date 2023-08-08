import { reactive, toRefs } from 'vue';
import route from '@/router';
import _ from 'lodash';
import db from '@/utils/db';
import { useStore } from 'vuex';
import { isNull } from '@/utils/utils';
import { getRoutes } from '@/api/user';
import { routerData } from '@/router/dynamicRouter';

const DB = new db();
const isPermission = process.env.VUE_APP_route_permission === 'true';

export const usePermission = (options) => {
  const { dispatch } = useStore();

  const state = reactive({});

  /**
   * 获取路由数据
   */
  const getRouteData = async () => {
    try {
      const data = await getRoutes();
      const routesData = _.cloneDeep(data);

      // 路由
      const routes = filterRouter(_.cloneDeep(routesData), undefined);
      const topMenuData = filterTopMenu(_.cloneDeep(routesData));
      const sideMenuData = filterSideMenu(_.cloneDeep(routesData));
      console.log('topMenuData', topMenuData);
      console.log('sideMenuData', sideMenuData);
      // 设置路由
      setRoutes(routes);
      // 设置菜单
      dispatch('setMenuData', { side: sideMenuData, top: topMenuData || [] });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 遍历后台传来的路由数据，转换为组件对象
   * @param asyncRouterMap 后台传来的路由数据
   * @param lastRouter 上一级路由
   */
  const filterRouter = (asyncRouterMap, lastRouter) => {
    try {
      return asyncRouterMap.filter((route) => {
        const currentRouter = _.cloneDeep(route);
        if (route?.children?.length > 0) {
          route.children = filterChildren(route.children, undefined);
        }
        if (route.component) {
          route.component = () => import(`@/views/${currentRouter.component}.vue`);
        }
        return true;
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 子路由
   * @param {*} childrenMap
   * @param {*} lastRouter
   * @returns
   */
  const filterChildren = (childrenMap, lastRouter) => {
    try {
      let children = [];
      childrenMap.forEach((el) => {
        const cloneEl = _.cloneDeep(el);
        if (cloneEl?.children?.length > 0) {
          cloneEl.children.forEach((c) => {
            const currentRouter = _.cloneDeep(c);
            c.path = `${cloneEl.path}/${c.path}`;
            c.name = `${cloneEl.name}${c.name}`;
            c.meta.parentName = `${cloneEl.name}`;
            if (c.component) {
              c.component = () => import(`@/views/${currentRouter.component}.vue`);
            }
            if (c?.children?.length > 0) {
              children = children.concat(filterChildren(c.children, c));
              return;
            }
            children.push(c);
          });
          return;
        }

        if (cloneEl.component) {
          cloneEl.component = () => import(`@/views/${el.component}.vue`);
        }

        if (lastRouter) {
          cloneEl.path = `${lastRouter.path}/${el.path}`;
          cloneEl.name = `${lastRouter.name}${el.name}`;
          cloneEl.meta.parentName = `${lastRouter.name}`;
        }
        children = children.concat(cloneEl);
      });
      return children;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 添加路由
   * @param {*} router
   */
  const addRoute = (router) => {
    try {
      if (router?.meta?.isFull) {
        route.addRoute({ ...router });
      } else {
        route.addRoute('BasicLayout', { ...router });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 设置路由
   * @param {*} routes
   */
  const setRoutes = (routes) => {
    try {
      _.forEach(routes, (item) => {
        item = {
          ...item,
          path: `/${item.path}`
        };
        if (item?.children?.length > 0) {
          item.redirect = !isNull(item.redirect) ? item.redirect : !item?.children[0]?.hidden ? `${item.path}/${item?.children[0]?.path}` : ``;
          item.children = _.map(item.children, (child) => {
            const path = `${item.path}/${child.path}`;
            const name = `${item.name}${child.name}`;
            child = {
              ...child,
              path,
              name,
              meta: {
                ...child.meta,
                modelName: item.name,
                parentName: `${item.name}${child.meta.parentName}`
              }
            };
            return child;
          });
        }
        addRoute(item);
      });
      // console.log(route.getRoutes());
    } catch (error) {
      console.log(error);
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
        route.path = isPermission ? `/${route.path}` : `${route.path}`;
        if (route?.children?.length > 0) {
          delete route['children'];
        }
        return [];
      });
    } catch (error) {
      console.log(error);
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
        menuMap[model.name] = isPermission ? filterSideChildren(model.children || [], { ...model, path: `/${model.path}` }) : model.children || [];
      });
      return menuMap;
    } catch (error) {
      console.log(error);
    }
  };

  const filterSideChildren = (childrenMap, firstRouter) => {
    try {
      return childrenMap.filter((el) => {
        if (el?.hidden) {
          return false;
        }
        el.path = `${firstRouter.path}/${el.path}`;
        el.name = `${firstRouter.name}${el.name}`;
        el.meta.parentName = `${firstRouter.name}`;
        if (el?.children?.length > 0) {
          el.children = filterSideChildren(el.children, el);
        }
        return true;
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 获取按钮数据
  const getButtonList = async () => {
    dispatch('setButtonList', []);
  };

  // 不校验路由权限，使用本地的路由即可
  const setDefaultRoute = () => {
    const topMenuData = filterTopMenu(_.cloneDeep(routerData));
    const sideMenuData = filterSideMenu(_.cloneDeep(routerData));
    console.log('topMenuData', topMenuData);
    // 设置菜单
    dispatch('setMenuData', { side: sideMenuData, top: topMenuData || [] });
  };

  return {
    ...toRefs(state),
    getRouteData,
    getButtonList,
    setDefaultRoute
  };
};
