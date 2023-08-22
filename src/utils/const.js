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

export const CONST_0 = 0; // 启用、开、成功、否、隐藏
export const CONST_1 = 1; // 停用、关、失败、是、显示
export const CONST_STRING_0 = '0'; // 启用、开、成功、否、隐藏
export const CONST_STRING_1 = '1'; // 停用、关、失败、是、显示

// 成功、失败枚举
export const SUCCESS_FAIL_STATUS_ENUM = [
  {
    label: '成功',
    value: CONST_STRING_0,
    color: 'blue'
  },
  {
    label: '失败',
    value: CONST_STRING_1,
    color: 'red'
  }
];

// 启用、停用枚举
export const ENABLE_DISABLE_STATUS_ENUM = [
  // {
  //   label: '全部',
  //   value: null
  // },
  {
    label: '启用',
    value: CONST_STRING_0,
    color: 'blue'
  },
  {
    label: '停用',
    value: CONST_STRING_1,
    color: '#ddd'
  }
];

export const PAGE_LAYOUT = [
  {
    value: CONST_STRING_1,
    label: '默认',
    icon: 'icon-icon-',
    style: 'font-size: 53px;color: #7D7D7D;'
  },
  {
    value: CONST_STRING_0,
    label: '全屏',
    icon: 'icon-juxing1',
    style: 'font-size: 57px;color: #7D7D7D;'
  }
];
