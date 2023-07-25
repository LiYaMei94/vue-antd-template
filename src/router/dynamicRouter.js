import { ROUTE_MENU_TYPE_TOP, ROUTE_MENU_TYPE_SIDE } from '@/utils/const';
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
 * @param meta.isLink ==> 是否外链，如果是，需要使用a标签跳转
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
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
      isFull: true,
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
      isFull: true,
      type: [ROUTE_MENU_TYPE_TOP]
    }
  },
  {
    key: '3',
    name: 'Side',
    path: '/side',
    component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
    meta: {
      title: '侧边栏2',
      activeMenu: '3',
      isFull: false,
      type: [ROUTE_MENU_TYPE_TOP, ROUTE_MENU_TYPE_SIDE],
      icon: 'MailOutlined'
    }
  },
  {
    key: '4',
    name: 'Test',
    path: '/test',
    component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
    meta: {
      title: '侧边栏3',
      activeMenu: '4',
      isFull: false,
      type: [ROUTE_MENU_TYPE_SIDE],
      icon: 'MailOutlined'
    }
  },
  {
    key: '5',
    name: 'Name',
    path: '/name',
    component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
    meta: {
      title: 'name',
      isFull: false,
      type: [ROUTE_MENU_TYPE_SIDE],
      icon: 'MailOutlined'
    },
    children: [
      {
        key: '5-1',
        name: 'Name',
        path: '/name',
        component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/dashboard'),
        meta: {
          title: 'name1111',
          activeMenu: '5-1',
          parentID: '5',
          isFull: false,
          type: [ROUTE_MENU_TYPE_SIDE],
          icon: 'MailOutlined'
        }
      }
    ]
  }
];
