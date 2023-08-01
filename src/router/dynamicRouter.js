import {
  ROUTE_MENU_TYPE_TOP,
  ROUTE_MENU_TYPE_SIDE,
  ROUTE_MENU_LAYOUT_FULLSCREEN,
  ROUTE_MENU_LAYOUT_BASIC,
  ROUTE_MENU_LAYOUT_UPPER_MIDDLE
} from '@/utils/const';
/**
 * @description 路由参数配置简介
 * @param path ==> key值，唯一值
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径,示例views/channelManage/list，使用方自行拼接
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单（当前路由是子菜单，父级菜单高亮）
 * @param meta.parentID ==> 当前路由的父级，设置openKey
 * @param meta.isLink ==> 是否外链，如果是，需要使用a标签跳转
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.layout ==> 菜单布局，全屏，上下、上中(侧边栏-内容)下
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * @param meta.type ==> 当前路由路由菜单类型(['top','side'])
 * */
export const routerData = [
  {
    key: '1',
    name: 'Home',
    path: '/home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/home'),
    meta: {
      title: '首页',
      activeMenu: '1',
      parentID: null,
      layout: ROUTE_MENU_LAYOUT_UPPER_MIDDLE,
      type: [ROUTE_MENU_TYPE_TOP]
    }
  },
  {
    key: '2',
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
    meta: {
      title: '数据大屏',
      activeMenu: '2',
      parentID: null,
      layout: ROUTE_MENU_LAYOUT_FULLSCREEN,
      type: [ROUTE_MENU_TYPE_TOP]
    }
  },
  {
    key: '3',
    name: 'System',
    path: '/system',
    redirect: '/system/index',
    meta: {
      title: '系统设置',
      activeMenu: '3',
      layout: ROUTE_MENU_LAYOUT_BASIC,
      type: [ROUTE_MENU_TYPE_TOP, ROUTE_MENU_TYPE_SIDE]
    },
    children: [
      {
        key: '3-1',
        name: 'SystemIndex',
        path: '/system/index',
        component: () => import(/* webpackChunkName: "SystemIndex" */ '@/views/system'),
        meta: {
          title: '权限管理',
          activeMenu: '3-1',
          parentID: '3',
          layout: ROUTE_MENU_LAYOUT_BASIC,
          type: [ROUTE_MENU_TYPE_SIDE]
        }
      },
      {
        key: '3-2',
        name: 'SystemUser',
        path: '/system/user',
        component: () => import(/* webpackChunkName: "SystemUser" */ '@/views/system/user.vue'),
        meta: {
          title: '用户管理',
          activeMenu: '3-2',
          parentID: '3',
          layout: ROUTE_MENU_LAYOUT_BASIC,
          type: [ROUTE_MENU_TYPE_SIDE]
        }
      },
      {
        key: '3-3',
        name: 'SystemRole',
        path: '/system/role',
        component: () => import(/* webpackChunkName: "SystemRole" */ '@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          activeMenu: '3-3',
          parentID: '3',
          layout: ROUTE_MENU_LAYOUT_BASIC,
          type: [ROUTE_MENU_TYPE_SIDE]
        }
      }
    ]
  }
];
