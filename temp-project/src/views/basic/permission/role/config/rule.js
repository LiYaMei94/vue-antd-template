import { isNull } from '@/utils/utils';

// 表单校验规则
const formRulesValidator = {
  roleName: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{1,20}$/;
    if (isNull(value)) {
      return Promise.reject('请输入角色名称');
    } else if (!reg.test(value)) {
      return Promise.reject('角色名称输入范围：中文、英文、数字、常见的特殊字符，1~20个字符');
    } else {
      return Promise.resolve();
    }
  },
  remark: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{0,200}$/;
    if (!reg.test(value)) {
      return Promise.reject('备注输入范围：中文、英文、数字、常见的特殊字符，0~200个字符');
    } else {
      return Promise.resolve();
    }
  }
};

export const rules = {
  roleName: [
    {
      required: true,
      validator: formRulesValidator?.roleName
    }
  ],
  roleType: [
    {
      required: true
    }
  ],
  remark: [
    {
      required: false,
      validator: formRulesValidator?.remark
    }
  ]
};
