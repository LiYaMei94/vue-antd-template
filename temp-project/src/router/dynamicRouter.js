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
    },
    children: [
      {
        name: 'BusinessLibrary',
        path: '/business/library',
        meta: {
          title: '企业库',
          isFrame: '1',
          icon: '',
          pageLayout: '1'
        },
        children: [
          {
            name: 'BusinessLibraryPlatform',
            path: '/business/library/platform',
            meta: {
              title: '平台企业',
              isFrame: '1',
              icon: '',
              pageLayout: '1'
            },
            children: [
              {
                name: 'BusinessLibraryPlatformFirmList',
                path: '/business/library/platform/firm/list',
                component: () => import(/* webpackChunkName: "BusinessLibraryPlatformFirmList" */ '@/views/business/library/firm/list'),
                meta: {
                  title: '企业管理',
                  isFrame: '1',
                  icon: '',
                  pageLayout: '1'
                }
              },
              {
                name: 'BusinessLibraryPlatformPersonnel',
                path: '/business/library/platform/personnel',
                component: () => import(/* webpackChunkName: "BusinessLibraryPlatform" */ '@/views/business/library/personnel/list'),
                meta: {
                  title: '组织人员',
                  isFrame: '1',
                  icon: '',
                  pageLayout: '1'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Construction',
    path: '/construction',
    meta: {
      title: '项目施工管理',
      subtitle: '经验案例、人力物资、常用模板',
      isFrame: '1',
      icon: 'model-4',
      pageLayout: '1'
    },
    children: [
      {
        meta: {
          title: '鹰眼监控',
          isFrame: '1',
          pageLayout: '1'
        },

        path: '/construction/monitor',
        name: 'ConstructionMonitor',
        component: () => import(/* webpackChunkName: "BasicSystemStation" */ '@/views/construction/monitor/list')
      }
    ]
  },
  {
    name: 'Supervision',
    path: '/supervision',
    meta: {
      title: '项目监管管理',
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
      icon: 'model-5',
      pageLayout: '1'
    },
    children: []
  },
  {
    name: 'Basic',
    path: '/basic',
    meta: {
      title: '基础配置管理',
      subtitle: '支持光伏工程业务现场管理',
      isFrame: '1',
      icon: 'model-6',
      pageLayout: '1'
    },
    children: [
      {
        name: 'BasicSystem',
        path: '/basic/system',
        meta: {
          title: '系统管理',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'BasicSystemConfig',
            path: '/basic/system/config',
            meta: {
              title: '系统配置',
              isFrame: '1',
              pageLayout: '1'
            },
            children: [
              {
                name: 'BasicSystemConfigMenu',
                path: '/basic/system/config/menu',
                component: () => import(/* webpackChunkName: "BasicSystemConfigMenu" */ '@/views/basic/system/menu/list'),
                meta: {
                  title: '菜单管理',
                  isFrame: '1',
                  pageLayout: '1'
                }
              },
              {
                name: 'BasicSystemConfigDataDict',
                path: '/basic/system/config/dataDict',
                component: () => import(/* webpackChunkName: "BasicSystemConfigDataDict" */ '@/views/basic/system/dataDict/list'),
                meta: {
                  title: '数据字典',
                  isFrame: '1',
                  pageLayout: '1'
                }
              }
            ]
          },
          {
            name: 'BasicSystemLog',
            path: '/basic/system/log',
            meta: {
              title: '系统日志',
              isFrame: '1',
              pageLayout: '1'
            },
            children: [
              {
                name: 'BasicSystemLogLogin',
                path: '/basic/system/log/login',
                component: () => import(/* webpackChunkName: "BasicSystemLogLogin" */ '@/views/basic/system/loginLog/list'),
                meta: {
                  title: '登录日志',
                  isFrame: '1',
                  pageLayout: '1'
                }
              },
              {
                name: 'BasicSystemLogOperation',
                path: '/basic/system/log/operation',
                component: () => import(/* webpackChunkName: "BasicSystemLogOperation" */ '@/views/basic/system/operationLog/list'),
                meta: {
                  title: '操作日志',
                  isFrame: '1',
                  pageLayout: '1'
                }
              }
            ]
          }
        ]
      },
      {
        name: 'BasicPermission',
        path: '/basic/permission',
        meta: {
          title: '权限管理',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'BasicPermissionUser',
            path: '/basic/permission/user',
            meta: {
              title: '用户权限',
              isFrame: '1',
              pageLayout: '1'
            },
            children: [
              {
                name: 'BasicPermissionUserList',
                path: '/basic/permission/user/list',
                component: () => import(/* webpackChunkName: "BasicPermissionUserList" */ '@/views/basic/permission/user/list'),
                meta: {
                  title: '用户管理',
                  isFrame: '1',
                  pageLayout: '1'
                }
              },
              {
                name: 'BasicPermissionUserRole',
                path: '/basic/permission/user/role',
                component: () => import(/* webpackChunkName: "BasicPermissionUserRole" */ '@/views/basic/permission/role/list'),
                meta: {
                  title: '角色管理',
                  isFrame: '1',
                  pageLayout: '1'
                }
              },
              {
                name: 'BasicPermissionUserAuth',
                path: '/basic/permission/user/auth',
                component: () => import(/* webpackChunkName: "BasicPermissionUserAuth" */ '@/views/basic/permission/auth/list'),
                meta: {
                  title: '权限配置',
                  isFrame: '1',
                  pageLayout: '1'
                }
              }
            ]
          }
        ]
      },
      {
        name: 'BasicFlowEngine',
        path: '/basic/flowEngine',
        meta: {
          title: '流程引擎',
          isFrame: '1',
          pageLayout: '1'
        },
        children: [
          {
            name: 'BasicFlowEngineManage',
            path: '/basic/flowEngine/manage',
            meta: {
              title: '流程管理',
              isFrame: '1',
              pageLayout: '1'
            },
            children: [
              {
                name: 'BasicFlowEngineManageMonitor',
                path: '/basic/flowEngine/manage/monitor',
                component: () => import(/* webpackChunkName: "BasicFlowEngineManageMonitor" */ '@/views/basic/flowEngine/monitor/list'),
                meta: {
                  title: '流程监控',
                  isFrame: '1',
                  pageLayout: '1'
                }
              },
              {
                name: 'BasicFlowEngineManageConfig',
                path: '/basic/flowEngine/manage/config',
                component: () => import(/* webpackChunkName: "BasicFlowEngineManageConfig" */ '@/views/basic/flowEngine/config/list'),
                meta: {
                  title: '流程配置',
                  isFrame: '1',
                  pageLayout: '1'
                }
              }
            ]
          },
          {
            name: 'BasicFlowEngineDesign',
            path: '/basic/flowEngine/design',
            meta: {
              title: '流程设计',
              isFrame: '1',
              pageLayout: '1'
            },
            children: [
              {
                name: 'BasicFlowEngineDesignManage',
                path: '/basic/flowEngine/design/manage',
                component: () => import(/* webpackChunkName: "BasicFlowEngineDesignManage" */ '@/views/basic/flowEngine/design/list'),
                meta: {
                  title: '流程设计',
                  isFrame: '1',
                  pageLayout: '1'
                }
              },
              {
                name: 'BasicFlowEngineDesignForm',
                path: '/basic/flowEngine/form/list',
                component: () => import(/* webpackChunkName: "BasicFlowEngineDesignForm" */ '@/views/basic/flowEngine/form/list.vue'),
                meta: {
                  title: '流程表单',
                  isFrame: '1',
                  pageLayout: '1'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
