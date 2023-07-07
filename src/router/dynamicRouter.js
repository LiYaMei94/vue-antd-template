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
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * */
export const basicLayoutRouters = [
  {
    key: '1',
    name: 'ConfigManage',
    path: '',
    redirect: '/channel/list',
    meta: {
      icon: 'PieChartOutlined',
      title: '渠道管理',
      isAffix: false,
      isFull: false,
      isHide: false,
      isKeepAlive: false,
      isLink: ''
    },
    children: [
      /*渠道账号*/
      {
        key: '1-1',
        name: 'ChannelList',
        path: '/channel/list',
        component: () => import(/* webpackChunkName: "channel" */ '@/views/channelManage/list.vue'),
        meta: {
          icon: 'PieChartOutlined',
          title: '渠道账户',
          isAffix: false,
          isFull: false,
          isHide: false,
          isKeepAlive: false,
          isLink: '',
          activeMenu: '1-1'
        }
      },
      /*消息模板*/
      {
        key: '1-2',
        name: 'MessageMouldList',
        path: '/message/mould/list',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/list.vue'),
        meta: {
          icon: 'PieChartOutlined',
          title: '消息模板',
          isAffix: false,
          isFull: false,
          isHide: false,
          isKeepAlive: false,
          isLink: '',
          activeMenu: '1-2'
        }
      },
      {
        name: 'MessageMouldCreate',
        path: '/message/mould/:type',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/edit.vue'),
        meta: {
          title: '消息模板创建',
          isAffix: false,
          isFull: false,
          isHide: true,
          isKeepAlive: false,
          isLink: '',
          activeMenu: '1-2'
        }
      },
      {
        name: 'MessageMouldEdit',
        path: '/message/mould/:type/:id',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/edit.vue'),
        meta: {
          title: '消息模板更新',
          isAffix: false,
          isFull: false,
          isHide: true,
          isKeepAlive: false,
          isLink: '',
          activeMenu: '1-2'
        }
      },
      {
        name: 'MessageMouldDetail',
        path: '/message/mould/:type/:id',
        component: () => import(/* webpackChunkName: "MessageMould" */ '@/views/messageMould/edit.vue'),
        meta: {
          title: '消息模板详情',
          isAffix: false,
          isFull: false,
          isHide: true,
          isKeepAlive: false,
          isLink: '',
          activeMenu: '1-2'
        }
      }
    ]
  }
];
