import { createRouter, createWebHashHistory } from 'vue-router';
import _ from 'lodash';
import { staticRoutes, errorRouter } from './staticRouter';
import { usePermission } from '@/hooks/usePermission';
import { useStore } from 'vuex';
import db from '@/utils/db';
import { isNull } from '@/utils/utils';
import { ACCESS_TOKEN } from '@/utils/const';

const DB = new db();
const isPermission = process.env?.VUE_APP_route_permission === 'true';
const router = createRouter({
  history: createWebHashHistory(),
  strict: false,
  routes: [...staticRoutes, ...errorRouter]
});

// FIXME:白名单
const routerWhiteNameList = ['UserLogin', 'UserEditPassword', '404', '403', '500'];

// 路由拦截
router.beforeEach(async (to, from, next) => {
  try {
    const { getRouteData, setDefaultRoute } = usePermission();
    const token = DB.getLocal(ACCESS_TOKEN);
    const { state } = useStore();
    // FIXME:1.动态设置标题，根据各平台自行配置
    const title = '工程管理平台';
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

    // 2.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (routerWhiteNameList.includes(to.name)) return next();

    // 3.如果没有侧边菜单数据就重新请求，并生成路由
    if (!state?.user?.menuDataLoaded && isPermission) {
      if (!isNull(token)) {
        await getRouteData();
        return next({ ...to, replace: true });
      } else {
        return next({
          path: '/user/login'
        });
      }
    }

    // 4.不做权限校验
    if (!isPermission) {
      await setDefaultRoute();
    }

    return next();
  } catch (error) {
    console.error('router.beforeEach', error);
  }
});
export default router;
