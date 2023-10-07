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
  //   name: 'Home',
  //   path: '/home',
  //   component: () => import(/* webpackChunkName: "Home" */ '@/views/home'),
  //   meta: {
  //     title: '首页',
  //     isFrame: '1'
  //   }
  // },
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
    name: 'Project',
    path: '/project',
    redirect: '/project/dept',
    meta: {
      title: '项目管理',
      isFrame: '1',
      icon: 'model-1',
      pageLayout: '1'
    },
    children: [
      {
        name: 'ProjectDept',
        path: '/project/dept',
        redirect: '/project/dept/manage',
        meta: {
          title: '项目部',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'ProjectDeptManage',
            path: '/project/dept/manage',
            redirect: '/project/dept/manage/subcontractor',
            meta: {
              title: '项目部管理',
              isFrame: '1',
              pageLayout: '1'
            },
            children: [
              {
                name: 'ProjectDeptManageSubcontractor',
                path: '/project/dept/manage/subcontractor',
                component: () => import(/* webpackChunkName: "ProjectDeptSubcontractor" */ '@/views/project/dept/subcontractor/list'),
                meta: {
                  title: '分包商',
                  isFrame: '1',
                  pageLayout: '1'
                }
              }
            ]
          }
        ]
      },
      {
        name: 'ProjectAuth',
        path: '/project/auth',
        redirect: '/project/auth/user',
        meta: {
          title: '权限管理',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'ProjectAuthUser',
            path: '/project/auth/user',
            component: () => import(/* webpackChunkName: "ProjectAuthUser" */ '@/views/project/auth/role/list'),
            meta: {
              title: '账号管理',
              isFrame: '1',
              pageLayout: '1'
            }
          },
          {
            name: 'ProjectAuthRole',
            path: '/project/auth/role',
            component: () => import(/* webpackChunkName: "ProjectAuthRole" */ '@/views/project/auth/role/list'),
            meta: {
              title: '角色管理',
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
      isFrame: '1',
      icon: 'model-2',
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
            component: () => import(/* webpackChunkName: "BasicSystemStation" */ '@/views/system/user'),
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
            component: () => import(/* webpackChunkName: "BasicAuthRole" */ '@/views/system/role'),
            meta: {
              title: '角色管理',
              isFrame: '1',
              pageLayout: '1'
            }
          },
          {
            name: 'BasicAuthAccount ',
            path: '/basic/auth/account ',
            component: () => import(/* webpackChunkName: "BasicAuthAccount" */ '@/views/system/role'),
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
