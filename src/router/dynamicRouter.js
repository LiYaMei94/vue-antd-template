/**
 * @description 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径,示例views/channelManage/list，使用方自行拼接
 * @param hidden ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.isLink ==> 是否外链，如果是，需要使用a标签跳转
 * @param meta.isFull ==> 是否全屏
 * */
export const routerData = [
  {
    name: 'Home',
    path: '/home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/home'),
    meta: {
      title: '首页'
    }
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
    meta: {
      title: '数据大屏'
    }
  },
  {
    name: 'System',
    path: '/system',
    redirect: '/system/index',
    meta: {
      title: '系统设置'
    },
    children: [
      {
        name: 'SystemIndex',
        path: '/system/index',
        component: () => import(/* webpackChunkName: "SystemIndex" */ '@/views/system'),
        meta: {
          title: '权限管理',
          modelName: 'System',
          parentName: 'System'
        }
      },
      {
        name: 'SystemUser',
        path: '/system/user',
        component: () => import(/* webpackChunkName: "SystemUser" */ '@/views/system/user.vue'),
        meta: {
          title: '用户管理',
          modelName: 'System',
          parentName: 'System'
        }
      },
      {
        name: 'SystemRole',
        path: '/system/role',
        component: () => import(/* webpackChunkName: "SystemRole" */ '@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          modelName: 'System',
          parentName: 'System'
        }
      }
    ]
  }
];
