import { filterEnum } from '@/utils/utils';
export const adminTableColumns = [
  {
    dataIndex: 'userName',
    title: '账号',
    ellipsis: true
  },
  {
    dataIndex: 'realName',
    title: '姓名',
    ellipsis: true
  },
  {
    dataIndex: 'phoneNumber',
    title: '手机号'
  },
  {
    dataIndex: 'companyRoleList',
    title: '角色设置',
    width: 300
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    // disabled: true,
    width: 180
  }
];
export const tansferTableColumns = [
  {
    dataIndex: 'sex',
    title: '性别'
  },

  {
    dataIndex: 'realName',
    title: '姓名'
  },
  {
    dataIndex: 'userName',
    title: '账号'
  },
  {
    dataIndex: 'phoneNumber',
    title: '手机号'
  }
];
// 表单配置
export const formConfig = [
  {
    label: '',
    value: 'realName',
    el: 'input',
    props: {
      placeholder: '姓名'
    }
  }
];
