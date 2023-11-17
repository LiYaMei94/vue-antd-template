export const ACCESS_TOKEN = 'ACCESS-TOKEN';

export const CREATE = 'create';
export const EDIT = 'edit';
export const DETAIL = 'detail';
export const AUTH = 'authConfig';

export const PAGE_TITLE_MAP = {
  [CREATE]: '新增',
  [EDIT]: '编辑',
  [DETAIL]: '查看'
};

export const PAGE_ROUTE_NAME_MAP = {
  [CREATE]: 'Create',
  [EDIT]: 'Edit',
  [DETAIL]: 'Detail'
};

export const CONST_STRING_0 = '0'; // 失败、关闭、停用、否
export const CONST_STRING_1 = '1'; // 成功、打开、启用、是

// 成功、失败枚举
export const SUCCESS_FAIL_STATUS_ENUM = [
  {
    label: '成功',
    value: CONST_STRING_1,
    color: 'blue'
  },
  {
    label: '失败',
    value: CONST_STRING_0,
    color: 'red'
  }
];

// 启用、停用枚举
export const ENABLE_DISABLE_STATUS_ENUM = [
  {
    label: '启用',
    value: CONST_STRING_1,
    color: 'blue'
  },
  {
    label: '停用',
    value: CONST_STRING_0,
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

export const COLLAPSED = 'COLLAPSED';
export const CHECK_ALL = 'CHECK_ALL';
export const PC_LINK = 'PC_LINK';
export const TREE_SELECT_TYPE = [
  {
    label: '展开/折叠',
    value: COLLAPSED,
    disabled: false
  },
  {
    label: '全选/全不选',
    value: CHECK_ALL,
    disabled: false
  },
  {
    label: '父子联动',
    value: PC_LINK,
    disabled: true
  }
];

// 菜单类型
export const MENU_TYPE_R = 'R';
export const MENU_TYPE_T = 'T';
export const MENU_TYPE_C = 'C';
export const MENU_TYPE_F = 'F';
export const MENU_TYPE_MAP = [
  // {
  //   label: '模块',
  //   value: MENU_TYPE_R
  // },
  {
    label: '顶部导航',
    value: MENU_TYPE_T
  },
  {
    label: '菜单',
    value: MENU_TYPE_C
  },
  {
    label: '按钮',
    value: MENU_TYPE_F
  }
];

export const YES_OR_NO = [
  {
    label: '是',
    value: CONST_STRING_1,
    color: 'blue'
  },
  {
    label: '否',
    value: CONST_STRING_0,
    color: '#ddd'
  }
];

export const MENU_HIDDEN_TYPE = [
  {
    label: '显示',
    value: CONST_STRING_1,
    color: 'blue'
  },
  {
    label: '隐藏',
    value: CONST_STRING_0,
    color: '#ddd'
  }
];

// 角色类型
export const SYSTEM_MANAGE = 1; // 系统管理
export const FIRM_MANAGE = 2; // 企业管理
export const BUSINNES_MANAGE = 3; // 业务角色
export const ROLE_TYPE_MAP = [
  {
    value: SYSTEM_MANAGE,
    label: '系统管理员'
  },
  {
    value: FIRM_MANAGE,
    label: '企业管理员'
  },
  {
    value: BUSINNES_MANAGE,
    label: '业务'
  }
];

// 协议
export const HTTP_STR = 'http';
export const HTTPS_STR = 'https';
export const AGREEMENT_ENUM = [
  {
    label: 'http://',
    value: HTTP_STR
  },
  {
    label: 'https://',
    value: HTTPS_STR
  }
];

// 角色类型枚举
export const DISABLED_ACTION_ROLE_TYPE = ['1', '2', '3', '4'];
// export const ROLE_TYPE_ENUM = [
//   {
//     roleTypeName: '超级管理员角色',
//     roleType: '1'
//   },
//   {
//     roleTypeName: '项目管理员角色',
//     roleType: '2'
//   },
//   {
//     roleTypeName: '平台管理员角色',
//     roleType: '3'
//   },
//   {
//     roleTypeName: '企业管理员角色',
//     roleType: '4'
//   },
//   {
//     roleTypeName: '项目经理角色',
//     roleType: '5'
//   }
// ];

// 文件类型
export const FILE_ACCEPT_ENUM = [
  {
    value: 'ppt',
    label: 'ppt'
  },
  {
    value: 'pptx',
    label: 'pptx'
  },
  {
    value: 'pdf',
    label: 'pdf'
  }
];
// 角色类型
export const ROLE_TYPE_ENUM = [
  {
    label: '系统角色',
    value: '1'
  },
  {
    label: '公司角色',
    value: '2'
  },
  {
    label: '项目角色',
    value: '3'
  }
];
