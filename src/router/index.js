import { createRouter, createWebHashHistory } from 'vue-router';
import { BasicLayout, UserLayout } from '@/layouts';
import _ from 'lodash';

const staticRoutes = [
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
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue')
  }
];

const routes = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/channel/list',
    children: [
      /*渠道账号*/
      {
        name: 'ChannelList',
        path: '/channel/list',
        component: () => import(/* webpackChunkName: "channel" */ '@/views/channelManage/list.vue'),
        meta: {
          key: '1-1'
        }
      },
      /*消息模板*/
      {
        name: 'MessageMouldList',
        path: '/message/mould/list',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/list.vue'),
        meta: {
          key: '1-2'
        }
      },
      {
        name: 'MessageMouldCreate',
        path: '/message/mould/:type',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/edit.vue'),
        meta: {
          key: '1-2'
        }
      },
      {
        name: 'MessageMouldEdit',
        path: '/message/mould/:type/:id',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/edit.vue'),
        meta: {
          key: '1-2'
        }
      },
      {
        name: 'MessageMouldDetail',
        path: '/message/mould/:type/:id',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/edit.vue'),
        meta: {
          key: '1-2'
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes, ...routes]
});

// 白名单
const routerWhiteNameList = ['UserLogin', '404', '403', '500'];

// 路由拦截
router.beforeEach(async (to, from, next) => {
  // FIXME:2.动态设置标题，根据各平台自行配置
  const title = '消息平台';
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (routerWhiteNameList.includes(to.name)) return next();

  return next();
});
export default router;
