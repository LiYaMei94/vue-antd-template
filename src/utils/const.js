export const ACCESS_TOKEN = 'ACCESS-TOKEN';

export const CREATE = 'create';
export const EDIT = 'edit';
export const DETAIL = 'detail';

export const PAGE_TITLE_MAP = {
  [CREATE]: '添加',
  [EDIT]: '编辑',
  [DETAIL]: '查看'
};

export const PAGE_ROUTE_NAME_MAP = {
  [CREATE]: 'Create',
  [EDIT]: 'Edit',
  [DETAIL]: 'Detail'
};

export const ROUTE_MENU_TYPE_TOP = 'top'; // 顶部菜单
export const ROUTE_MENU_TYPE_SIDE = 'side'; // 侧边栏菜单
export const ROUTE_MENU_LAYOUT_FULLSCREEN = 'fullScreen'; // 菜单页面全屏
export const ROUTE_MENU_LAYOUT_BASIC = 'basic'; // 菜单页面基本布局(上、中(侧边栏-内容)、下)
export const ROUTE_MENU_LAYOUT_UPPER_MIDDLE = 'upperMiddle'; // 菜单页面布局(上、中、下)
export const ROUTE_MENU_MAP = {
  [ROUTE_MENU_LAYOUT_UPPER_MIDDLE]: 'UpperMiddleLayout',
  [ROUTE_MENU_LAYOUT_BASIC]: 'BasicLayout',
  [ROUTE_MENU_LAYOUT_FULLSCREEN]: null
};
