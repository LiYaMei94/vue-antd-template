import { isNull } from '@/utils/utils';
// 表单校验规则
export const formRulesValidator = {
  menuName: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{1,8}$/;
    if (isNull(value)) {
      return Promise.reject('请输入菜单名称');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入汉字、英文、数值、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  icon: async (_rule, value) => {
    const reg = /^(?:[a-zA-Z][+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{0,49})?$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入英文、数值、常用符号，且以英文开头');
    } else {
      return Promise.resolve();
    }
  },
  iconRequired: async (_rule, value) => {
    const reg = /^(?:[a-zA-Z][+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{0,49})?$/;
    if (isNull(value)) {
      return Promise.reject('请输入图标名称');
    } else if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入英文、数值、常用符号，且以英文开头');
    } else {
      return Promise.resolve();
    }
  },
  path: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{0,200}$/;
    if (isNull(value)) {
      return Promise.reject('请输入路由地址');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入英文、数值、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  redirectPath: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{0,200}$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入英文、数值、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  perms: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{0,200}$/;
    if (isNull(value)) {
      return Promise.reject('请输入权限标识');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入英文、数值、常用符号');
    } else {
      return Promise.resolve();
    }
  }
};

export const rules = {
  menuName: [
    {
      required: true,
      validator: formRulesValidator?.menuName
    }
  ],
  icon: [
    {
      validator: formRulesValidator?.icon
    }
  ],
  orderNum: [{ required: true }]
};
