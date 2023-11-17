import { isNull } from '@/utils/utils';

// 表单校验规则
export const formRulesValidator = {
  userName: async (_rule, value) => {
    const reg = /^[a-z0-9]{4,20}$/;
    if (isNull(value)) {
      return Promise.reject('请输入账号');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入4~20位小写英文字母、数字');
    } else {
      return Promise.resolve();
    }
  },
  realName: async (_rule, value) => {
    const reg = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
    if (isNull(value)) {
      return Promise.reject('请输入姓名');
    } else if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入2~20位汉字、大小写英文字母');
    } else {
      return Promise.resolve();
    }
  },
  phoneNumber: async (_rule, value) => {
    const reg = /^1[3-9]\d{9}$/;
    if (isNull(value)) {
      return Promise.reject('请输入电话');
    } else if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入11位正确号码');
    } else {
      return Promise.resolve();
    }
  },
  jobNum: async (_rule, value) => {
    const reg = /^[a-z0-9]{0,20}$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入20位以内小写英文字母、数字');
    } else {
      return Promise.resolve();
    }
  }
};

export const rules = {
  userName: [
    {
      required: true,
      validator: formRulesValidator?.userName
    }
  ],
  realName: [
    {
      required: true,
      validator: formRulesValidator?.realName
    }
  ],
  phoneNumber: [{ required: true, validator: formRulesValidator?.phoneNumber }],
  sex: [{ required: true }],
  status: [{ required: true }],
  companyOrgId: [{ required: true }],
  jobNum: [{ validator: formRulesValidator?.jobNum }]
};
