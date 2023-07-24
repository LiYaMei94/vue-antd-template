import { BasicLayout, UserLayout, UpperMiddleLayout } from '@/layouts';

export const staticRoutes = [
  {
    path: '/',
    component: UpperMiddleLayout,
    redirect: '/home',
    name: 'UpperMiddleLayout',
    children: []
  },
  {
    component: BasicLayout,
    name: 'BasicLayout',
    children: []
  },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: '/user/login',
        name: 'UserLogin',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login.vue')
      }
    ],
    meta: {
      title: '登录'
    }
  }
];

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: '/403',
    name: '403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403.vue'),
    meta: {
      title: '403页面'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue'),
    meta: {
      title: '404页面'
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500.vue'),
    meta: {
      title: '500页面'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue')
  }
];
