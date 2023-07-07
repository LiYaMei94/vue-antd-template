import { createRouter, createWebHashHistory } from 'vue-router';
import _ from 'lodash';
import { staticRoutes, errorRouter } from './staticRouter';
import { usePermission } from '@/hooks/usePermission';
import { useStore } from 'vuex';

const router = createRouter({
  history: createWebHashHistory(),
  strict: false,
  routes: [...staticRoutes, ...errorRouter]
});

// 白名单
const routerWhiteNameList = ['UserLogin', '404', '403', '500'];

// 路由拦截
router.beforeEach(async (to, from, next) => {
  try {
    console.log('to, from, next', to, from, next);
    const { getMenuList } = usePermission();
    const { state } = useStore();
    // FIXME:1.动态设置标题，根据各平台自行配置
    const title = '消息平台';
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

    // 2.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (routerWhiteNameList.includes(to.name)) return next();

    // 3.如果没有菜单数据就重新请求，并生成路由
    if (!state?.user?.sideMenuList?.length) {
      await getMenuList();
      return next({ ...to, replace: true });
    }

    return next();
  } catch (error) {
    console.log('error', error);
  }
});
export default router;
