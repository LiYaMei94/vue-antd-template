export const routeInfo = [
  {
    name: 'Home',
    path: 'home',
    component: 'home/index',
    meta: {
      title: '首页',
      icon: 'system',
      noCache: false,
      link: null
    }
  },
  {
    name: 'Dashboard',
    path: 'dashboard',
    component: 'dashboard/index',
    meta: {
      title: '数据大屏',
      isFull: true,
      icon: 'system',
      noCache: false,
      link: null
    }
  },
  {
    name: 'System',
    path: 'system',
    hidden: false,
    meta: {
      title: '系统管理',
      icon: 'system',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'Config',
        path: 'config',
        hidden: false,
        meta: {
          title: '系统配置',
          icon: '',
          noCache: false,
          link: null
        },
        children: [
          {
            name: 'Role',
            path: 'role',
            hidden: false,
            component: 'system/index',
            meta: {
              title: '角色管理',
              icon: '',
              noCache: false,
              link: null
            }
          },
          {
            name: 'Menu',
            path: 'menu',
            hidden: false,
            component: 'system/user',
            meta: {
              title: '用户管理',
              icon: '',
              noCache: false,
              link: null
            }
          },
          {
            name: 'Dict',
            path: 'dict',
            hidden: false,
            component: 'system/config/dict/list',
            meta: {
              title: '数据字典',
              icon: '',
              noCache: false,
              link: null
            }
          }
        ]
      }
    ]
  }
];
