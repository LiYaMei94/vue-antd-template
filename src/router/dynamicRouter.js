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
 * @param meta.isFrame ==> 是否外链，如果是，需要使用a标签跳转
 * @param meta.pageLayout ==> 0 全屏 1非全屏
 * */
export const routerData = [
  // {
  //   name: 'Dashboard',
  //   path: '/dashboard',
  //   component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
  //   meta: {
  //     title: '数据大屏',
  //     isFrame: '1',
  //     pageLayout: '0'
  //   }
  // },
  {
    name: 'Dashboard',
    path: '/dashboard',
    meta: {
      title: '监管驾驶舱',
      subtitle: '全项目远程可视化监管大屏局监管',
      isFrame: '1',
      icon: 'model-1',
      pageLayout: '1'
    }
  },
  {
    name: 'Business',
    path: '/business',
    meta: {
      title: '企业管理',
      subtitle: '账号管理等基础配置',
      isFrame: '1',
      icon: 'model-2',
      pageLayout: '1'
    }
  },
  {
    name: 'Construction',
    path: '/construction',
    meta: {
      title: '项目施工管理',
      subtitle: '经验案例、人力物资、常用模板',
      isFrame: '1',
      icon: 'model-6',
      pageLayout: '1'
    },
    children: []
  },
  {
    name: 'Supervise',
    path: '/supervise',
    meta: {
      title: '项目监管',
      subtitle: 'EPC工程关联方信息管理',
      isFrame: '1',
      icon: 'model-3',
      pageLayout: '1'
    }
  },
  {
    name: 'Library',
    path: '/library',
    meta: {
      title: '资源库管理',
      subtitle: '公司层面对项目的统一监管',
      isFrame: '1',
      icon: 'model-4',
      pageLayout: '1'
    },
    children: [
      {
        name: 'LibraryProcedure',
        path: '/library/procedure',
        meta: {
          title: '手续管理',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'LibraryProcedureTemplate',
            path: '/library/procedure/template',
            component: () => import(/* webpackChunkName: "BasicSystemStation" */ '@/views/library/procedure/template/list'),
            meta: {
              title: '手续标准库',
              isFrame: '1',
              pageLayout: '1'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'Basic',
    path: '/basic',
    meta: {
      title: '基础配置管理',
      subtitle: '支持光伏工程业务现场管理',
      isFrame: '1',
      icon: 'model-5',
      pageLayout: '1'
    },
    children: [
      {
        name: 'BasicSystem',
        path: '/basic/system',
        meta: {
          title: '系统设置',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'BasicSystemStation',
            path: '/basic/system/station',
            component: () => import(/* webpackChunkName: "BasicSystemStation" */ '@/views/basic/system/user'),
            meta: {
              title: '岗位管理',
              isFrame: '1',
              pageLayout: '1'
            }
          }
        ]
      },
      {
        name: 'BasicAuth',
        path: '/basic/auth',
        meta: {
          title: '权限管理',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'BasicAuthRole',
            path: '/basic/auth/role',
            component: () => import(/* webpackChunkName: "BasicAuthRole" */ '@/views/basic/system/role'),
            meta: {
              title: '角色管理',
              isFrame: '1',
              pageLayout: '1'
            }
          },
          {
            name: 'BasicAuthAccount',
            path: '/basic/auth/account',
            component: () => import(/* webpackChunkName: "BasicAuthAccount" */ '@/views/basic/system/role'),
            meta: {
              title: '账号管理',
              isFrame: '1',
              pageLayout: '1'
            }
          }
        ]
      }
    ]
  }
];
